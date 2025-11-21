'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

// Dynamic chart palettes per mode: pink gradient for dark, light green gradient for light
const getChartPalette = (mode: 'light' | 'dark') =>
  mode === 'dark'
    ? ['#880E4F', '#D81B60', '#EC407A', '#F06292', '#F48FB1', '#F8BBD0']
    : ['#3E9257', '#6FD694', '#8BE3A9', '#A5ECC0', '#C8F5D9', '#E2FBEC'];

type SalesPoint = { month: string; sales: number; orders: number };
type NameValue = { name: string; value: number };
type TopCake = { cakeId: string; name: string; totalSold: number; revenue: number };
type Stats = {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  lowStock: number;
};

interface AnalyticsResponse {
  stats: Stats;
  salesTrend: SalesPoint[];
  categoryDistribution: NameValue[];
  topCakes: TopCake[];
  orderStatus: NameValue[];
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get<AnalyticsResponse>('/api/admin/analytics');
        setData(res.data);
      } catch (e: any) {
        console.error('Failed to load analytics', e);
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const theme = useTheme();
  const CHART_COLORS = getChartPalette(theme.palette.mode);
  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Admin Analytics
        </Typography>

        {/* Stats summary (optional quick glance) */}
        {data && (
          <Box
            sx={{
              mt: 3,
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(12, 1fr)',
                sm: 'repeat(12, 1fr)',
                md: 'repeat(12, 1fr)',
              },
              gap: 2,
            }}
          >
            {[
              { label: 'Total Revenue', value: `KSh ${data.stats.totalRevenue.toLocaleString()}` },
              { label: 'Total Orders', value: data.stats.totalOrders },
              { label: 'Completed Orders', value: data.stats.completedOrders },
              { label: 'Pending Orders', value: data.stats.pendingOrders },
              { label: 'Customers', value: data.stats.totalCustomers },
              { label: 'Low Stock', value: data.stats.lowStock },
            ].map((s, idx) => (
              <Card
                key={idx}
                sx={{
                  borderRadius: 1,
                  gridColumn: { xs: 'span 6', sm: 'span 4', md: 'span 2' },
                }}
              >
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {s.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {s.value as any}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Charts Grid */}
        <Box
          sx={{
            mt: 4,
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(12, 1fr)',
              sm: 'repeat(12, 1fr)',
              md: 'repeat(12, 1fr)',
            },
            gap: 3,
            alignItems: 'stretch',
          }}
        >
          {loading && (
            <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 6 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {/* 📊 Sales Overview */}
          <Card sx={{ borderRadius: 1, gridColumn: { xs: 'span 12', md: 'span 8' } }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Sales Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.salesTrend || []}>
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke={theme.palette.primary.main}
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 📊 Category Distribution (AreaChart) */}
          <Card sx={{ borderRadius: 1, gridColumn: { xs: 'span 12', md: 'span 4' } }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Category Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data?.categoryDistribution || []}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={theme.palette.primary.dark}
                    fill={theme.palette.primary.light}
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 🍰 Top Selling Cakes */}
          <Card sx={{ borderRadius: 1, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Top Selling Cakes
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.topCakes || []}>
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalSold" name="Units Sold" fill={CHART_COLORS[2]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 📈 Order Status Overview */}
          <Card sx={{ borderRadius: 1, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Order Status Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data?.orderStatus || []}>
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    fill={CHART_COLORS[4]}
                    stroke={CHART_COLORS[0]}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </Box>
      </Box>
    </AdminLayout>
  );
}
