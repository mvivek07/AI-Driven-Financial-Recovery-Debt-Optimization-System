import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FinancialRecord } from '../services/csvParser';
import { format, startOfWeek, startOfMonth } from 'date-fns';

interface TimeSeriesChartProps {
  data: FinancialRecord[];
  aggregation: 'daily' | 'weekly' | 'monthly';
}

export const TimeSeriesChart = ({ data, aggregation }: TimeSeriesChartProps) => {
  const aggregateData = () => {
    if (aggregation === 'daily') {
      return data.map(r => ({
        date: format(r.date, 'MMM dd'),
        sales: r.grossSales,
        profit: r.netProfitLoss,
      }));
    }

    const grouped = new Map<string, { sales: number; profit: number; count: number }>();
    
    data.forEach(r => {
      let key: string;
      if (aggregation === 'weekly') {
        key = format(startOfWeek(r.date), 'MMM dd');
      } else {
        key = format(startOfMonth(r.date), 'MMM yyyy');
      }

      const existing = grouped.get(key) || { sales: 0, profit: 0, count: 0 };
      existing.sales += r.grossSales;
      existing.profit += r.netProfitLoss;
      existing.count += 1;
      grouped.set(key, existing);
    });

    return Array.from(grouped.entries()).map(([date, values]) => ({
      date,
      sales: values.sales,
      profit: values.profit,
    }));
  };

  const chartData = aggregateData();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          stroke="#666"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#666"
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          formatter={(value: number) => `₹${value.toLocaleString()}`}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e0e0e0',
            borderRadius: 8,
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="sales" 
          stroke="#6366f1" 
          strokeWidth={2}
          dot={{ fill: '#6366f1', r: 4 }}
          activeDot={{ r: 6 }}
          name="Gross Sales"
        />
        <Line 
          type="monotone" 
          dataKey="profit" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 4 }}
          activeDot={{ r: 6 }}
          name="Net Profit"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
