import { supabase } from '@/integrations/supabase/client';
import { FinancialRecord } from './csvParser';

export interface DBFinancialRecord {
  id: string;
  user_id: string;
  date: string;
  amazon_sales: number;
  flipkart_sales: number;
  website_sales: number;
  offline_sales: number;
  gross_sales: number;
  total_orders: number;
  net_sales: number;
  cogs: number;
  returns: number;
  marketing_spend_digital: number;
  marketing_spend_offline: number;
  platform_fees: number;
  net_profit_loss: number;
  created_at: string;
  updated_at: string;
}

const convertToDBFormat = (record: FinancialRecord, userId: string): any => {
  return {
    user_id: userId,
    date: record.date.toISOString().split('T')[0],
    amazon_sales: record.amazonSales,
    flipkart_sales: record.flipkartSales,
    website_sales: record.websiteSales,
    offline_sales: record.offlineSales,
    myntra_sales: record.myntraSales,
    meesho_sales: record.meeshoSales,
    gross_sales: record.grossSales,
    total_orders: record.totalOrders,
    average_order_value: record.averageOrderValue,
    net_sales: record.netSales,
    cogs: record.cogs,
    gross_profit: record.grossProfit,
    returns: record.returns,
    marketing_spend_digital: record.marketingSpendDigital,
    marketing_spend_offline: record.marketingSpendOffline,
    total_marketing_spend: record.totalMarketingSpend,
    platform_fees: record.platformFees,
    contribution_margin: record.contributionMargin,
    fixed_cost_allocation: record.fixedCostAllocation,
    net_profit_loss: record.netProfitLoss,
    debt_repayment_cash_out: record.debtRepaymentCashOut,
    net_cash_flow: record.netCashFlow,
    myntra_profit: record.myntraProfit,
    meesho_profit: record.meeshoProfit,
    flipkart_profit: record.flipkartProfit,
    profitability_label: record.profitabilityLabel,
    performance_category: record.performanceCategory,
    marketing_efficiency_ratio: record.marketingEfficiencyRatio,
    marketing_efficiency_label: record.marketingEfficiencyLabel,
    dominant_sales_channel: record.dominantSalesChannel,
  };
};

const convertFromDBFormat = (dbRecord: DBFinancialRecord): FinancialRecord => {
  const date = new Date(dbRecord.date);
  return {
    date,
    dateStr: dbRecord.date,
    amazonSales: dbRecord.amazon_sales,
    flipkartSales: dbRecord.flipkart_sales,
    websiteSales: dbRecord.website_sales,
    offlineSales: dbRecord.offline_sales,
    myntraSales: (dbRecord as any).myntra_sales || 0,
    meeshoSales: (dbRecord as any).meesho_sales || 0,
    grossSales: dbRecord.gross_sales,
    totalOrders: dbRecord.total_orders,
    averageOrderValue: dbRecord.total_orders > 0 ? dbRecord.gross_sales / dbRecord.total_orders : 0,
    netSales: dbRecord.net_sales,
    cogs: dbRecord.cogs,
    grossProfit: dbRecord.gross_sales - dbRecord.cogs,
    platformFees: dbRecord.platform_fees,
    marketingSpendDigital: dbRecord.marketing_spend_digital,
    marketingSpendOffline: dbRecord.marketing_spend_offline,
    totalMarketingSpend: dbRecord.marketing_spend_digital + dbRecord.marketing_spend_offline,
    contributionMargin: dbRecord.gross_sales - dbRecord.cogs - dbRecord.marketing_spend_digital - dbRecord.marketing_spend_offline - dbRecord.platform_fees,
    fixedCostAllocation: 0,
    netProfitLoss: dbRecord.net_profit_loss,
    debtRepaymentCashOut: 0,
    netCashFlow: dbRecord.net_profit_loss,
    returns: dbRecord.returns,
    myntraProfit: (dbRecord as any).myntra_profit,
    meeshoProfit: (dbRecord as any).meesho_profit,
    flipkartProfit: (dbRecord as any).flipkart_profit,
    profitabilityLabel: (dbRecord as any).profitability_label,
    performanceCategory: (dbRecord as any).performance_category,
    marketingEfficiencyRatio: (dbRecord as any).marketing_efficiency_ratio,
    marketingEfficiencyLabel: (dbRecord as any).marketing_efficiency_label,
    dominantSalesChannel: (dbRecord as any).dominant_sales_channel,
  };
};

export const saveFinancialRecords = async (records: FinancialRecord[], userId: string): Promise<void> => {
  // First, delete existing records for this user
  await supabase
    .from('financial_records')
    .delete()
    .eq('user_id', userId);

  // Insert new records
  const dbRecords = records.map(record => convertToDBFormat(record, userId));
  
  const { error } = await supabase
    .from('financial_records')
    .insert(dbRecords);

  if (error) {
    console.error('Error saving financial records:', error);
    throw error;
  }
};

export const getFinancialRecords = async (userId: string): Promise<FinancialRecord[]> => {
  const { data, error } = await supabase
    .from('financial_records')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching financial records:', error);
    throw error;
  }

  return (data || []).map(convertFromDBFormat);
};

export const deleteFinancialRecords = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('financial_records')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting financial records:', error);
    throw error;
  }
};
