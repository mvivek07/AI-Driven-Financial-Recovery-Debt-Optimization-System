import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FinancialRecord } from '../services/csvParser';
import { format, startOfMonth } from 'date-fns';

interface MarketingROIChartProps {
  data: FinancialRecord[];
}

export const MarketingROIChart = ({ data }: MarketingROIChartProps) => {
  const monthlyMap = new Map<string, { marketing: number; sales: number; roi: number }>();
  
  data.forEach(r => {
    const monthKey = format(startOfMonth(r.date), 'MMM yyyy');
    const existing = monthlyMap.get(monthKey) || { marketing: 0, sales: 0, roi: 0 };
    existing.marketing += r.totalMarketingSpend;
    existing.sales += r.grossSales;
    monthlyMap.set(monthKey, existing);
  });

  const chartData = Array.from(monthlyMap.entries()).map(([month, values]) => ({
    month,
    marketing: values.marketing,
    sales: values.sales,
    roi: values.marketing > 0 ? ((values.sales / values.marketing) * 100).toFixed(0) : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData}>
        <defs>
          <linearGradient id="marketingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          stroke="#666"
        />
        <YAxis 
          yAxisId="left"
          tick={{ fontSize: 12 }}
          stroke="#666"
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12 }}
          stroke="#666"
          tickFormatter={(value) => `${value}x`}
        />
        <Tooltip 
          formatter={(value: number, name: string) => {
            if (name === 'ROI') return `${value}x return`;
            return `₹${Number(value).toLocaleString()}`;
          }}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e0e0e0',
            borderRadius: 8,
          }}
        />
        <Legend />
        <Bar 
          yAxisId="left"
          dataKey="marketing" 
          fill="url(#marketingGradient)" 
          radius={[8, 8, 0, 0]}
          name="Marketing Spend"
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="roi" 
          stroke="#10b981" 
          strokeWidth={3}
          dot={{ fill: '#10b981', r: 5 }}
          name="ROI"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
