import os
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

STATIC_DIR = 'static'
os.makedirs(STATIC_DIR, exist_ok=True)

def generate_chart(chart_type, csv_path, date_col=None, value_col=None):
    df = pd.read_csv(csv_path)

    if date_col and date_col in df.columns:
        df[date_col] = pd.to_datetime(df[date_col], errors='coerce')

    msg = ""
    out_file = None

    if chart_type == 'line' and value_col:
        clean = df.dropna(subset=[date_col]) if date_col and date_col in df.columns else df
        clean = clean.sort_values(by=date_col) if date_col and date_col in clean.columns else clean
        plt.figure(figsize=(12, 6))
        x = clean[date_col] if date_col and date_col in clean.columns else np.arange(len(clean))
        y = clean[value_col]
        plt.plot(x, y)
        plt.title(f"{value_col} over time")
        plt.xlabel(date_col if date_col and date_col in clean.columns else 'Index')
        plt.ylabel(value_col)
        out_file = os.path.join(STATIC_DIR, 'line_chart.png')
        plt.grid(True, alpha=0.3)
        plt.savefig(out_file)
        plt.close()
        msg = f"Line chart for {value_col} generated."

    elif chart_type == 'bar' and value_col:
        cat_cols = [c for c in df.columns if not pd.api.types.is_numeric_dtype(df[c])]
        if not cat_cols:
            return "No categorical column found for bar chart.", None
        cat = cat_cols[0]
        grouped = df.groupby(cat)[value_col].sum().sort_values(ascending=False).head(10)
        plt.figure(figsize=(12, 6))
        sns.barplot(x=grouped.index, y=grouped.values)
        plt.xticks(rotation=45, ha='right')
        plt.title(f"{value_col} by {cat}")
        plt.ylabel(value_col)
        out_file = os.path.join(STATIC_DIR, 'bar_chart.png')
        plt.tight_layout()
        plt.savefig(out_file)
        plt.close()
        msg = f"Bar chart by {cat} generated."

    elif chart_type == 'pie' and value_col:
        cat_cols = [c for c in df.columns if not pd.api.types.is_numeric_dtype(df[c])]
        if not cat_cols:
            return "No categorical column found for pie chart.", None
        cat = cat_cols[0]
        grouped = df.groupby(cat)[value_col].sum().sort_values(ascending=False).head(6)
        plt.figure(figsize=(7, 7))
        plt.pie(grouped.values, labels=grouped.index, autopct='%1.1f%%', startangle=140)
        plt.title(f"{value_col} composition by {cat}")
        out_file = os.path.join(STATIC_DIR, 'pie_chart.png')
        plt.savefig(out_file)
        plt.close()
        msg = f"Pie chart generated."

    elif chart_type == 'area' and value_col:
        clean = df.dropna(subset=[date_col]) if date_col and date_col in df.columns else df
        clean = clean.sort_values(by=date_col) if date_col and date_col in clean.columns else clean
        plt.figure(figsize=(12, 6))
        x = clean[date_col] if date_col and date_col in clean.columns else np.arange(len(clean))
        y = clean[value_col]
        plt.fill_between(x, y, step=None, alpha=0.4)
        plt.plot(x, y)
        plt.title(f"Area chart for {value_col}")
        plt.xlabel(date_col if date_col and date_col in clean.columns else 'Index')
        plt.ylabel(value_col)
        out_file = os.path.join(STATIC_DIR, 'area_chart.png')
        plt.grid(True, alpha=0.3)
        plt.savefig(out_file)
        plt.close()
        msg = f"Area chart generated."

    elif chart_type == 'scatter':
        num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if len(num_cols) < 2:
            return "Not enough numeric columns for scatter plot.", None
        x_col, y_col = num_cols[:2]
        plt.figure(figsize=(8, 6))
        plt.scatter(df[x_col], df[y_col], alpha=0.6)
        plt.title(f"Scatter: {y_col} vs {x_col}")
        plt.xlabel(x_col)
        plt.ylabel(y_col)
        out_file = os.path.join(STATIC_DIR, 'scatter_plot.png')
        plt.grid(True, alpha=0.3)
        plt.savefig(out_file)
        plt.close()
        msg = f"Scatter plot generated."

    elif chart_type == 'box':
        num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if not num_cols:
            return "No numeric columns for box plot.", None
        plt.figure(figsize=(10, 6))
        sns.boxplot(data=df[num_cols])
        plt.title("Box plot of numeric columns")
        out_file = os.path.join(STATIC_DIR, 'box_plot.png')
        plt.tight_layout()
        plt.savefig(out_file)
        plt.close()
        msg = "Box plot generated."

    elif chart_type == 'heatmap':
        num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if len(num_cols) < 2:
            return "Not enough numeric columns for heatmap.", None
        plt.figure(figsize=(10, 8))
        sns.heatmap(df[num_cols].corr(), annot=True, cmap='coolwarm', fmt='.2f')
        plt.title('Correlation Heatmap')
        out_file = os.path.join(STATIC_DIR, 'heatmap.png')
        plt.tight_layout()
        plt.savefig(out_file)
        plt.close()
        msg = "Heatmap generated."

    elif chart_type == 'waterfall':
        # Try to detect core columns required for a financial waterfall
        lower_cols = {c.lower(): c for c in df.columns}
        def find_col(candidates):
            for key, orig in lower_cols.items():
                if any(term in key for term in candidates):
                    if pd.api.types.is_numeric_dtype(df[orig]):
                        return orig
            return None

        revenue_col = find_col(['revenue', 'sales', 'gross_sales', 'total_revenue', 'net_cash_in'])
        cogs_col = find_col(['cogs', 'cost_of_goods', 'cost of goods', 'cost'])
        opex_col = find_col(['opex', 'operating_exp', 'operating expenses', 'total_opex', 'expenses'])
        final_col = find_col(['operating_income', 'ebit', 'net_income', 'profit'])

        if not revenue_col or not (cogs_col or opex_col):
            return (
                "Cannot build a waterfall chart: required columns like Revenue and COGS/OpEx not found in the dataset.",
                None,
            )

        rev_total = pd.to_numeric(df[revenue_col], errors='coerce').sum(skipna=True)
        cogs_total = pd.to_numeric(df[cogs_col], errors='coerce').sum(skipna=True) if cogs_col else 0
        opex_total = pd.to_numeric(df[opex_col], errors='coerce').sum(skipna=True) if opex_col else 0
        if final_col:
            final_total = pd.to_numeric(df[final_col], errors='coerce').sum(skipna=True)
        else:
            final_total = rev_total - cogs_total - opex_total

        steps = [
            (revenue_col, rev_total),
            (cogs_col or 'COGS', -cogs_total),
            (opex_col or 'OpEx', -opex_total),
            (final_col or 'Operating_Income', final_total),
        ]

        # Build waterfall bars
        labels = [name for name, _ in steps]
        values = [val for _, val in steps]
        running = [0]
        for v in values[:-1]:
            running.append(running[-1] + v)

        fig, ax = plt.subplots(figsize=(12, 6))
        colors = []
        for i, v in enumerate(values):
            if i == 0:
                colors.append('#3b82f6')  # start
            elif i == len(values) - 1:
                colors.append('#22c55e')  # final
            else:
                colors.append('#ef4444' if v < 0 else '#22c55e')
        ax.bar(range(len(values)), values, bottom=running, color=colors)
        ax.set_xticks(range(len(values)))
        ax.set_xticklabels(labels, rotation=20, ha='right')
        ax.set_title('Waterfall Chart')
        ax.grid(True, axis='y', alpha=0.3)
        out_file = os.path.join(STATIC_DIR, 'waterfall_chart.png')
        plt.tight_layout()
        plt.savefig(out_file)
        plt.close()
        msg = (
            f"Waterfall: {revenue_col}={rev_total:,.0f}, "
            f"{cogs_col or 'COGS'}={-cogs_total:,.0f}, {opex_col or 'OpEx'}={-opex_total:,.0f}, "
            f"Final={final_total:,.0f}."
        )

    return msg if msg else "Unsupported chart or missing columns.", (f'/{out_file}' if out_file else None)