import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyComparisonChartProps {
  data: { month: string; income: number; expense: number }[];
}

export const MonthlyComparisonChart = ({ data }: MonthlyComparisonChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="month" 
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
        <Bar 
          dataKey="income" 
          fill="#10b981" 
          radius={[8, 8, 0, 0]}
          name="Income"
        />
        <Bar 
          dataKey="expense" 
          fill="#ef4444" 
          radius={[8, 8, 0, 0]}
          name="Expense"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
