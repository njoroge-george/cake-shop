'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Search,
} from '@mui/icons-material';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios';

interface Cake {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  inStock: boolean;
  featured: boolean;
  isVisible: boolean;
  categoryId: string;
  createdAt: string;
  averageRating?: number;
  reviewCount?: number;
}

export default function AdminCakesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null);
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session && (session.user as any)?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cakes', { params: { limit: 100 } });
      setCakes(response.data.cakes);
    } catch (error) {
      console.error('Error fetching cakes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, cake: Cake) => {
    setAnchorEl(event.currentTarget);
    setSelectedCake(cake);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleVisibilityClick = (cake: Cake) => {
    setSelectedCake(cake);
    setVisibilityDialogOpen(true);
    handleMenuClose();
  };

  const handleToggleVisibility = async () => {
    if (!selectedCake) return;

    try {
      await axios.patch(`/api/cakes/${selectedCake.id}`, {
        isVisible: !selectedCake.isVisible,
      });

      // Update local state
      setCakes(cakes.map(c => 
        c.id === selectedCake.id 
          ? { ...c, isVisible: !c.isVisible }
          : c
      ));

      setVisibilityDialogOpen(false);
      setSelectedCake(null);
    } catch (error) {
      console.error('Error updating visibility:', error);
      alert('Failed to update visibility');
    }
  };

  const handleDeleteClick = (cake: Cake) => {
    setSelectedCake(cake);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedCake) return;

    try {
      await axios.delete(`/api/cakes/${selectedCake.id}`);
      setCakes(cakes.filter(c => c.id !== selectedCake.id));
      setDeleteDialogOpen(false);
      setSelectedCake(null);
    } catch (error) {
      console.error('Error deleting cake:', error);
      alert('Failed to delete cake');
    }
  };

  const filteredCakes = cakes.filter(cake =>
    cake.name.toLowerCase().includes(search.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Manage Cakes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {cakes.length} total cakes
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
            onClick={() => router.push('/admin/cakes/new')}
          >
            Add New Cake
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search cakes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />

        {/* Cakes Grid using CSS Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {filteredCakes.map((cake) => (
            <Card
              key={cake.id}
              sx={{
                position: 'relative',
                opacity: cake.isVisible ? 1 : 0.6,
                border: cake.isVisible ? 'none' : '2px dashed',
                borderColor: 'error.main',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              {/* Visibility Badge */}
              {!cake.isVisible && (
                <Chip
                  label="Hidden"
                  size="small"
                  color="error"
                  icon={<VisibilityOff />}
                  sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
                />
              )}

              {/* Featured Badge */}
              {cake.featured && (
                <Chip
                  label="Featured"
                  size="small"
                  color="secondary"
                  sx={{ position: 'absolute', top: 10, right: 50, zIndex: 1 }}
                />
              )}

              {/* Menu Button */}
              <IconButton
                sx={{ position: 'absolute', top: 5, right: 5, zIndex: 1, bgcolor: 'white' }}
                onClick={(e) => handleMenuOpen(e, cake)}
              >
                <MoreVert />
              </IconButton>

              <CardMedia
                component="img"
                height="180"
                image={cake.images[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'}
                alt={cake.name}
              />

              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {cake.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {cake.description.substring(0, 80)}...
                </Typography>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                  KSh {cake.basePrice.toLocaleString()}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  {!cake.inStock && (
                    <Chip label="Out of Stock" size="small" color="error" />
                  )}
                  <Chip
                    label={cake.isVisible ? 'Visible' : 'Hidden'}
                    size="small"
                    color={cake.isVisible ? 'success' : 'default'}
                    icon={cake.isVisible ? <Visibility /> : <VisibilityOff />}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Empty State */}
        {filteredCakes.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No cakes found
            </Typography>
          </Box>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleVisibilityClick(selectedCake!)}>
            {selectedCake?.isVisible ? <VisibilityOff sx={{ mr: 1 }} /> : <Visibility sx={{ mr: 1 }} />}
            {selectedCake?.isVisible ? 'Hide from Customers' : 'Show to Customers'}
          </MenuItem>
          <MenuItem onClick={() => { router.push(`/admin/cakes/${selectedCake?.id}/edit`); handleMenuClose(); }}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={() => handleDeleteClick(selectedCake!)}>
            <Delete sx={{ mr: 1 }} color="error" />
            <Typography color="error">Delete</Typography>
          </MenuItem>
        </Menu>

        {/* Visibility Toggle Modal */}
        <Dialog open={visibilityDialogOpen} onClose={() => setVisibilityDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedCake?.isVisible ? 'Hide Cake from Customers?' : 'Show Cake to Customers?'}
          </DialogTitle>
          <DialogContent>
            <Alert severity={selectedCake?.isVisible ? 'warning' : 'info'} sx={{ mb: 2 }}>
              {selectedCake?.isVisible
                ? 'This cake will be hidden from the customer-facing store. Existing orders will not be affected.'
                : 'This cake will become visible in the customer-facing store and can be ordered.'}
            </Alert>

            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {selectedCake?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current status: {selectedCake?.isVisible ? 'Visible' : 'Hidden'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New status: {selectedCake?.isVisible ? 'Hidden' : 'Visible'}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVisibilityDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleToggleVisibility}
              variant="contained"
              color={selectedCake?.isVisible ? 'warning' : 'primary'}
            >
              {selectedCake?.isVisible ? 'Hide Cake' : 'Show Cake'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Delete Cake?</DialogTitle>
          <DialogContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              This action cannot be undone. The cake will be permanently deleted.
            </Alert>
            <Typography variant="body1">
              Are you sure you want to delete <strong>{selectedCake?.name}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}