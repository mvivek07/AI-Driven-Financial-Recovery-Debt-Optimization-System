import os
import sys
import shutil
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg') # Use a non-interactive backend for Matplotlib
import matplotlib.pyplot as plt
import seaborn as sns
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify, session, send_from_directory
from flask_cors import CORS

# LangChain and AI Imports
import google.generativeai as genai
from langchain_community.document_loaders import PyPDFLoader, TextLoader, DirectoryLoader
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI, HarmCategory, HarmBlockThreshold
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_experimental.agents.agent_toolkits import create_csv_agent
from transformers import AutoformerForPrediction, AutoformerConfig
import torch

# Local chart utilities
try:
    from charts import generate_chart
except Exception:
    generate_chart = None

# Load environment variables from .env file
load_dotenv()

# Configure the API key globally
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    print("SUCCESS: Google API key configured successfully.")
except Exception as e:
    print(f"ERROR: Failed to configure Google API key. Please check your .env file. Error: {e}")
    sys.exit(1)

# --- Flask App Initialization ---
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:8080", "supports_credentials": True}})
app.secret_key = os.environ.get("SECRET_KEY", os.urandom(24))
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['STATIC_FOLDER'] = 'static'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['STATIC_FOLDER'], exist_ok=True)

# --- Global Variables & Pre-loading ---
KNOWLEDGE_BASE_PATH = "knowledge_base"
FAISS_INDEX_PATH = "faiss_index"

llm = ChatGoogleGenerativeAI(
    model="gemini-pro-latest",
    temperature=0.1,
    safety_settings={
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
    },
)

# Initialize embeddings with offline mode and error handling
try:
    # Try to load embeddings with offline mode first
    embeddings = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True}
    )
    print("SUCCESS: HuggingFace embeddings loaded successfully.")
except Exception as e:
    print(f"WARNING: Failed to load HuggingFace embeddings: {e}")
    print("INFO: Attempting to use offline mode...")
    try:
        # Try offline mode
        embeddings = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
        print("SUCCESS: HuggingFace embeddings loaded in offline mode.")
    except Exception as e2:
        print(f"ERROR: Failed to load embeddings even in offline mode: {e2}")
        print("INFO: Application will run without knowledge base functionality.")
        embeddings = None

knowledge_chain = None

# --- Knowledge Base Pre-processing Function ---
def initialize_knowledge_base():
    """
    Loads documents from the knowledge_base, creates a vector store,
    and saves it to disk if it doesn't already exist.
    """
    global knowledge_chain
    
    # Check if embeddings are available
    if embeddings is None:
        print("WARNING: Embeddings not available. Knowledge base functionality disabled.")
        knowledge_chain = "Knowledge base unavailable - embeddings not loaded."
        return
    
    if os.path.exists(FAISS_INDEX_PATH):
        print("SUCCESS: Loading existing FAISS index for knowledge base.")
        try:
            vector_store = FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
        except Exception as e:
            print(f"ERROR: Failed to load existing FAISS index: {e}")
            print("INFO: Will attempt to recreate index...")
            knowledge_chain = "Knowledge base unavailable - index loading failed."
            return
    else:
        print("INFO: Creating new FAISS index for knowledge base...")
        os.makedirs(KNOWLEDGE_BASE_PATH, exist_ok=True)
        pdf_loader = DirectoryLoader(KNOWLEDGE_BASE_PATH, glob="**/*.pdf", loader_cls=PyPDFLoader, recursive=True)
        txt_loader = DirectoryLoader(KNOWLEDGE_BASE_PATH, glob="**/*.txt", loader_cls=TextLoader, recursive=True)
        documents = pdf_loader.load() + txt_loader.load()

        if not documents:
            print("WARNING: No documents found in the knowledge_base folder. Strategic advice will be limited.")
            knowledge_chain = "No knowledge base loaded."
            return

        try:
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
            texts = text_splitter.split_documents(documents)
            vector_store = FAISS.from_documents(texts, embeddings)
            vector_store.save_local(FAISS_INDEX_PATH)
            print(f"SUCCESS: Index created and saved to '{FAISS_INDEX_PATH}'.")
        except Exception as e:
            print(f"ERROR: Failed to create FAISS index: {e}")
            knowledge_chain = "Knowledge base unavailable - index creation failed."
            return

    try:
        retriever = vector_store.as_retriever(search_kwargs={'k': 3})
        knowledge_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=False
        )
        print("SUCCESS: Virtual CFO Knowledge Base is ready.")
    except Exception as e:
        print(f"ERROR: Failed to create knowledge chain: {e}")
        knowledge_chain = "Knowledge base unavailable - chain creation failed."

