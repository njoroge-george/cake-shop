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
import axios from 'axios';

const COLORS = ['#FF69B4', '#9C27B0', '#FFB6D9', '#BA68C8', '#F8BBD0', '#E1BEE7', '#CE93D8', '#AB47BC'];

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
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}.100`,
              color: `${color}.main`,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
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
                  stroke="#FF69B4"
                  strokeWidth={3}
                  name="Sales (KSh)"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#9C27B0"
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
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              <Bar dataKey="totalSold" fill="#FF69B4" name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </AdminLayout>
  );
}
