-- Create financial_records table to store CSV data
CREATE TABLE public.financial_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amazon_sales DECIMAL(10, 2) DEFAULT 0,
  flipkart_sales DECIMAL(10, 2) DEFAULT 0,
  website_sales DECIMAL(10, 2) DEFAULT 0,
  offline_sales DECIMAL(10, 2) DEFAULT 0,
  gross_sales DECIMAL(10, 2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  net_sales DECIMAL(10, 2) DEFAULT 0,
  cogs DECIMAL(10, 2) DEFAULT 0,
  returns DECIMAL(10, 2) DEFAULT 0,
  marketing_spend_digital DECIMAL(10, 2) DEFAULT 0,
  marketing_spend_offline DECIMAL(10, 2) DEFAULT 0,
  platform_fees DECIMAL(10, 2) DEFAULT 0,
  net_profit_loss DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own financial records" 
ON public.financial_records 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own financial records" 
ON public.financial_records 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own financial records" 
ON public.financial_records 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financial records" 
ON public.financial_records 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_financial_records_updated_at
BEFORE UPDATE ON public.financial_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_financial_records_user_id ON public.financial_records(user_id);
CREATE INDEX idx_financial_records_date ON public.financial_records(date);