# --- Helper Functions for AI Models ---
def find_csv_columns(csv_path):
    """Detect a likely date column and a primary numeric value column.

    Heuristics:
    - Prefer columns whose name contains 'date'/'time' and whose parse success rate > 80%.
    - Otherwise, evaluate all object-like columns and pick the one with the highest parse success.
    - Choose a numeric value column that is not an id/year-like field.
    """
    try:
        df_sample = pd.read_csv(csv_path, nrows=500)
        date_candidates = list(df_sample.columns)

        def parse_rate(series):
            parsed = pd.to_datetime(series, errors='coerce', utc=False, dayfirst=False, infer_datetime_format=True)
            return parsed.notna().mean()

        # Score columns by name hint and parse success
        best_col = None
        best_score = 0.0
        for col in date_candidates:
            # Only attempt on non-numeric columns to avoid mis-parsing numeric values as dates
            if pd.api.types.is_numeric_dtype(df_sample[col]):
                continue
            score = parse_rate(df_sample[col])
            name_bonus = 0.3 if any(k in col.lower() for k in ['date', 'time', 'day', 'month']) else 0.0
            total = score + name_bonus
            if total > best_score:
                best_score = total
                best_col = col

        date_col = best_col if best_col and best_score >= 0.6 else None

        numeric_cols = [c for c in df_sample.select_dtypes(include=[np.number]).columns
                        if 'id' not in c.lower() and 'year' not in c.lower() and 'month' not in c.lower()]
        value_col = numeric_cols[-1] if numeric_cols else None

        return date_col, value_col
    except Exception as e:
        print(f"Error analyzing CSV columns: {e}")
        return None, None

def detect_anomalies(csv_path, date_col, value_col):
    """Detect anomalies in a numeric column using the IQR method and plot them."""
    if not value_col:
        return "Could not identify a primary numeric column for anomaly detection.", None
    
    df = pd.read_csv(csv_path)
    if value_col not in df.columns:
        return f"Column '{value_col}' not found.", None

    Q1 = df[value_col].quantile(0.25)
    Q3 = df[value_col].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR

    anomalies = df[(df[value_col] < lower_bound) | (df[value_col] > upper_bound)]

    if anomalies.empty:
        return "No significant anomalies detected in the data.", None
    
    plt.figure(figsize=(12, 6))
    sns.lineplot(data=df, x=date_col if date_col and date_col in df.columns else df.index, y=value_col, label='Data')
    sns.scatterplot(data=anomalies, x=date_col if date_col and date_col in df.columns else anomalies.index, y=value_col, color='red', s=100, label='Anomalies')
    plt.title(f'Anomaly Detection for {value_col}')
    plt.xlabel(date_col if date_col else 'Index')
    plt.ylabel(value_col)
    plt.legend()
    plt.grid(True)
    plot_path = os.path.join(app.config['STATIC_FOLDER'], 'anomaly_plot.png')
    plt.savefig(plot_path)
    plt.close()

    summary = f"Detected {len(anomalies)} potential anomalies in '{value_col}'. These are values significantly lower than {lower_bound:.2f} or higher than {upper_bound:.2f}."
    return summary, f'/{plot_path}'


