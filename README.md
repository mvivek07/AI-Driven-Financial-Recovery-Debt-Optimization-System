<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>

  <h1>💼 AI-Driven Financial Recovery & Debt Optimization System - Project Analysis</h1>

  <p>This is a comprehensive full-stack financial management and AI-powered analytics platform designed to help users manage finances, analyze data, and receive intelligent insights through an <strong>AI Virtual CFO assistant</strong>.</p>

  <div class="section">
    <h2>🏗️ Architecture Overview</h2>

    <h3>Frontend (React + TypeScript + Vite)</h3>
    <ul>
      <li>Framework: React 18 with TypeScript (Vite)</li>
      <li>UI Libraries: Material-UI, Radix UI, shadcn/ui</li>
      <li>Styling: TailwindCSS</li>
      <li>Animations: Framer Motion</li>
      <li>State Management: TanStack Query (React Query)</li>
      <li>Routing: React Router v6</li>
      <li>Charts: Recharts</li>
    </ul>

    <h3>Backend (Python Flask)</h3>
    <ul>
      <li>Framework: Flask with CORS</li>
      <li>AI/ML Stack: LangChain + Gemini Pro + HuggingFace + FAISS</li>
      <li>ML Libraries: PyTorch, Transformers</li>
      <li>Data: Pandas, NumPy, Matplotlib, Seaborn</li>
      <li>Database: Supabase (PostgreSQL)</li>
    </ul>
  </div>
    <h2>🧩 Core Features</h2>

    <h3>1. User Authentication & Management</h3>
    <ul>
      <li>Login/Signup integrated with Supabase</li>
      <li>User-specific data isolation & session management</li>
    </ul>

    <h3>2. Financial Data Management</h3>
    <p>Users manage four main financial entities:</p>
    <ul>
      <li><strong>Transactions:</strong> Income/expense tracking, categorization, date filters, live updates</li>
      <li><strong>Invoices:</strong> Create, track status (pending, paid, overdue), due dates</li>
      <li><strong>Loans:</strong> Track principal, interest, status, and loan portfolio analytics</li>
    </ul>

    <h3>3. Dashboard Analytics</h3>
    <p><strong>Main Dashboard (MainDashboard.tsx):</strong></p>
    <ul>
      <li>KPI Cards: Total income, expenses, invoices, loans</li>
      <li>Interactive charts: Bar, Pie, Area charts</li>
      <li>Invoice & loan distribution, recent transactions feed</li>
      <li>Real-time auto-refresh</li>
    </ul>

    <p><strong>Model Dashboard (Dashboard.tsx):</strong></p>
    <ul>
      <li>Time series analysis, category donut charts</li>
      <li>Top performing days, ROI, margin analysis</li>
      <li>CSV export & PDF reports</li>
    </ul>

    <h3>4. Virtual CFO AI Assistant (/vcfo)</h3>
    <ul>
      <li>Upload CSV → Backend processes via LangChain CSV Agent</li>
      <li>Uses Gemini Pro + FAISS + RAG for contextual financial insights</li>
      <li>Generates charts (Pie, Line, Area, Heatmaps, Waterfall)</li>
      <li>Performs anomaly detection, forecasting, correlation & ROI analysis</li>
      <li>Supports intelligent natural-language queries</li>
    </ul>

    <h3>Example Interactions:</h3>
    <ul>
      <li>“Show me a pie chart of sales by category”</li>
      <li>“Forecast next 12 months”</li>
      <li>“Detect anomalies in revenue”</li>
      <li>“How can I improve cash flow?”</li>
    </ul>

    <h3>5. Data Upload (/upload)</h3>
    <ul>
      <li>CSV upload interface with Supabase integration</li>
      <li>Automatic validation and parsing</li>
    </ul>
  </div>

    <h2>⚙️ Technical Implementation</h2>

    <h3>Flask Backend (app.py)</h3>
    <ul>
      <li><strong>Knowledge Base:</strong> Loads PDFs/texts → FAISS vector index for RAG</li>
      <li><strong>Chart Generation:</strong> Matplotlib/Seaborn auto-detects date/value columns</li>
      <li><strong>AI Pipeline:</strong> Query → CSV Agent → Knowledge Base → Gemini → Response</li>
      <li><strong>Formatting:</strong> Currency highlighting, HTML-rich outputs</li>
    </ul>

    <h3>Frontend Architecture</h3>
    <ul>
      <li>Pages: <code>Login.tsx</code>, <code>Signup.tsx</code>, <code>MainDashboard.tsx</code>, <code>VCFO.tsx</code></li>
      <li>Components: Charts, KPI cards, filters, forms</li>
      <li>Services: CSV Parser, Report Exporter, Supabase Service</li>
    </ul>

    <h3>Database Schema (Supabase)</h3>
    <table>
      <tr><th>Table</th><th>Description</th></tr>
      <tr><td>users</td><td>User profiles and authentication</td></tr>
      <tr><td>transactions</td><td>Income/Expense records</td></tr>
      <tr><td>invoices</td><td>Invoice records with status</td></tr>
      <tr><td>loans</td><td>Loan tracking</td></tr>
      <tr><td>financial_records</td><td>Uploaded CSV data</td></tr>
    </table>
  </div>

    <h2>🧠 AI/ML Technologies</h2>
    <ul>
      <li>Google Gemini Pro (LLM)</li>
      <li>LangChain for RAG, CSV Agents, RetrievalQA</li>
      <li>HuggingFace Sentence Transformers</li>
      <li>FAISS for semantic vector search</li>
      <li>PyTorch for model integration</li>
      <li>Autoformer (imported, fallback: linear trend models)</li>
    </ul>
  </div>

  <div class="section">
    <h2>🔁 Key Workflows</h2>

    <h3>Typical User Journey</h3>
    <ul>
      <li>Sign up / Log in</li>
      <li>Add transactions, invoices, or loans</li>
      <li>Upload CSV data for AI analysis</li>
      <li>View dashboards for insights</li>
      <li>Chat with Virtual CFO for recommendations</li>
      <li>Export reports</li>
    </ul>

    <h3>Virtual CFO Analysis Flow</h3>
    <ol>
      <li>User uploads CSV → Flask stores it</li>
      <li>User queries → LangChain processes → Chart or Text result</li>
      <li>AI merges data + strategy → Returns insight</li>
      <li>Frontend displays chart + text in chat UI</li>
    </ol>
  </div>

    <h2>🔐 Security & Best Practices</h2>
    <ul>
      <li>Environment Variables for all API keys</li>
      <li>CORS configured for localhost:8080</li>
      <li>Flask session management for CSV state</li>
      <li>Supabase Row-Level Security (RLS)</li>
      <li>Safe LangChain execution with error handling</li>
    </ul>
  </div>

    <h2>🧑‍💻 Development Setup</h2>
    <pre><code>Frontend: npm run dev (Vite on port 8080)
Backend: python app.py (Flask on port 5000)
Database: Supabase (cloud instance)</code></pre>
  </div>

  <div class="section">
    <h2>🧾 Summary</h2>
    <p>
      This production-ready SaaS blends traditional CRUD operations with 
      <strong>AI-driven financial analytics</strong>. The <strong>Virtual CFO</strong> feature uses RAG architecture 
      to deliver intelligent, data-backed strategic advice, 
      distinguishing it from typical financial management tools.
    </p>
  </div>

</body>
</html>
