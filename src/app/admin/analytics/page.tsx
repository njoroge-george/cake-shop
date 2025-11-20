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
  PieChart,
  Pie,
  Cell,
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
import axios from 'axios';

const COLORS = ['#FF69B4', '#9C27B0', '#FFB6D9', '#BA68C8'];

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
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
              <Card key={idx} sx={{ borderRadius: 3, boxShadow: 2 }}>
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

        {/* ✅ Grid Layout Section */}
        <Box
          sx={{
            mt: 4,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: 3,
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
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
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
                    stroke={COLORS[0]}
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 🥧 Category Distribution */}
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Category Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data?.categoryDistribution || []}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {(data?.categoryDistribution || []).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 🍰 Top Selling Cakes */}
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
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
                  <Bar dataKey="totalSold" name="Units Sold" fill={COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 📈 Order Status Overview */}
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
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
                    fill={COLORS[2]}
                    stroke={COLORS[3]}
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
