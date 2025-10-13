import Papa from 'papaparse';
import { format, parse, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

export interface FinancialRecord {
  date: Date;
  dateStr: string;
  amazonSales: number;
  flipkartSales: number;
  websiteSales: number;
  offlineSales: number;
  myntraSales: number;
  meeshoSales: number;
  grossSales: number;
  totalOrders: number;
  averageOrderValue: number;
  returns: number;
  netSales: number;
  cogs: number;
  grossProfit: number;
  platformFees: number;
  marketingSpendDigital: number;
  marketingSpendOffline: number;
  totalMarketingSpend: number;
  contributionMargin: number;
  fixedCostAllocation: number;
  netProfitLoss: number;
  debtRepaymentCashOut: number;
  netCashFlow: number;
  myntraProfit?: number;
  meeshoProfit?: number;
  flipkartProfit?: number;
  profitabilityLabel?: string;
  performanceCategory?: string;
  marketingEfficiencyRatio?: number;
  marketingEfficiencyLabel?: string;
  dominantSalesChannel?: string;
}

export interface DashboardData {
  records: FinancialRecord[];
  summary: {
    totalTransactions: number;
    totalSales: number;
    totalExpense: number;
    avgTransaction: number;
    topCategory: string;
  };
  channelBreakdown: { name: string; value: number }[];
  topDays: { date: string; sales: number }[];
  monthlyComparison: { month: string; income: number; expense: number }[];
  cumulativeData: { date: string; cumulative: number }[];
}

const parseDate = (dateStr: string): Date => {
  // Try DD-MM-YYYY format
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  } catch (e) {
    console.error('Date parse error:', e);
  }
  return new Date(dateStr);
};

const parseNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/,/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export const validateCSVColumns = (headers: string[]): { valid: boolean; missing: string[] } => {
  // More flexible validation - require only essential columns
  const requiredColumns = [
    'Date',
    'Gross_Sales',
    'Net_Sales',
  ];

  const missing = requiredColumns.filter(col => !headers.includes(col));
  return {
    valid: missing.length === 0,
    missing
  };
};

