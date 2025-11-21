'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Card, CardContent, CircularProgress, Paper, Chip } from '@mui/material';
import { ShoppingBag, Favorite, AccountCircle, LocalShipping } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import axios from 'axios';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ totalOrders: 0, favoritesCount: 0, pendingOrders: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!session) {
    return null;
  }

  useEffect(() => {
    if (status === 'authenticated') {
      (async () => {
        try {
          const res = await axios.get('/api/user/stats');
          setStats(res.data);
        } catch (e) {
          console.error('Failed to load user stats', e);
        } finally {
          setLoadingStats(false);
        }
      })();
    }
  }, [status]);

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: 'background.default', minHeight: '80vh' }}>
        {/* Hero Section */}
        <Box
          sx={(theme) => ({
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.light} 100%)`,
            color: theme.palette.text.primary,
            py: 6,
          })}
        >
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Welcome back, {session.user?.name || 'Guest'}! 👋
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {session.user?.email}
              </Typography>
            </motion.div>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: -3, pb: 8 }}>
          {/* Stats Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 6 }}>
            {[
              { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag />, color: 'primary.main' },
              { label: 'Favorites', value: stats.favoritesCount, icon: <Favorite />, color: 'error.main' },
              { label: 'Pending Orders', value: stats.pendingOrders, icon: <LocalShipping />, color: 'warning.main' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: `${stat.color}15`,
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {loadingStats ? '—' : stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
            ))}
          </Box>

          {/* Quick Actions */}
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                  onClick={() => router.push('/cakes')}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>🍰</Typography>
                    <Typography variant="body1">Browse Cakes</Typography>
                  </CardContent>
                </Card>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
                onClick={() => router.push('/orders')}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>📦</Typography>
                  <Typography variant="body1">My Orders</Typography>
                </CardContent>
              </Card>
              <Card
                sx={{
                  cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                  onClick={() => router.push('/favorites')}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>❤️</Typography>
                    <Typography variant="body1">Favorites</Typography>
                  </CardContent>
                </Card>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
                onClick={() => router.push('/profile')}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>👤</Typography>
                  <Typography variant="body1">Profile</Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
