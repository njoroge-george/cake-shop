'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Button,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Cancel,
  Pending,
  Receipt,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Link from 'next/link';

interface OrderItem {
  id: string;
  cakeName: string;
  quantity: number;
  price: number;
  selectedSize: string;
  selectedFlavor: string;
  selectedLayers: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  deliveryDate: string;
  deliveryTime: string;
  deliveryAddress: string;
  items: OrderItem[];
  createdAt: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'PROCESSING':
      return 'info';
    case 'PENDING':
      return 'warning';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return <CheckCircle />;
    case 'PROCESSING':
      return <LocalShipping />;
    case 'PENDING':
      return <Pending />;
    case 'CANCELLED':
      return <Cancel />;
    default:
      return <Receipt />;
  }
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress size={60} />
        </Box>
      </>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                My Orders 📦
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track and manage your cake orders
              </Typography>
            </Box>

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Orders List */}
            {orders.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 3,
                }}
              >
                <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  No orders yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Start browsing our delicious cakes and place your first order!
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/cakes"
                  sx={{ borderRadius: 2 }}
                >
                  Browse Cakes
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {orders.map((order, index) => (
                  <Grid item xs={12} key={order.id}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        elevation={2}
                        sx={{
                          borderRadius: 3,
                          overflow: 'hidden',
                          '&:hover': { boxShadow: 6 },
                          transition: 'box-shadow 0.3s',
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          {/* Order Header */}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              mb: 2,
                              flexWrap: 'wrap',
                              gap: 2,
                            }}
                          >
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Order #{order.orderNumber}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip
                                icon={getStatusIcon(order.status)}
                                label={order.status}
                                color={getStatusColor(order.status) as any}
                                sx={{ fontWeight: 600 }}
                              />
                              <Chip
                                label={order.paymentStatus}
                                color={order.paymentStatus === 'COMPLETED' ? 'success' : 'warning'}
                                variant="outlined"
                              />
                            </Box>
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          {/* Order Items */}
                          <List sx={{ py: 0 }}>
                            {order.items.map((item) => (
                              <ListItem
                                key={item.id}
                                sx={{
                                  px: 0,
                                  py: 1,
                                  '&:not(:last-child)': { borderBottom: '1px dashed', borderColor: 'divider' },
                                }}
                              >
                                <ListItemAvatar>
                                  <Avatar
                                    sx={{
                                      bgcolor: 'primary.light',
                                      color: 'primary.main',
                                      width: 48,
                                      height: 48,
                                    }}
                                  >
                                    🍰
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                      {item.cakeName}
                                    </Typography>
                                  }
                                  secondary={
                                    <Box component="span">
                                      <Typography variant="body2" color="text.secondary" component="span">
                                        {item.selectedSize} • {item.selectedFlavor} • {item.selectedLayers}
                                      </Typography>
                                      <br />
                                      <Typography variant="body2" color="text.secondary" component="span">
                                        Quantity: {item.quantity}
                                      </Typography>
                                    </Box>
                                  }
                                />
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  KSh {item.price.toLocaleString()}
                                </Typography>
                              </ListItem>
                            ))}
                          </List>

                          <Divider sx={{ my: 2 }} />

                          {/* Order Details */}
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Delivery Details
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                📅 {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                🕐 {order.deliveryTime}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                📍 {order.deliveryAddress}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Box sx={{ textAlign: { md: 'right' } }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Order Total
                                </Typography>
                                <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                                  KSh {order.total.toLocaleString()}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          {/* Action Buttons */}
                          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                              View Details
                            </Button>
                            {order.status === 'PENDING' && (
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                sx={{ borderRadius: 2 }}
                              >
                                Cancel Order
                              </Button>
                            )}
                            {order.status === 'COMPLETED' && (
                              <Button
                                variant="contained"
                                size="small"
                                sx={{ borderRadius: 2 }}
                              >
                                Reorder
                              </Button>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </motion.div>
        </Container>
      </Box>
    </>
  );
}