export const parseCSV = (csvText: string): Promise<FinancialRecord[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const records: FinancialRecord[] = results.data.map((row: any) => ({
            date: parseDate(row.Date || row.date),
            dateStr: row.Date || row.date,
            amazonSales: parseNumber(row.Amazon_Sales),
            flipkartSales: parseNumber(row.Flipkart_Sales),
            websiteSales: parseNumber(row.Website_Sales),
            offlineSales: parseNumber(row.Offline_Sales),
            myntraSales: parseNumber(row.myntra_sales),
            meeshoSales: parseNumber(row.meesho_sales),
            grossSales: parseNumber(row.Gross_Sales),
            totalOrders: parseNumber(row.Total_Orders),
            averageOrderValue: parseNumber(row.Average_Order_Value),
            returns: parseNumber(row.Returns),
            netSales: parseNumber(row.Net_Sales),
            cogs: parseNumber(row.COGS),
            grossProfit: parseNumber(row.Gross_Profit),
            platformFees: parseNumber(row.Platform_Fees),
            marketingSpendDigital: parseNumber(row.Marketing_Spend_Digital),
            marketingSpendOffline: parseNumber(row.Marketing_Spend_Offline),
            totalMarketingSpend: parseNumber(row.Total_Marketing_Spend),
            contributionMargin: parseNumber(row.Contribution_Margin),
            fixedCostAllocation: parseNumber(row.Fixed_Cost_Allocation),
            netProfitLoss: parseNumber(row.Net_Profit_Loss),
            debtRepaymentCashOut: parseNumber(row.Debt_Repayment_Cash_Out),
            netCashFlow: parseNumber(row.Net_Cash_Flow),
            myntraProfit: parseNumber(row.myntra_profit),
            meeshoProfit: parseNumber(row.meesho_profit),
            flipkartProfit: parseNumber(row.flipkart_profit),
            profitabilityLabel: row.Profitability_Label || row.profitability_label,
            performanceCategory: row.performance_category,
            marketingEfficiencyRatio: parseNumber(row.Marketing_Efficiency_Ratio),
            marketingEfficiencyLabel: row.Marketing_Efficiency_Label,
            dominantSalesChannel: row.Dominant_Sales_Channel,
          }));
          resolve(records.filter(r => r.date && !isNaN(r.date.getTime())));
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const aggregateDashboardData = (records: FinancialRecord[]): DashboardData => {
  const totalSales = records.reduce((sum, r) => sum + r.grossSales, 0);
  const totalExpense = records.reduce((sum, r) => sum + r.cogs + r.totalMarketingSpend + r.fixedCostAllocation, 0);
  const totalTransactions = records.reduce((sum, r) => sum + r.totalOrders, 0);
  const avgTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  // Dynamic channel breakdown - include all channels with data
  const channelData: { name: string; value: number }[] = [];
  
  const amazonTotal = records.reduce((sum, r) => sum + r.amazonSales, 0);
  const flipkartTotal = records.reduce((sum, r) => sum + r.flipkartSales, 0);
  const websiteTotal = records.reduce((sum, r) => sum + r.websiteSales, 0);
  const offlineTotal = records.reduce((sum, r) => sum + r.offlineSales, 0);
  const myntraTotal = records.reduce((sum, r) => sum + r.myntraSales, 0);
  const meeshoTotal = records.reduce((sum, r) => sum + r.meeshoSales, 0);

  if (amazonTotal > 0) channelData.push({ name: 'Amazon', value: amazonTotal });
  if (flipkartTotal > 0) channelData.push({ name: 'Flipkart', value: flipkartTotal });
  if (websiteTotal > 0) channelData.push({ name: 'Website', value: websiteTotal });
  if (offlineTotal > 0) channelData.push({ name: 'Offline', value: offlineTotal });
  if (myntraTotal > 0) channelData.push({ name: 'Myntra', value: myntraTotal });
  if (meeshoTotal > 0) channelData.push({ name: 'Meesho', value: meeshoTotal });

  const channelBreakdown = channelData.sort((a, b) => b.value - a.value);
  const topCategory = channelBreakdown[0]?.name || 'N/A';

  // Top 10 days by sales
  const topDays = [...records]
    .sort((a, b) => b.grossSales - a.grossSales)
    .slice(0, 10)
    .map(r => ({ date: format(r.date, 'MMM dd'), sales: r.grossSales }));

  // Monthly comparison
  const monthlyMap = new Map<string, { income: number; expense: number }>();
  records.forEach(r => {
    const monthKey = format(r.date, 'MMM yyyy');
    const existing = monthlyMap.get(monthKey) || { income: 0, expense: 0 };
    existing.income += r.grossSales;
    existing.expense += r.cogs + r.totalMarketingSpend + r.fixedCostAllocation;
    monthlyMap.set(monthKey, existing);
  });

  const monthlyComparison = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => {
      const dateA = parse(a.month, 'MMM yyyy', new Date());
      const dateB = parse(b.month, 'MMM yyyy', new Date());
      return dateA.getTime() - dateB.getTime();
    });

  // Cumulative sales
  const sortedRecords = [...records].sort((a, b) => a.date.getTime() - b.date.getTime());
  let cumulative = 0;
  const cumulativeData = sortedRecords.map(r => {
    cumulative += r.netSales;
    return { date: format(r.date, 'MMM dd'), cumulative };
  });

  return {
    records,
    summary: {
      totalTransactions,
      totalSales,
      totalExpense,
      avgTransaction,
      topCategory,
    },
    channelBreakdown,
    topDays,
    monthlyComparison,
    cumulativeData,
  };
};

export const loadDemoData = async (): Promise<DashboardData> => {
  const response = await fetch('/data/demo.csv');
  const csvText = await response.text();
  const records = await parseCSV(csvText);
  return aggregateDashboardData(records);
};

export const exportToCSV = (records: FinancialRecord[], filename: string = 'export.csv') => {
  const csv = Papa.unparse(records.map(r => ({
    Date: format(r.date, 'dd-MM-yyyy'),
    Amazon_Sales: r.amazonSales,
    Flipkart_Sales: r.flipkartSales,
    Website_Sales: r.websiteSales,
    Offline_Sales: r.offlineSales,
    Gross_Sales: r.grossSales,
    Total_Orders: r.totalOrders,
    Average_Order_Value: r.averageOrderValue,
    Returns: r.returns,
    Net_Sales: r.netSales,
    COGS: r.cogs,
    Gross_Profit: r.grossProfit,
    Platform_Fees: r.platformFees,
    Marketing_Spend_Digital: r.marketingSpendDigital,
    Marketing_Spend_Offline: r.marketingSpendOffline,
    Total_Marketing_Spend: r.totalMarketingSpend,
    Contribution_Margin: r.contributionMargin,
    Fixed_Cost_Allocation: r.fixedCostAllocation,
    Net_Profit_Loss: r.netProfitLoss,
    Debt_Repayment_Cash_Out: r.debtRepaymentCashOut,
    Net_Cash_Flow: r.netCashFlow,
  })));

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
