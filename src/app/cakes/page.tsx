'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Card, CardMedia, CardContent, Typography, Button, Chip, Rating, TextField, FormControl, InputLabel, Select, MenuItem, Drawer, IconButton, Pagination, Skeleton } from '@mui/material';
import {
  FilterList,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Search,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import axios from 'axios';
import { Cake } from '@/types';
import { useCartStore } from '@/store/cartStore';

export default function CakesPage() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetchCakes();
  }, [page, category, sortBy]);

  useEffect(() => {
    // Load categories from API (DB)
    (async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data.categories || []);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    })();
  }, []);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 12, sort: sortBy };
      if (category) params.category = category;
      if (search) params.search = search;

      const response = await axios.get('/api/cakes', { params });
      setCakes(response.data.cakes);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching cakes:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickAddToCart = (cake: Cake) => {
    if (!cake.inStock) return;
    const defaultSize = cake.sizes?.[0];
    const defaultLayer = cake.layers?.[0];
    const defaultFlavor = cake.flavors?.[0] || 'Standard';
    const unitPrice = (cake.basePrice || 0) + (defaultSize?.price || 0) + (defaultLayer?.price || 0);
    addItem({
      userId: '',
      cakeId: cake.id,
      cake,
      quantity: 1,
      selectedSize: defaultSize?.name || 'Default',
      selectedFlavor: defaultFlavor,
      selectedLayers: defaultLayer?.name || 'Standard',
      price: unitPrice,
    });
    alert('Added to cart');
  };

  const handleSearch = () => {
    setPage(1);
    fetchCakes();
  };

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              All Cakes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Discover our delicious collection of handcrafted cakes
            </Typography>
          </Box>

          {/* Search & Filters */}
          <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search cakes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ flexGrow: 1, minWidth: 250 }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.slug} value={c.slug}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Cakes Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
            {loading
              ? Array.from(new Array(12)).map((_, index) => (
                  <Card key={index}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton />
                      <Skeleton width="60%" />
                    </CardContent>
                  </Card>
                ))
              : cakes.map((cake, index) => (
                  <motion.div
                    key={cake.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          transition: 'transform 0.3s',
                        },
                      }}
                    >
                      {cake.featured && (
                        <Chip
                          label="Featured"
                          color="secondary"
                          size="small"
                          sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
                        />
                      )}

                      <CardMedia
                        component={Link}
                        href={`/cakes/${cake.id}`}
                        sx={{ height: 200, textDecoration: 'none' }}
                      >
                        <Box
                          component="img"
                          src={cake.images[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'}
                          alt={cake.name}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </CardMedia>

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 1 }}
                          component={Link}
                          href={`/cakes/${cake.id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          {cake.name}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating
                            value={cake.averageRating || 0}
                            precision={0.5}
                            size="small"
                            readOnly
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({cake.reviewCount || 0})
                          </Typography>
                        </Box>

                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                          KSh {cake.basePrice.toLocaleString()}
                        </Typography>

                        {!cake.inStock && (
                          <Chip label="Out of Stock" size="small" color="error" sx={{ mt: 1 }} />
                        )}
                      </CardContent>

                      <Box sx={{ p: 2, pt: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                        <Button
                          component={Link}
                          href={`/cakes/${cake.id}`}
                          variant="outlined"
                          disabled={!cake.inStock}
                        >
                          Details
                        </Button>
                        <Button
                          onClick={() => quickAddToCart(cake)}
                          variant="contained"
                          startIcon={<ShoppingCart />}
                          disabled={!cake.inStock}
                        >
                          Add
                        </Button>
                      </Box>
                      {cake.inStock && typeof cake.stock === 'number' && (
                        <Typography variant="caption" color="text.secondary" sx={{ px: 2, pb: 2 }}>
                          In stock: {cake.stock}
                        </Typography>
                      )}
                    </Card>
                  </motion.div>
                ))}
          </Box>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}

          {/* Empty State */}
          {!loading && cakes.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                No cakes found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your filters or search terms
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
