'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { MoreVert, Visibility, Edit } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';

// ✅ Define Order type for better clarity
interface Order {
  id: string;
  orderNumber: string;
  user?: {
    name?: string;
    email?: string;
  };
  createdAt: string;
  deliveryDate: string;
  deliveryAddress?: string;
  total: number;
  status: string;
  paymentStatus: string;
  items?: {
    cakeName: string;
    quantity: number;
    price: number;
  }[];
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // ✅ Redirect unauthenticated users to login
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated') fetchOrders();
  }, [status]);

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Menu Handlers
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, order: Order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setDetailsOpen(true);
    handleMenuClose();
  };

  const handleChangeStatus = () => {
    if (!selectedOrder) return;
    setNewStatus(selectedOrder.status);
    setStatusDialogOpen(true);
    handleMenuClose();
  };

  // ✅ Update Order Status
  const updateOrderStatus = async () => {
    if (!selectedOrder) return;
    try {
      await axios.patch(`/api/orders/${selectedOrder.id}`, { status: newStatus });
      await fetchOrders();
      setStatusDialogOpen(false);
    } catch (error) {
      console.error('❌ Error updating order:', error);
    }
  };

  // ✅ Status Color Helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PROCESSING': return 'info';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  // ✅ Loading Spinner
  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress size={60} />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box>
        {/* Header: 12-column responsive layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(12, 1fr)',
              sm: 'repeat(12, 1fr)',
              md: 'repeat(12, 1fr)',
            },
            gap: 2,
            mb: 3,
            alignItems: 'center',
          }}
        >
          <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 8' } }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Orders Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and track all customer orders
            </Typography>
          </Box>
          <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 4' }, textAlign: { xs: 'left', md: 'right' } }}>
            <Button variant="contained" size={isMdUp ? 'medium' : 'small'} sx={{ borderRadius: 1 }}>
              Export Orders
            </Button>
          </Box>
        </Box>

        {/* Orders Table */}
        <Paper
          sx={{
            borderRadius: 1,
            overflow: 'hidden',
            background: theme.palette.mode === 'light'
              ? 'linear-gradient(145deg, #FFFFFF 0%, #F1F5F9 100%)'
              : 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
          }}
        >
          <TableContainer>
            <Table size={isMdUp ? 'medium' : 'small'}>
              <TableHead sx={{ bgcolor: 'background.default' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Delivery</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{order.orderNumber}</TableCell>
                    <TableCell>{order.user?.name || 'Guest'}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      KSh {order.total?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status) as any}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.paymentStatus}
                        color={order.paymentStatus === 'COMPLETED' ? 'success' : 'warning'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleMenuClick(e, order)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Empty State */}
          {orders.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No orders found
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Action Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleViewDetails}>
            <Visibility fontSize="small" sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={handleChangeStatus}>
            <Edit fontSize="small" sx={{ mr: 1 }} />
            Change Status
          </MenuItem>
        </Menu>

        {/* Status Dialog */}
        <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogContent sx={{ minWidth: 400, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                native
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={updateOrderStatus}>
              Update Status
            </Button>
          </DialogActions>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Order Details - #{selectedOrder?.orderNumber}</DialogTitle>
          <DialogContent>
            {selectedOrder && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Customer Information</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedOrder.user?.name}<br />
                  {selectedOrder.user?.email}<br />
                  {selectedOrder.deliveryAddress}
                </Typography>

                <Typography variant="subtitle2" gutterBottom>Order Items</Typography>
                {selectedOrder.items?.map((item, i) => (
                  <Typography key={i} variant="body2" color="text.secondary">
                    {item.cakeName} x{item.quantity} - KSh {item.price?.toLocaleString()}
                  </Typography>
                ))}

                <Typography variant="h6" sx={{ mt: 2 }}>
                  Total: KSh {selectedOrder.total?.toLocaleString()}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}