def format_response_with_bold_tags(text):
    """Format response text by converting markdown bold to HTML bold tags and highlighting numbers."""
    import re
    
    # Convert markdown bold to HTML bold
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    
    # Highlight currency amounts and percentages
    text = re.sub(r'(₹[\d,]+\.?\d*)', r'<b>\1</b>', text)
    text = re.sub(r'([\d,]+\.?\d*%)', r'<b>\1</b>', text)
    
    # Highlight standalone numbers that might be metrics
    text = re.sub(r'\b(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\b(?=\s*(?:rows|entries|points|days|months|years))', r'<b>\1</b>', text)
    
    return text

def predict_timeseries(csv_path, date_col, value_col, prediction_length=12):
    """Predict future values using a lightweight linear trend over recent data and generate a plot.

    Also returns a short natural-language explanation derived from the latest
    historical values and forecast trajectory so the frontend can describe the
    chart meaningfully.
    """
    if not date_col or not value_col:
        return "Could not identify suitable date and value columns for forecasting.", None
        
    # Read CSV and parse only the detected date column
    df = pd.read_csv(csv_path)
    use_index = False
    if date_col and date_col in df.columns:
        df[date_col] = pd.to_datetime(df[date_col], errors='coerce')
        df = df.dropna(subset=[date_col])
        if df.empty:
            use_index = True
        else:
            df = df.sort_values(by=date_col).reset_index(drop=True)
    else:
        use_index = True
    
    data = df[value_col].astype(float).values
    # Use a recent window to fit a simple linear trend
    recent_window = int(min(max(10, prediction_length * 2), len(data)))
    y_recent = data[-recent_window:]
    x_recent = np.arange(len(y_recent), dtype=float)
    try:
        slope, intercept = np.polyfit(x_recent, y_recent, 1)
    except Exception:
        slope, intercept = 0.0, float(y_recent[-1]) if len(y_recent) else 0.0

    x_future = np.arange(len(y_recent), len(y_recent) + prediction_length, dtype=float)
    mean_prediction = (slope * x_future + intercept).tolist()

    if not use_index:
        freq = pd.infer_freq(df[date_col]) if len(df[date_col]) > 2 else 'D'
        last_date = df[date_col].iloc[-1]
        future_dates = pd.date_range(start=last_date, periods=prediction_length + 1, freq=freq)[1:]
    else:
        # Fallback to simple index-based x-axis
        future_dates = np.arange(len(df), len(df) + prediction_length)

    plt.figure(figsize=(12, 6))
    if not use_index:
        plt.plot(df[date_col], df[value_col], label='Historical Data')
        plt.plot(future_dates, mean_prediction, label='Forecast', linestyle='--')
        plt.xlabel(date_col)
    else:
        plt.plot(np.arange(len(df)), df[value_col], label='Historical Data')
        plt.plot(future_dates, mean_prediction, label='Forecast', linestyle='--')
        plt.xlabel('Index')
    plt.title(f'Forecast for {value_col}')
    plt.ylabel(value_col)
    plt.legend()
    plt.grid(True)
    plot_path = os.path.join(app.config['STATIC_FOLDER'], 'forecast_plot.png')
    plt.savefig(plot_path)
    plt.close()
    
    # Build a concise, data-grounded explanation
    recent_window = min(len(df), max(6, prediction_length))
    recent_series = df[value_col].tail(recent_window)
    recent_change = (recent_series.iloc[-1] - recent_series.iloc[0]) if recent_window > 1 else 0
    recent_pct = (recent_change / recent_series.iloc[0] * 100.0) if recent_window > 1 and recent_series.iloc[0] != 0 else 0
    forecast_change = mean_prediction[-1] - (recent_series.iloc[-1] if len(recent_series) else 0)
    forecast_dir = "increase" if forecast_change > 0 else ("decrease" if forecast_change < 0 else "remain roughly flat")

    summary = (
        f"Forecast generated for the next {prediction_length} periods. "
        f"Recent trend: {recent_pct:.1f}% change over the last {recent_window} observations. "
        f"The projection suggests a {forecast_dir} toward the horizon. See the chart for details."
    )
    return summary, f'/{plot_path}'

