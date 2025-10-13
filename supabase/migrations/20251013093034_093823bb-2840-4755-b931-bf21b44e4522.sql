-- Add additional columns to support different sales channels and metadata
ALTER TABLE public.financial_records
ADD COLUMN IF NOT EXISTS myntra_sales numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS meesho_sales numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS myntra_profit numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS meesho_profit numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS flipkart_profit numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_order_value numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS profitability_label text,
ADD COLUMN IF NOT EXISTS performance_category text,
ADD COLUMN IF NOT EXISTS marketing_efficiency_ratio numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS marketing_efficiency_label text,
ADD COLUMN IF NOT EXISTS dominant_sales_channel text,
ADD COLUMN IF NOT EXISTS gross_profit numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS contribution_margin numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS fixed_cost_allocation numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS debt_repayment_cash_out numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS net_cash_flow numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_marketing_spend numeric DEFAULT 0;

-- Add comment to table
COMMENT ON TABLE public.financial_records IS 'Flexible financial records table supporting multiple CSV formats and sales channels';