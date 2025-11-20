'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Visibility,
  Email,
  Phone,
  CalendarToday,
  People,
  AttachMoney,
  Close,
  Save,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios';
import dayjs from 'dayjs';

interface CustomOrder {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  servings: number;
  budget: number | null;
  description: string;
  flavors: string | null;
  colors: string | null;
  theme: string | null;
  specialRequests: string | null;
  referenceImages: string[];
  status: string;
  adminNotes: string | null;
  quotedPrice: number | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const statusColors: { [key: string]: 'default' | 'info' | 'warning' | 'success' | 'error' } = {
  PENDING: 'warning',
  REVIEWING: 'info',
  QUOTED: 'info',
  ACCEPTED: 'success',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'error',
};

export default function AdminCustomOrdersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editStatus, setEditStatus] = useState('');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [editQuotedPrice, setEditQuotedPrice] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session && (session.user as any)?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (status === 'authenticated' && (session.user as any)?.role === 'ADMIN') {
      fetchOrders();
    }
  }, [status, session]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/custom-orders');
      setOrders(response.data.customOrders || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load custom orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order: CustomOrder) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditAdminNotes(order.adminNotes || '');
    setEditQuotedPrice(order.quotedPrice?.toString() || '');
    setDetailsOpen(true);
    setEditMode(false);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
    setEditMode(false);
  };

  const handleSaveChanges = async () => {
    if (!selectedOrder) return;

    try {
      setSaving(true);
      await axios.patch(`/api/custom-orders/${selectedOrder.id}`, {
        status: editStatus,
        adminNotes: editAdminNotes || null,
        quotedPrice: editQuotedPrice ? Number(editQuotedPrice) : null,
      });

      // Refresh orders
      await fetchOrders();
      setDetailsOpen(false);
      setEditMode(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </AdminLayout>
    );
  }

  if (status === 'unauthenticated' || (session?.user as any)?.role !== 'ADMIN') {
    return null;
  }

  return (
    <AdminLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Custom Orders
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage custom cake order requests from customers
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Event Type</strong></TableCell>
                <TableCell><strong>Event Date</strong></TableCell>
                <TableCell><strong>Servings</strong></TableCell>
                <TableCell><strong>Budget</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Created</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">
                      No custom orders yet
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.eventType}</TableCell>
                    <TableCell>{dayjs(order.eventDate).format('MMM DD, YYYY')}</TableCell>
                    <TableCell>{order.servings}</TableCell>
                    <TableCell>
                      {order.budget ? `KSh ${order.budget.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={statusColors[order.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{dayjs(order.createdAt).format('MMM DD, YYYY')}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Details Dialog */}
        <Dialog
          open={detailsOpen}
          onClose={handleCloseDetails}
          maxWidth="md"
          fullWidth
        >
          {selectedOrder && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Custom Order Details</Typography>
                  <IconButton onClick={handleCloseDetails} size="small">
                    <Close />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Customer Info */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Customer Information
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography color="text.secondary">Name:</Typography>
                        <Typography sx={{ fontWeight: 600 }}>{selectedOrder.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email fontSize="small" color="action" />
                        <Typography>{selectedOrder.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone fontSize="small" color="action" />
                        <Typography>{selectedOrder.phone}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Event Details */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Event Details
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Event Type</Typography>
                        <Typography>{selectedOrder.eventType}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Event Date</Typography>
                        <Typography>{dayjs(selectedOrder.eventDate).format('MMMM DD, YYYY')}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Servings</Typography>
                        <Typography>{selectedOrder.servings}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Budget</Typography>
                        <Typography>
                          {selectedOrder.budget ? `KSh ${selectedOrder.budget.toLocaleString()}` : 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Cake Design */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Cake Design Preferences
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Description</Typography>
                        <Typography>{selectedOrder.description}</Typography>
                      </Box>
                      {selectedOrder.flavors && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Flavors</Typography>
                          <Typography>{selectedOrder.flavors}</Typography>
                        </Box>
                      )}
                      {selectedOrder.colors && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Colors</Typography>
                          <Typography>{selectedOrder.colors}</Typography>
                        </Box>
                      )}
                      {selectedOrder.theme && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Theme</Typography>
                          <Typography>{selectedOrder.theme}</Typography>
                        </Box>
                      )}
                      {selectedOrder.specialRequests && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Special Requests</Typography>
                          <Typography>{selectedOrder.specialRequests}</Typography>
                        </Box>
                      )}
                      {selectedOrder.referenceImages.length > 0 && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Reference Images</Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                            {selectedOrder.referenceImages.map((url, idx) => (
                              <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                                <Typography variant="caption" color="primary">
                                  Image {idx + 1}
                                </Typography>
                              </a>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Admin Management */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Order Management
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 2 }}>
                      <FormControl fullWidth disabled={!editMode}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={editStatus}
                          label="Status"
                          onChange={(e) => setEditStatus(e.target.value)}
                        >
                          <MenuItem value="PENDING">Pending</MenuItem>
                          <MenuItem value="REVIEWING">Reviewing</MenuItem>
                          <MenuItem value="QUOTED">Quoted</MenuItem>
                          <MenuItem value="ACCEPTED">Accepted</MenuItem>
                          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                          <MenuItem value="COMPLETED">Completed</MenuItem>
                          <MenuItem value="CANCELLED">Cancelled</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        label="Quoted Price (KSh)"
                        type="number"
                        value={editQuotedPrice}
                        onChange={(e) => setEditQuotedPrice(e.target.value)}
                        disabled={!editMode}
                        fullWidth
                      />

                      <TextField
                        label="Admin Notes"
                        multiline
                        rows={4}
                        value={editAdminNotes}
                        onChange={(e) => setEditAdminNotes(e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        placeholder="Internal notes, quote details, follow-up information..."
                      />
                    </Box>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                {editMode ? (
                  <>
                    <Button onClick={() => setEditMode(false)} disabled={saving}>
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSaveChanges}
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleCloseDetails}>Close</Button>
                    <Button variant="contained" onClick={() => setEditMode(true)}>
                      Edit
                    </Button>
                  </>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </AdminLayout>
  );
}