def plot_rate_of_change(csv_path, date_col, value_col, two_month_window=True):
    """Compute daily percentage rate of change, plot it, optionally aggregate by 2-month windows,
    save to static and also export a copy to the project root as 'amazon_sales_roc.png'. Additionally,
    forecast the rate-of-change series and save a separate forecast plot.
    """
    if not value_col:
        return "Could not identify a numeric column for rate-of-change.", None, None

    df = pd.read_csv(csv_path)
    if date_col and date_col in df.columns:
        df[date_col] = pd.to_datetime(df[date_col], errors='coerce')
        df = df.dropna(subset=[date_col])
        df = df.sort_values(by=date_col)
        x = df[date_col]
    else:
        df = df.reset_index().rename(columns={'index': 'idx'})
        x = df['idx']

    y = pd.to_numeric(df[value_col], errors='coerce')
    s = pd.Series(y.values, index=x)

    # If index is datetime-like, ensure daily frequency for ROC
    if isinstance(s.index, pd.DatetimeIndex):
        s = s.asfreq('D')
        s = s.interpolate(limit_direction='both')
    roc = s.pct_change().mul(100.0)

    plt.figure(figsize=(12, 6))
    plt.plot(roc.index, roc.values, marker='o', linestyle='-', linewidth=1, markersize=2)
    plt.title(f'Daily Rate of Change in {value_col} (%)')
    plt.xlabel('Date' if isinstance(roc.index, pd.DatetimeIndex) else 'Index')
    plt.ylabel('Percentage Change (%)')
    plt.grid(True, alpha=0.3)

    # Optional two-month window smoothing/aggregation
    if two_month_window and isinstance(roc.index, pd.DatetimeIndex):
        two_m = roc.resample('2MS').mean()  # mean at each 2-month start
        plt.plot(two_m.index, two_m.values, color='orange', linewidth=2, label='2-month avg')
        plt.legend()

    roc_path_static = os.path.join(app.config['STATIC_FOLDER'], 'roc_plot.png')
    plt.savefig(roc_path_static)
    plt.close()

    # Save an additional export copy in project root as requested
    export_copy = os.path.join(os.getcwd(), 'amazon_sales_roc.png')
    try:
        shutil.copyfile(roc_path_static, export_copy)
    except Exception as _:
        pass

    # Forecast the ROC series using the same linear-trend method
    if isinstance(roc.index, pd.DatetimeIndex):
        clean = roc.dropna()
        if len(clean) >= 5:
            y_recent = clean.values[-min(60, len(clean)) :]
            x_recent = np.arange(len(y_recent), dtype=float)
            try:
                slope, intercept = np.polyfit(x_recent, y_recent, 1)
            except Exception:
                slope, intercept = 0.0, float(y_recent[-1])
            horizon = 14
            x_future = np.arange(len(y_recent), len(y_recent) + horizon, dtype=float)
            y_future = slope * x_future + intercept
            last_date = clean.index[-1]
            future_idx = pd.date_range(last_date, periods=horizon + 1, freq='D')[1:]

            plt.figure(figsize=(12, 6))
            plt.plot(clean.index, clean.values, label='ROC (historical)')
            plt.plot(future_idx, y_future, linestyle='--', label='ROC forecast')
            plt.title('Rate-of-Change Forecast (%)')
            plt.xlabel('Date')
            plt.ylabel('Percentage Change (%)')
            plt.legend()
            plt.grid(True, alpha=0.3)
            roc_forecast_path = os.path.join(app.config['STATIC_FOLDER'], 'roc_forecast_plot.png')
            plt.savefig(roc_forecast_path)
            plt.close()
        else:
            roc_forecast_path = None
    else:
        roc_forecast_path = None

    summary = (
        "Computed daily percentage rate of change and generated the plot. "
        "A 2-month average line is included for smoother trends. An export copy was saved as 'amazon_sales_roc.png'."
    )
    return summary, f'/{roc_path_static}', (f'/{roc_forecast_path}' if roc_forecast_path else None)

