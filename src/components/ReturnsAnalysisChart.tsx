import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FinancialRecord } from '../services/csvParser';
import { format, startOfMonth } from 'date-fns';

interface ReturnsAnalysisChartProps {
  data: FinancialRecord[];
}

export const ReturnsAnalysisChart = ({ data }: ReturnsAnalysisChartProps) => {
  const monthlyMap = new Map<string, { returns: number; sales: number }>();
  
  data.forEach(r => {
    const monthKey = format(startOfMonth(r.date), 'MMM yyyy');
    const existing = monthlyMap.get(monthKey) || { returns: 0, sales: 0 };
    existing.returns += r.returns;
    existing.sales += r.grossSales;
    monthlyMap.set(monthKey, existing);
  });

  const chartData = Array.from(monthlyMap.entries()).map(([month, values]) => ({
    month,
    returns: values.returns,
    returnRate: ((values.returns / values.sales) * 100).toFixed(1),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <defs>
          <linearGradient id="returnsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
            <stop offset="100%" stopColor="#f87171" stopOpacity={0.8} />
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
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          formatter={(value: number, name: string) => {
            if (name === 'Return Rate') return `${value}%`;
            return `₹${value.toLocaleString()}`;
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
          dataKey="returns" 
          fill="url(#returnsGradient)" 
          radius={[8, 8, 0, 0]}
          name="Returns Amount"
        />
        <Bar 
          yAxisId="right"
          dataKey="returnRate" 
          fill="#fbbf24" 
          radius={[8, 8, 0, 0]}
          name="Return Rate"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
