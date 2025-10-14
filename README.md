<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI-Driven Financial Recovery & Debt Optimization System - Project Analysis</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            background-color: #f8f9fa;
            color: #343a40;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        h1, h2, h3 {
            color: #212529;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 10px;
            margin-top: 1.5em;
        }
        h1 {
            font-size: 2.2em;
            text-align: center;
            border-bottom: 3px solid #007bff;
        }
        h2 {
            font-size: 1.8em;
        }
        h3 {
            font-size: 1.4em;
            border-bottom: 1px solid #dee2e6;
        }
        ul, ol {
            padding-left: 20px;
        }
        li {
            margin-bottom: 10px;
        }
        code {
            background-color: #e9ecef;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
            font-size: 0.9em;
        }
        strong {
            color: #0d6efd;
        }
        p {
            margin-bottom: 1em;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>AI-Driven Financial Recovery & Debt Optimization System - Project Analysis</h1>

        <p>This is a comprehensive full-stack financial management and AI-powered analytics platform designed to help users manage their finances, analyze data, and get intelligent insights through an AI Virtual CFO assistant.</p>

        <section id="architecture">
            <h2>Architecture Overview</h2>

            <h3>Frontend (React + TypeScript + Vite)</h3>
            <ul>
                <li><strong>Framework:</strong> React 18 with TypeScript, Vite build tool</li>
                <li><strong>UI Libraries:</strong>
                    <ul>
                        <li>Material-UI (MUI) for components</li>
                        <li>Radix UI + shadcn/ui for modern UI components</li>
                        <li>TailwindCSS for styling</li>
                        <li>Framer Motion for animations</li>
                    </ul>
                </li>
                <li><strong>State Management:</strong> TanStack Query (React Query)</li>
                <li><strong>Routing:</strong> React Router v6</li>
                <li><strong>Charts:</strong> Recharts library for data visualization</li>
            </ul>

            <h3>Backend (Python Flask)</h3>
            <ul>
                <li><strong>Framework:</strong> Flask with CORS support</li>
                <li><strong>AI/ML Stack:</strong>
                    <ul>
                        <li>Google Gemini Pro (via LangChain) for conversational AI</li>
                        <li>HuggingFace Embeddings (all-MiniLM-L6-v2) for text embeddings</li>
                        <li>FAISS for vector storage and similarity search</li>
                        <li>LangChain for RAG (Retrieval-Augmented Generation)</li>
                        <li>PyTorch + Transformers for ML models</li>
                    </ul>
                </li>
                <li><strong>Data Processing:</strong> Pandas, NumPy, Matplotlib, Seaborn</li>
                <li><strong>Database:</strong> Supabase (PostgreSQL) for user data storage</li>
            </ul>
        </section>

        <section id="features">
            <h2>Core Features</h2>
            <ol>
                <li>
                    <h3>User Authentication & Management</h3>
                    <ul>
                        <li>Login/Signup system integrated with Supabase</li>
                        <li>User-specific data isolation</li>
                        <li>Session management</li>
                    </ul>
                </li>

                <li>
                    <h3>Financial Data Management</h3>
                    <p>Users can manage four main financial entities:</p>
                    <ul>
                        <li><strong>Transactions (<code>/transactions</code>):</strong> Track income and expenses, categorize transactions, date-based filtering, and real-time updates via Supabase subscriptions.</li>
                        <li><strong>Invoices (<code>/invoices</code>):</strong> Create and manage invoices, track status (pending, paid, overdue), manage client information, and track due dates.</li>
                        <li><strong>Loans (<code>/loans</code>):</strong> Track loan details (principal, interest rate, monthly payment), monitor loan status (active, paid, defaulted), manage start/end dates, and get a real-time loan portfolio overview.</li>
                    </ul>
                </li>

                <li>
                    <h3>Dashboard Analytics (<code>/dashboard</code>, <code>/model</code>)</h3>
                    <p>Two comprehensive dashboards:</p>
                    <ul>
                        <li><strong>Main Dashboard (<code>MainDashboard.tsx</code>):</strong> Features KPI Cards, interactive charts (monthly income vs expenses, category breakdown, weekly trends), invoice and loan status distributions, a recent transactions feed, and real-time updates.</li>
                        <li><strong>Model Dashboard (<code>Dashboard.tsx</code>):</strong> Provides advanced analytics including time series analysis, category donut charts, top performing days, cumulative area charts, monthly comparisons, profit margin analysis, returns analysis, marketing ROI tracking, CSV export, and PDF report generation with data aggregation options.</li>
                    </ul>
                </li>

                <li>
                    <h3>Virtual CFO AI Assistant (<code>/vcfo</code>)</h3>
                    <p>This is the flagship feature - an AI-powered financial advisor:</p>
                    <h4>How It Works:</h4>
                    <ul>
                        <li><strong>CSV Upload:</strong> Users upload financial data (CSV files).</li>
                        <li><strong>AI Analysis:</strong> The Flask backend processes the data using a CSV Agent (LangChain), a Knowledge Base (RAG system with FAISS), and Google's Gemini Pro LLM.</li>
                    </ul>
                    <h4>Capabilities:</h4>
                    <ul>
                        <li><strong>Chart Generation:</strong> Creates Pie, Bar, Line, Area, Scatter, Box plots, Heatmaps, and Waterfall charts. Automatically detects date and value columns.</li>
                        <li><strong>Advanced Analytics:</strong> Includes Anomaly Detection, Time Series Forecasting, Rate of Change Analysis, and Correlation Analysis.</li>
                        <li><strong>Intelligent Q&A:</strong> Allows users to ask natural language questions about their data, get data-driven insights, and receive strategic recommendations from the knowledge base.</li>
                    </ul>
                    <h4>Example Interactions:</h4>
                    <ul>
                        <li><em>"Show me a pie chart of sales by category"</em></li>
                        <li><em>"What are the top 5 sales channels?"</em></li>
                        <li><em>"Forecast next 12 months"</em></li>
                        <li><em>"Detect anomalies in revenue"</em></li>
                        <li><em>"How can I improve cash flow?"</em> (triggers strategic advice)</li>
                    </ul>
                </li>

                <li>
                    <h3>Data Upload (<code>/upload</code>)</h3>
                    <ul>
                        <li>CSV file upload interface</li>
                        <li>Data validation and parsing</li>
                        <li>Integration with Supabase storage</li>
                    </ul>
                </li>
            </ol>
        </section>
        
        <section id="implementation">
            <h2>Technical Implementation Details</h2>
            
            <h3>Flask Backend (<code>virtual-cfo-flask/app.py</code>)</h3>
            <ul>
                <li><strong>Knowledge Base System:</strong> Loads documents from <code>knowledge_base/</code>, creates a FAISS vector index for semantic search (RAG), and caches the index for fast loading.</li>
                <li><strong>Chart Generation (<code>charts.py</code>):</strong> Uses Matplotlib/Seaborn, performs automatic column detection, saves charts to the <code>static/</code> folder, and returns image URLs to the frontend.</li>
                <li><strong>AI Processing Pipeline:</strong> User Query → CSV Agent (data analysis) → Knowledge Base (strategic advice) → Gemini Pro (synthesis) → Formatted Response.</li>
                <li><strong>Smart Column Detection:</strong> Heuristic-based date and numeric column detection.</li>
                <li><strong>Response Formatting:</strong> Cleans markdown syntax and highlights key numbers with HTML for better presentation.</li>
            </ul>

            <h3>Frontend Architecture</h3>
            <ul>
                <li><strong>Page Structure:</strong> Includes components like <code>Index.tsx</code>, <code>Login.tsx</code>, <code>Home.tsx</code>, <code>MainDashboard.tsx</code>, <code>VCFO.tsx</code>, and more for a structured application.</li>
                <li><strong>Component Library (<code>src/components/</code>):</strong> Contains reusable chart components, UI elements from shadcn/ui, and custom components like KPI cards and forms.</li>
                <li><strong>Services:</strong> Dedicated modules for CSV parsing (<code>csvParser.ts</code>), PDF exporting (<code>reportExporter.ts</code>), and Supabase data fetching (<code>financialRecordsService.ts</code>).</li>
            </ul>

            <h3>Database Schema (Supabase)</h3>
            <p>The system utilizes tables for <code>users</code>, <code>transactions</code>, <code>invoices</code>, <code>loans</code>, and <code>financial_records</code>. All tables are protected with Row-Level Security (RLS) policies for strict user data isolation.</p>
        </section>
        
        <section id="ai-tech">
            <h2>AI/ML Technologies</h2>
            <ul>
                <li><strong>Google Gemini Pro:</strong> Primary LLM for conversational AI.</li>
                <li><strong>LangChain:</strong> Framework for building AI applications, including RetrievalQA chains and CSV agents.</li>
                <li><strong>HuggingFace:</strong> Sentence transformers for generating embeddings.</li>
                <li><strong>FAISS:</strong> Vector database for efficient semantic search.</li>
                <li><strong>PyTorch:</strong> Deep learning framework.</li>
                <li><strong>Autoformer:</strong> Time series forecasting model (imported, but using simpler linear trends for current implementation).</li>
            </ul>
        </section>

        <section id="workflows">
            <h2>Key Workflows</h2>
            
            <h3>Typical User Journey:</h3>
            <ol>
                <li>Sign up / Log in.</li>
                <li>Add transactions, invoices, or loans manually.</li>
                <li>Upload CSV data for bulk analysis.</li>
                <li>View dashboards for insights.</li>
                <li>Chat with Virtual CFO for specific questions.</li>
                <li>Get AI-generated charts and recommendations.</li>
                <li>Export reports.</li>
            </ol>
            
            <h3>Virtual CFO Analysis Flow:</h3>
            <ol>
                <li>User uploads CSV → Flask stores it in the session.</li>
                <li>User asks a question → Flask routes to the appropriate handler.</li>
                <li>For charts: Generate visualization → Return image URL.</li>
                <li>For data questions: CSV agent analyzes data → Extract insights.</li>
                <li>For strategic questions: Query knowledge base → Get recommendations.</li>
                <li>Combine data insights + strategic advice → Format response → Send to frontend.</li>
                <li>Frontend displays the text and charts in the chat interface.</li>
            </ol>
        </section>

        <section id="security">
            <h2>Security & Best Practices</h2>
            <ul>
                <li><strong>Environment Variables:</strong> API keys stored securely in <code>.env</code> files.</li>
                <li><strong>CORS:</strong> Configured for the development frontend at <code>localhost:8080</code>.</li>
                <li><strong>Session Management:</strong> Flask sessions used for tracking user-specific CSV files.</li>
                <li><strong>RLS:</strong> Supabase Row-Level Security ensures robust data isolation.</li>
                <li><strong>Error Handling:</strong> Comprehensive <code>try-catch</code> blocks implemented.</li>
                <li><strong>Safe Code Execution:</strong> LangChain agents operate with controlled execution environments.</li>
            </ul>
        </section>

        <section id="setup">
            <h2>Development Setup</h2>
            <ul>
                <li><strong>Frontend:</strong> <code>npm run dev</code> (Vite dev server on port 8080)</li>
                <li><strong>Backend:</strong> <code>python app.py</code> (Flask server on port 5000)</li>
                <li><strong>Database:</strong> Supabase cloud instance.</li>
            </ul>
        </section>

        <section id="summary">
            <h2>Summary</h2>
            <p>This is a production-ready financial management SaaS with cutting-edge AI capabilities. It combines traditional CRUD operations with advanced AI-powered analytics, making it a comprehensive solution for personal or business financial management. The Virtual CFO feature leverages a RAG architecture to provide context-aware, data-driven financial advice, setting it apart from typical financial management tools.</p>
        </section>
    </div>

</body>
</html>