def plot_linear_relationships(csv_path, date_col):
    """Find strong linear relations between numeric columns and plot them in subplots.
    We compute Pearson correlations and plot the top correlated pairs side-by-side.
    """
    df = pd.read_csv(csv_path)
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    if len(numeric_cols) < 2:
        return "Not enough numeric columns to assess linear relations.", None

    corr = df[numeric_cols].corr(method='pearson').abs()
    pairs = []
    for i, a in enumerate(numeric_cols):
        for b in numeric_cols[i+1:]:
            pairs.append(((a, b), corr.loc[a, b]))
    pairs.sort(key=lambda x: x[1], reverse=True)
    top_pairs = [p for p in pairs if np.isfinite(p[1])][:6]
    if not top_pairs:
        return "No clear linear relations found between numeric columns.", None

    n = len(top_pairs)
    rows = int(np.ceil(n / 2))
    fig, axes = plt.subplots(rows, 2, figsize=(12, 4*rows))
    axes = np.array(axes).reshape(-1)
    for idx, ((a, b), r) in enumerate(top_pairs):
        ax = axes[idx]
        ax.plot(df[a], label=a)
        ax.plot(df[b], label=b)
        ax.set_title(f"{a} vs {b} (|r|={r:.2f})")
        ax.legend()
        ax.grid(True, alpha=0.3)
    for j in range(idx+1, len(axes)):
        axes[j].axis('off')
    plt.tight_layout()
    out_path = os.path.join(app.config['STATIC_FOLDER'], 'linear_relations.png')
    plt.savefig(out_path)
    plt.close()
    return "Plotted top linear relations across numeric columns.", f'/{out_path}'

def plot_top_sales_channels(csv_path, date_col, value_col):
    """Detect a categorical 'channel' column and plot top 5 by total value_col."""
    df = pd.read_csv(csv_path)
    if not value_col or value_col not in df.columns:
        return "Could not identify a numeric value column for sales.", None
    # Find a categorical column with reasonable cardinality
    categorical_cols = [c for c in df.columns if not pd.api.types.is_numeric_dtype(df[c])]
    best_cat = None
    best_card = None
    for c in categorical_cols:
        unique = df[c].nunique(dropna=True)
        if 2 <= unique <= 20 and (best_card is None or unique < best_card):
            best_cat, best_card = c, unique
        if 'channel' in c.lower():
            best_cat = c
            break
    if not best_cat:
        return "No suitable categorical column found for channels.", None
    grouped = df.groupby(best_cat)[value_col].sum().sort_values(ascending=False).head(5)
    plt.figure(figsize=(10, 6))
    sns.barplot(x=grouped.values, y=grouped.index, orient='h')
    plt.title('Top 5 Sales Channels')
    plt.xlabel(value_col)
    plt.ylabel(best_cat)
    plt.grid(True, axis='x', alpha=0.2)
    out_path = os.path.join(app.config['STATIC_FOLDER'], 'top_channels.png')
    plt.savefig(out_path)
    plt.close()
    return f"Top 5 '{best_cat}' by total {value_col}.", f'/{out_path}'

# --- Flask Routes ---
@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        if 'file' not in request.files: return "No file part", 400
        file = request.files['file']
        if file.filename == '': return "No selected file", 400
        if file and file.filename.lower().endswith('.csv'):
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(filepath)
            session['csv_path'] = filepath
            return render_template('index.html', file_uploaded=True, filename=file.filename)
    return render_template('index.html', file_uploaded=False)

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.config['STATIC_FOLDER'], filename)

