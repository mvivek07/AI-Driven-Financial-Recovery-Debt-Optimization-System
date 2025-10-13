import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { TrendingUp, DollarSign, FileText, CreditCard, Calendar, TrendingDown, Activity, PieChart as PieChartIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';

const MainDashboard = () => {
  const { user } = useAuth();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalLoans, setTotalLoans] = useState(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [invoiceStatusData, setInvoiceStatusData] = useState<any[]>([]);
  const [loanDistribution, setLoanDistribution] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      
      // Subscribe to realtime updates
      const channels = [
        supabase.channel('dashboard-transactions').on('postgres_changes', 
          { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` },
          () => fetchDashboardData()
        ).subscribe(),
        supabase.channel('dashboard-invoices').on('postgres_changes', 
          { event: '*', schema: 'public', table: 'invoices', filter: `user_id=eq.${user.id}` },
          () => fetchDashboardData()
        ).subscribe(),
        supabase.channel('dashboard-loans').on('postgres_changes', 
          { event: '*', schema: 'public', table: 'loans', filter: `user_id=eq.${user.id}` },
          () => fetchDashboardData()
        ).subscribe(),
      ];

      return () => { channels.forEach(ch => supabase.removeChannel(ch)); };
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    // Fetch transactions
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id);

    if (transactions) {
      const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
      const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
      setTotalIncome(income);
      setTotalExpenses(expenses);
      setRecentTransactions(transactions.slice(0, 5));

      // Category breakdown
      const categoryMap = new Map();
      transactions.filter(t => t.type === 'expense').forEach(t => {
        categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + Number(t.amount));
      });
      setCategoryData(Array.from(categoryMap, ([name, value]) => ({ name, value })));

      // Monthly data
      const monthMap = new Map();
      transactions.forEach(t => {
        const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short' });
        if (!monthMap.has(month)) {
          monthMap.set(month, { month, income: 0, expenses: 0 });
        }
        const data = monthMap.get(month);
        if (t.type === 'income') data.income += Number(t.amount);
        else data.expenses += Number(t.amount);
      });
      setMonthlyData(Array.from(monthMap.values()));

      // Weekly data for area chart
      const weekMap = new Map();
      transactions.forEach(t => {
        const week = `Week ${Math.ceil(new Date(t.date).getDate() / 7)}`;
        if (!weekMap.has(week)) {
          weekMap.set(week, { week, amount: 0 });
        }
        const data = weekMap.get(week);
        if (t.type === 'income') data.amount += Number(t.amount);
      });
      setWeeklyData(Array.from(weekMap.values()));
    }

    // Fetch invoices
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id);
    if (invoices) {
      setTotalInvoices(invoices.reduce((sum, inv) => sum + Number(inv.amount), 0));
      
      // Invoice status breakdown
      const statusMap = new Map();
      invoices.forEach(inv => {
        statusMap.set(inv.status, (statusMap.get(inv.status) || 0) + 1);
      });
      setInvoiceStatusData(Array.from(statusMap, ([name, value]) => ({ name, value })));
    }

    // Fetch loans
    const { data: loans } = await supabase
      .from('loans')
      .select('*')
      .eq('user_id', user.id);
    if (loans) {
      setTotalLoans(loans.reduce((sum, loan) => sum + Number(loan.principal_amount), 0));
      
      // Loan distribution by name
      const loanMap = loans.slice(0, 5).map(loan => ({
        name: loan.loan_name,
        amount: Number(loan.principal_amount),
        payment: Number(loan.monthly_payment)
      }));
      setLoanDistribution(loanMap);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const netBalance = totalIncome - totalExpenses;

  const statsData = [
    {
      title: "Total Income",
      value: `$${totalIncome.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Total Expenses",
      value: `$${totalExpenses.toFixed(2)}`,
      icon: DollarSign,
      color: "text-red-500",
    },
    {
      title: "Total Invoices",
      value: `$${totalInvoices.toFixed(2)}`,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Total Loans",
      value: `$${totalLoans.toFixed(2)}`,
      icon: CreditCard,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                Financial Dashboard
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Real-time overview of your business finances
              </p>
            </div>
            <Card className="px-6 py-3 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Net Balance</p>
                <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(netBalance).toFixed(2)}
                </p>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <CardContent className="pt-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className="p-2 rounded-lg bg-background shadow-sm">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <div className="h-1 w-full bg-muted rounded-full mt-4">
                    <div className="h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full" style={{ width: '70%' }} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <PieChartIcon className="h-6 w-6 text-primary" />
            Financial Analytics
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-xl border-2 hover:border-primary/20 transition-all">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Monthly Income vs Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e0e0e0' }} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-2 hover:border-primary/20 transition-all">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-blue-600" />
                  Expenses by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-2 hover:border-primary/20 transition-all">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Weekly Income Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="week" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e0e0e0' }} />
                    <Area type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#weeklyGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-2 hover:border-primary/20 transition-all">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  Invoice Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={invoiceStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e0e0e0' }} />
                    <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-2 hover:border-primary/20 transition-all lg:col-span-2">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  Loan Distribution Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={loanDistribution}>
                    <defs>
                      <linearGradient id="loanGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.7}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e0e0e0' }} />
                    <Legend />
                    <Bar dataKey="amount" fill="url(#loanGradient)" radius={[8, 8, 0, 0]} name="Principal Amount" />
                    <Bar dataKey="payment" fill="#10b981" radius={[8, 8, 0, 0]} name="Monthly Payment" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="shadow-xl border-2 hover:border-primary/20 transition-all">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction, idx) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-4 border-2 rounded-xl hover:shadow-lg transition-all hover:border-primary/30 bg-gradient-to-r from-background to-muted/20"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-primary/10 rounded-md text-xs font-medium">
                            {transaction.category}
                          </span>
                          • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`font-bold text-2xl ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Activity className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">No transactions yet. Start adding data!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MainDashboard;
