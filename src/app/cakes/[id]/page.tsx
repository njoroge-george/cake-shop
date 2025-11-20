'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Rating,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  Skeleton,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  ArrowBack,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import axios from 'axios';
import { Cake, Review } from '@/types';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

export default function CakeDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  
  const [cake, setCake] = useState<Cake | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedLayers, setSelectedLayers] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customMessage, setCustomMessage] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  useEffect(() => {
    fetchCake();
  }, [params.id]);

  useEffect(() => {
    if (cake && selectedSize && selectedLayers) {
      calculatePrice();
    }
  }, [selectedSize, selectedLayers, cake]);

  const fetchCake = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/cakes/${params.id}`);
      const cakeData = response.data;
      setCake(cakeData);
      
      // Set defaults
      if (cakeData.flavors?.length > 0) setSelectedFlavor(cakeData.flavors[0]);
      if (cakeData.sizes?.length > 0) setSelectedSize(cakeData.sizes[0].name);
      if (cakeData.layers?.length > 0) setSelectedLayers(cakeData.layers[0].name);
    } catch (error) {
      console.error('Error fetching cake:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!cake) return;
    const sizePrice = cake.sizes.find((s: any) => s.name === selectedSize)?.price || 0;
    const layersPrice = cake.layers.find((l: any) => l.name === selectedLayers)?.price || 0;
    const unit = (cake.basePrice || 0) + sizePrice + layersPrice;
    setCalculatedPrice(unit);
  };

  const getVolumeDiscountRate = (qty: number) => {
    if (qty >= 10) return 0.15;
    if (qty >= 5) return 0.1;
    if (qty >= 3) return 0.05;
    return 0;
  };

  const handleAddToCart = () => {
    if (!cake) return;
    const rate = getVolumeDiscountRate(quantity);
    const discountedUnit = Math.round(calculatedPrice * (1 - rate));
    addItem({
      userId: '', // Will be set from session
      cakeId: cake.id,
      cake,
      quantity,
      selectedSize,
      selectedFlavor,
      selectedLayers,
      customMessage,
      specialRequests,
      price: discountedUnit,
    });

    // Show success message (you can add a toast here)
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={400} />
          <Skeleton height={60} sx={{ mt: 2 }} />
          <Skeleton height={40} />
        </Container>
      </>
    );
  }

  if (!cake) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4">Cake not found</Typography>
          <Button component={Link} href="/cakes" sx={{ mt: 2 }}>
            Back to Cakes
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          component={Link}
          href="/cakes"
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}
        >
          Back to Cakes
        </Button>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 4,
          }}
        >
          {/* Images */}
          <Box>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                component="img"
                src={cake.images[selectedImage] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'}
                alt={cake.name}
                sx={{
                  width: '100%',
                  height: 500,
                  objectFit: 'cover',
                  borderRadius: 3,
                  mb: 2,
                }}
              />
              
              {cake.images.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {cake.images.map((img, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={img}
                      alt={`${cake.name} ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: selectedImage === index ? '3px solid' : '1px solid',
                        borderColor: selectedImage === index ? 'primary.main' : 'divider',
                      }}
                    />
                  ))}
                </Box>
              )}
            </motion.div>
          </Box>

          {/* Details */}
          <Box>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {cake.featured && (
                <Chip label="Featured" color="secondary" sx={{ mb: 2 }} />
              )}

              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                {cake.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating value={cake.averageRating || 0} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({cake.reviewCount || 0} reviews)
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                  KSh {calculatedPrice.toLocaleString()} <Typography component="span" variant="body2" color="text.secondary">per unit</Typography>
                </Typography>
              </Box>

              {/* Stock and discount info */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                {typeof cake.stock === 'number' && (
                  <Chip label={`In stock: ${cake.stock}`} color={cake.stock > 0 ? 'success' : 'default'} />
                )}
                <Chip label="Buy 3+ save 5%" variant="outlined" size="small" />
                <Chip label="5+ save 10%" variant="outlined" size="small" />
                <Chip label="10+ save 15%" variant="outlined" size="small" />
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {cake.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Size Selection */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Size</InputLabel>
                <Select
                  value={selectedSize}
                  label="Size"
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {cake.sizes.map((size: any) => (
                    <MenuItem key={size.name} value={size.name}>
                      {size.name} - Serves {size.serves} (KSh {size.price.toLocaleString()})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Flavor Selection */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Flavor</InputLabel>
                <Select
                  value={selectedFlavor}
                  label="Flavor"
                  onChange={(e) => setSelectedFlavor(e.target.value)}
                >
                  {cake.flavors.map((flavor) => (
                    <MenuItem key={flavor} value={flavor}>
                      {flavor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Layers Selection */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Layers</InputLabel>
                <Select
                  value={selectedLayers}
                  label="Layers"
                  onChange={(e) => setSelectedLayers(e.target.value)}
                >
                  {cake.layers.map((layer: any) => (
                    <MenuItem key={layer.name} value={layer.name}>
                      {layer.name} {layer.price > 0 && `(+KSh ${layer.price})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Custom Message */}
              <TextField
                fullWidth
                label="Custom Message (Optional)"
                placeholder="e.g., Happy Birthday Sarah!"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Special Requests */}
              <TextField
                fullWidth
                label="Special Requests (Optional)"
                placeholder="Any special dietary requirements or decorations?"
                multiline
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                sx={{ mb: 3 }}
              />

              {/* Quantity */}
              <FormControl sx={{ minWidth: 120, mb: 2 }}>
                <InputLabel>Quantity</InputLabel>
                <Select
                  value={quantity}
                  label="Quantity"
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  {Array.from({ length: Math.max(1, Math.min(10, (cake.stock || 10))) }, (_, i) => i + 1).map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Price summary with discount */}
              <Box sx={{ mb: 3 }}>
                {(() => {
                  const rate = getVolumeDiscountRate(quantity);
                  const unitAfter = Math.round(calculatedPrice * (1 - rate));
                  const total = unitAfter * quantity;
                  const saved = (calculatedPrice * quantity) - total;
                  return (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Volume discount: {rate * 100}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        You save: KSh {saved.toLocaleString()}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Total: KSh {total.toLocaleString()}
                      </Typography>
                    </>
                  );
                })()}
              </Box>

              {/* Add to Cart Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={!cake.inStock || (typeof cake.stock === 'number' && quantity > cake.stock)}
                sx={{ mb: 2 }}
              >
                {cake.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>

              {/* Tags */}
              {cake.tags && cake.tags.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Tags:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {cake.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                </Box>
              )}
            </motion.div>
          </Box>
        </Box>

        {/* Reviews Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
            Customer Reviews
          </Typography>

          {cake.reviews && cake.reviews.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {cake.reviews.map((review: Review) => (
                <Card key={review.id}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2 }}>
                        {review.user?.name?.charAt(0) || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {review.user?.name || 'Anonymous'}
                        </Typography>
                        <Rating value={review.rating} size="small" readOnly />
                      </Box>
                    </Box>
                    <Typography variant="body1">{review.comment}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">
              No reviews yet. Be the first to review this cake!
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}