@app.route('/chat', methods=['POST'])
def chat():
    user_prompt = request.json.get("prompt", "").lower()
    csv_path = session.get('csv_path')
    response_data = {}

    if not user_prompt: return jsonify({"error": "No prompt provided."}), 400
    if not csv_path or not os.path.exists(csv_path): return jsonify({"error": "CSV file not found. Please upload a file first."}), 400

    try:
        date_col, value_col = find_csv_columns(csv_path)
        final_response_text = ""
        
        # --- Keyword-based Task Router ---
        
        # 1. Handle special tasks first
        # Rate-of-change / growth requests
        if any(k in user_prompt for k in ["rate of change", "roc", "growth rate", "percentage change"]):
            summary, roc_url, roc_forecast_url = plot_rate_of_change(csv_path, date_col, value_col, two_month_window=True)
            if roc_url: response_data['image_url'] = roc_url
            if roc_forecast_url: response_data['secondary_image_url'] = roc_forecast_url
            final_response_text = summary

        # Linear relationships across numeric columns
        elif any(k in user_prompt for k in ["linear relation", "linear relationship", "correlation", "sub plots", "subplots"]):
            summary, img_url = plot_linear_relationships(csv_path, date_col)
            if img_url: response_data['image_url'] = img_url
            final_response_text = summary

        # Top sales channels
        elif any(k in user_prompt for k in ["top 5", "top five", "best sales channel", "top sales channel", "top channels"]):
            summary, img_url = plot_top_sales_channels(csv_path, date_col, value_col)
            if img_url: response_data['image_url'] = img_url
            final_response_text = summary

        # Essential chart requests via charts.py if available
        elif any(k in user_prompt for k in ["line chart", "bar chart", "pie chart", "area chart", "scatter plot", "box plot", "heat map", "heatmap", "waterfall chart"]):
            if generate_chart is None:
                final_response_text = "Chart generator unavailable."
            else:
                # Map keywords to chart identifiers
                if "line" in user_prompt: chart_kind = 'line'
                elif "bar" in user_prompt and "stacked" not in user_prompt: chart_kind = 'bar'
                elif "pie" in user_prompt: chart_kind = 'pie'
                elif "area" in user_prompt: chart_kind = 'area'
                elif "scatter" in user_prompt: chart_kind = 'scatter'
                elif "box" in user_prompt: chart_kind = 'box'
                elif "waterfall" in user_prompt: chart_kind = 'waterfall'
                else: chart_kind = 'heatmap'
                msg, img_url = generate_chart(chart_kind, csv_path, date_col, value_col)
                if img_url: response_data['image_url'] = img_url
                # Ask knowledge base to explain using data context if available
                explanation = ""
                try:
                    if knowledge_chain and not isinstance(knowledge_chain, str):
                        kb_query = f"Explain the insights from a {chart_kind} derived from the uploaded dataset focusing on {value_col or 'key metrics'}. Provide CFO-level guidance."
                        kb_res = knowledge_chain.invoke({"query": kb_query})
                        explanation = kb_res.get('result', '')
                except Exception:
                    pass
                final_response_text = (msg + ("\n\n" + explanation if explanation else "")).strip()

        # Forecast/graph generic requests
        elif ("forecast" in user_prompt or "predict" in user_prompt 
            or "graph" in user_prompt or "chart" in user_prompt or "plot" in user_prompt or "compare" in user_prompt):
            summary, plot_url = predict_timeseries(csv_path, date_col, value_col)
            if plot_url: response_data['image_url'] = plot_url
            final_response_text = summary
            
        elif "anomaly" in user_prompt or "outlier" in user_prompt:
            summary, plot_url = detect_anomalies(csv_path, date_col, value_col)
            if plot_url: response_data['image_url'] = plot_url
            final_response_text = summary
            
        else:
            # 2. ALWAYS ANALYZE DATASET FIRST, THEN ADD KNOWLEDGE BASE INSIGHTS
            print("➡️ Analyzing dataset first, then adding knowledge base insights...")
            
            # ALWAYS get data insights first using CSV agent
            print("➡️ Analyzing dataset...")
            data_agent_prompt = f"""
            Analyze the financial dataset to answer: '{user_prompt}'
            
            INSTRUCTIONS:
            1. Extract relevant data points related to the user's question
            2. Calculate key metrics (totals, averages, trends, etc.)
            3. Provide specific numbers and insights from the dataset
            4. For sales questions, include exact values and comparisons
            5. For improvement questions, identify current performance metrics
            6. Your response MUST start with "Final Answer:"
            7. Be specific with numbers, dates, and amounts
            8. Always base your answer on the actual data in the CSV file
            
            User's question: {user_prompt}
            """

            csv_agent = create_csv_agent(
                llm,
                csv_path,
                verbose=False,
                allow_dangerous_code=True,
                agent_executor_kwargs={
                    "handle_parsing_errors": True
                },
                # Increase limits to reduce premature stopping on larger files/queries
                max_iterations=20,
                max_execution_time=90
            )

            data_insights = ""
            try:
                data_result = csv_agent.invoke({"input": data_agent_prompt})
                data_insights = data_result.get('output', "")
                
                if "Final Answer:" in data_insights:
                    data_insights = data_insights.split("Final Answer:")[-1].strip()
                    
            except Exception as agent_error:
                print(f"Data analysis failed: {agent_error}")
                data_insights = f"Unable to analyze dataset: {str(agent_error)}"
            
            # Get strategic advice from knowledge base if available
            strategic_advice = ""
            if knowledge_chain and not isinstance(knowledge_chain, str):
                print("➡️ Getting strategic advice from knowledge base...")
                try:
                    # Create enhanced query that includes data context
                    enhanced_query = f"{user_prompt}"
                    if data_insights:
                        enhanced_query += f"\n\nBased on this data context: {data_insights[:500]}..."
                    
                    strategy_result = knowledge_chain.invoke({"query": enhanced_query})
                    strategic_advice = strategy_result['result']
                except Exception as e:
                    print(f"Knowledge base query failed: {e}")
                    strategic_advice = "Unable to retrieve strategic advice from knowledge base."
            else:
                print("➡️ Knowledge base not available, skipping strategic advice...")
                strategic_advice = "Knowledge base unavailable - strategic advice not available."
            
            # ALWAYS combine insights into comprehensive response
            if data_insights and strategic_advice:
                final_response_text = f"""<b>📊 Data Analysis:</b>
{data_insights}

<b>💡 Strategic Recommendations:</b>
{strategic_advice}

<b>🎯 Action Plan:</b>
Based on your data showing {data_insights[:200]}..., I recommend focusing on the strategic insights above to drive improvement."""
            
            elif data_insights:
                final_response_text = f"<b>📊 Analysis Results:</b>\n{data_insights}"
            
            elif strategic_advice:
                final_response_text = f"<b>💡 Strategic Advice:</b>\n{strategic_advice}"
            
            else:
                final_response_text = "I need more context to provide a helpful analysis. Could you please be more specific about what you'd like to know?"

        # Format response with bold tags for better presentation
        final_response_text = format_response_with_bold_tags(final_response_text)
        
        response_data['response'] = final_response_text
        return jsonify(response_data)

    except Exception as e:
        print(f"Error during chat processing: {e}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# --- Main Application Execution ---
if __name__ == '__main__':
    if '--rebuild' in sys.argv:
        if os.path.exists(FAISS_INDEX_PATH):
            print(f"INFO: '--rebuild' flag detected. Deleting existing index '{FAISS_INDEX_PATH}'...")
            shutil.rmtree(FAISS_INDEX_PATH)
            print("SUCCESS: Index deleted.")
    
    initialize_knowledge_base()
    app.run(debug=True)