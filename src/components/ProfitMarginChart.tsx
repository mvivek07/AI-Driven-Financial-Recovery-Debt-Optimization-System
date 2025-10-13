import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FinancialRecord } from '../services/csvParser';
import { format } from 'date-fns';

interface ProfitMarginChartProps {
  data: FinancialRecord[];
}

export const ProfitMarginChart = ({ data }: ProfitMarginChartProps) => {
  const chartData = data.map(r => ({
    date: format(r.date, 'MMM dd'),
    margin: ((r.grossProfit / r.grossSales) * 100).toFixed(2),
    profit: r.grossProfit,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <defs>
          <linearGradient id="marginGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          stroke="#666"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#666"
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          formatter={(value: number) => `${value}%`}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e0e0e0',
            borderRadius: 8,
          }}
        />
        <Line 
          type="monotone" 
          dataKey="margin" 
          stroke="#f59e0b" 
          strokeWidth={3}
          dot={{ fill: '#f59e0b', r: 4 }}
          activeDot={{ r: 6 }}
          fill="url(#marginGradient)"
          name="Profit Margin %"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
