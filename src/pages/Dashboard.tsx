import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  AttachMoney,
  Category,
  AssignmentReturn,
  Campaign,
  Percent,
  TrendingDown,
  CloudUpload,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { TimeSeriesChart } from '../components/TimeSeriesChart';
import { CategoryDonutChart } from '../components/CategoryDonutChart';
import { TopDaysBarChart } from '../components/TopDaysBarChart';
import { CumulativeAreaChart } from '../components/CumulativeAreaChart';
import { MonthlyComparisonChart } from '../components/MonthlyComparisonChart';
import { ProfitMarginChart } from '../components/ProfitMarginChart';
import { ReturnsAnalysisChart } from '../components/ReturnsAnalysisChart';
import { MarketingROIChart } from '../components/MarketingROIChart';
import { FiltersPanel } from '../components/FiltersPanel';
import { exportToCSV, DashboardData, aggregateDashboardData } from '../services/csvParser';
import { exportDashboardReport } from '../services/reportExporter';
import { getFinancialRecords } from '../services/financialRecordsService';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aggregation, setAggregation] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      if (!user) return;
      
      try {
        const records = await getFinancialRecords(user.id);
        if (records.length > 0) {
          const dashboardData = aggregateDashboardData(records);
          setData(dashboardData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, authLoading, navigate]);

  const handleExport = () => {
    if (data) {
      exportToCSV(data.records, 'financial_data_export.csv');
    }
  };

  const handleExportReport = async () => {
    if (data) {
      toast.info('Generating report... This may take a few moments.');
      try {
        await exportDashboardReport(data);
        toast.success('Report exported successfully!');
      } catch (error) {
        console.error('Error exporting report:', error);
        toast.error('Failed to export report. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading your financial dashboard...
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={3}
        sx={{ p: 4 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Upload CSV to View Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Please upload your financial data CSV file to view detailed model forecasting and analytics
            </Typography>
            <Box
              sx={{
                p: 6,
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 4,
                backgroundColor: 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'action.hover',
                  transform: 'scale(1.02)',
                }
              }}
              onClick={() => navigate('/upload')}
            >
              <AttachMoney sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Click here to upload your CSV file
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Or navigate to the Upload page from the sidebar
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Box>
    );
  }

  // Calculate additional metrics
  const totalReturns = data.records.reduce((sum, r) => sum + r.returns, 0);
  const totalMarketing = data.records.reduce((sum, r) => sum + r.totalMarketingSpend, 0);
  const totalGrossProfit = data.records.reduce((sum, r) => sum + r.grossProfit, 0);
  const profitMargin = ((totalGrossProfit / data.summary.totalSales) * 100).toFixed(1);
  const returnRate = ((totalReturns / data.summary.totalSales) * 100).toFixed(1);
  const avgDailySales = (data.summary.totalSales / data.records.length).toFixed(0);
  const marketingROI = ((data.summary.totalSales / totalMarketing)).toFixed(1);
  const netProfit = data.records.reduce((sum, r) => sum + r.netProfitLoss, 0);

  return (
    <Box sx={{ minHeight: 'calc(100vh - 3.5rem)', backgroundColor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="h4" fontWeight={700}>
              Business Overview
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => navigate('/upload')}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  },
                }}
              >
                Re-upload CSV
              </Button>
              <Chip 
                label={netProfit >= 0 ? "Profitable" : "Loss Making"}
                color={netProfit >= 0 ? "success" : "error"}
                icon={netProfit >= 0 ? <TrendingUp /> : <TrendingDown />}
              />
            </Box>
          </Box>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Comprehensive financial analytics with real-time insights
          </Typography>
        </motion.div>

        {/* Primary KPIs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600} mb={2}>
            Key Performance Indicators
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          <KpiCard
            title="Total Sales"
            value={`₹${(data.summary.totalSales / 1000000).toFixed(2)}M`}
            icon={<AttachMoney />}
            color="#10b981"
            delay={0.1}
          />
          <KpiCard
            title="Total Transactions"
            value={data.summary.totalTransactions.toLocaleString()}
            icon={<ShoppingCart />}
            color="#6366f1"
            delay={0.2}
          />
          <KpiCard
            title="Avg Transaction"
            value={`₹${data.summary.avgTransaction.toFixed(0)}`}
            icon={<TrendingUp />}
            color="#f59e0b"
            delay={0.3}
          />
          <KpiCard
            title="Top Channel"
            value={data.summary.topCategory}
            icon={<Category />}
            color="#8b5cf6"
            delay={0.4}
          />
        </Box>

        {/* Secondary KPIs */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          <KpiCard
            title="Total Returns"
            value={`₹${(totalReturns / 1000000).toFixed(2)}M`}
            icon={<AssignmentReturn />}
            color="#ef4444"
            delay={0.5}
          />
          <KpiCard
            title="Marketing Spend"
            value={`₹${(totalMarketing / 1000000).toFixed(2)}M`}
            icon={<Campaign />}
            color="#8b5cf6"
            delay={0.6}
          />
          <KpiCard
            title="Profit Margin"
            value={`${profitMargin}%`}
            icon={<Percent />}
            color="#f59e0b"
            delay={0.7}
          />
          <KpiCard
            title="Return Rate"
            value={`${returnRate}%`}
            icon={<TrendingDown />}
            color="#ef4444"
            delay={0.8}
          />
        </Box>

        <FiltersPanel
          aggregation={aggregation}
          onAggregationChange={setAggregation}
          onExport={handleExport}
          onExportReport={handleExportReport}
        />

        {/* Main Charts Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600} mb={2}>
            Sales & Revenue Analysis
          </Typography>
        </motion.div>

        <Stack spacing={3} mb={4}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
              gap: 3,
            }}
          >
            <Box data-chart-card>
              <ChartCard title="Sales & Profit Trends Over Time" delay={0.5}>
                <TimeSeriesChart data={data.records} aggregation={aggregation} />
              </ChartCard>
            </Box>
            <Box data-chart-card>
              <ChartCard title="Sales Distribution by Channel" delay={0.6}>
                <CategoryDonutChart data={data.channelBreakdown} />
              </ChartCard>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
              gap: 3,
            }}
          >
            <Box data-chart-card>
              <ChartCard title="Top 10 Best Performing Days" delay={0.7}>
                <TopDaysBarChart data={data.topDays} />
              </ChartCard>
            </Box>
            <Box data-chart-card>
              <ChartCard title="Cumulative Net Sales Growth" delay={0.8}>
                <CumulativeAreaChart data={data.cumulativeData} />
              </ChartCard>
            </Box>
          </Box>
        </Stack>

        {/* Financial Performance Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600} mb={2} mt={2}>
            Financial Performance Metrics
          </Typography>
        </motion.div>

        <Stack spacing={3} mb={4}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
              gap: 3,
            }}
          >
            <Box data-chart-card>
              <ChartCard title="Daily Gross Profit Margin %" delay={0.9}>
                <ProfitMarginChart data={data.records} />
              </ChartCard>
            </Box>
            <Box data-chart-card>
              <ChartCard title="Monthly Income vs Expense Comparison" delay={1.0}>
                <MonthlyComparisonChart data={data.monthlyComparison} />
              </ChartCard>
            </Box>
          </Box>
        </Stack>

        {/* Advanced Analytics Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600} mb={2} mt={2}>
            Advanced Business Intelligence
          </Typography>
        </motion.div>

        <Stack spacing={3}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
              gap: 3,
            }}
          >
            <Box data-chart-card>
              <ChartCard title="Returns Analysis & Trends" delay={1.1}>
                <ReturnsAnalysisChart data={data.records} />
              </ChartCard>
            </Box>
            <Box data-chart-card>
              <ChartCard title="Marketing ROI Performance" delay={1.2}>
                <MarketingROIChart data={data.records} />
              </ChartCard>
            </Box>
          </Box>
        </Stack>

        {/* Summary Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Box 
            sx={{ 
              mt: 4, 
              p: 3, 
              background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
              borderRadius: 3,
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Quick Summary
            </Typography>
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 2,
                mt: 2,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">Avg Daily Sales</Typography>
                <Typography variant="h6" color="primary.main">₹{Number(avgDailySales).toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Marketing ROI</Typography>
                <Typography variant="h6" color="success.main">{marketingROI}x</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Net Profit/Loss</Typography>
                <Typography variant="h6" color={netProfit >= 0 ? 'success.main' : 'error.main'}>
                  ₹{(netProfit / 1000000).toFixed(2)}M
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Data Period</Typography>
                <Typography variant="h6">{data.records.length} Days</Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Dashboard;
