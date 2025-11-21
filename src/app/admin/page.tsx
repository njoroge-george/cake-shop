'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  Cake as CakeIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

// Dynamic chart palette: pink shades in dark mode, light green shades in light mode
const getChartPalette = (mode: 'light' | 'dark') =>
  mode === 'dark'
    ? ['#880E4F', '#D81B60', '#EC407A', '#F06292', '#F48FB1', '#F8BBD0']
    : ['#3E9257', '#6FD694', '#8BE3A9', '#A5ECC0', '#C8F5D9', '#E2FBEC'];

interface AnalyticsData {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    todayOrders: number;
    totalCustomers: number;
    newCustomersThisWeek: number;
    activeCakes: number;
    lowStock: number;
    unreadMessages: number;
    pendingOrders: number;
    pendingCustomOrders: number;
    revenueGrowth: number;
  };
  salesTrend: { month: string; sales: number; orders: number }[];
  categoryDistribution: { name: string; value: number }[];
  topCakes: { name: string; totalSold: number; revenue: number }[];
}

function StatCard({ icon, title, value, subtitle, color }: any) {
  const theme = useTheme();
  const paletteColor = (theme.palette as any)[color];
  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Box
            sx={{
              p: 1.25,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${paletteColor.dark} 0%, ${paletteColor.main} 70%)`,
              color: `${theme.palette.mode}`,
              mr: 1.5,
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}
          >
            {icon}
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: 0.3, color: 'text.secondary' }}>
            {title.toUpperCase()}
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.25, lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const theme = useTheme();
  const CHART_COLORS = getChartPalette(theme.palette.mode);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session && (session.user as any)?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (status === 'authenticated' && (session.user as any)?.role === 'ADMIN') {
      fetchAnalytics();
    }
  }, [status, session]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/analytics');
      setData(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress size={60} />
        </Box>
      </AdminLayout>
    );
  }

  if (status === 'unauthenticated' || (session?.user as any)?.role !== 'ADMIN') {
    return null;
  }

  if (error) {
    return (
      <AdminLayout>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </AdminLayout>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Welcome back! Here's what's happening with your store.
        </Typography>

        {/* Stats Cards */}
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          <StatCard
            icon={<TrendingUp />}
            title="Total Revenue"
            value={`KSh ${(data.stats.totalRevenue / 1000).toFixed(1)}K`}
            subtitle={`${data.stats.revenueGrowth > 0 ? '+' : ''}${data.stats.revenueGrowth}% from last month`}
            color="primary"
          />
          <StatCard
            icon={<ShoppingCart />}
            title="Total Orders"
            value={data.stats.totalOrders}
            subtitle={`${data.stats.todayOrders} new ${data.stats.todayOrders === 1 ? 'order' : 'orders'} today`}
            color="secondary"
          />
          <StatCard
            icon={<People />}
            title="Customers"
            value={data.stats.totalCustomers}
            subtitle={`+${data.stats.newCustomersThisWeek} new this week`}
            color="success"
          />
          <StatCard
            icon={<CakeIcon />}
            title="Active Cakes"
            value={data.stats.activeCakes}
            subtitle={`${data.stats.lowStock} low stock`}
            color="warning"
          />
        </Box>

        {/* Charts Row 1: Sales Trend & Category Distribution */}
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: '2fr 1fr',
            },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Sales Trend */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Sales Trend (Last 12 Months)
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke={theme.palette.primary.main}
                  strokeWidth={3}
                  name="Sales (KSh)"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke={theme.palette.secondary.main}
                  strokeWidth={3}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>

          {/* Category Distribution */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Categories
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={data.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={100}
                  dataKey="value"
                >
                  {data.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Charts Row 2: Top Selling Cakes */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Top Selling Cakes
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.topCakes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSold" fill={CHART_COLORS[2]} name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </AdminLayout>
  );
}
