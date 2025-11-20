'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Divider,
  TextField,
  Paper,
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  
  const deliveryFee = parseFloat(process.env.NEXT_PUBLIC_DELIVERY_FEE || '500');
  const subtotal = getTotal();
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (items.length > 0) {
      router.push('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center' }}>
            <ShoppingCart sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Add some delicious cakes to get started!
            </Typography>
            <Button
              component={Link}
              href="/cakes"
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
            >
              Browse Cakes
            </Button>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Shopping Cart
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 4 
        }}>
          {/* Cart Items */}
          <Box>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '100px 1fr auto' },
                      gap: 2,
                      alignItems: 'center'
                    }}>
                      {/* Image */}
                      <Box
                        component="img"
                        src={item.cake?.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'}
                        alt={item.cake?.name || 'Cake'}
                        sx={{
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 2,
                        }}
                      />

                      {/* Details */}
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {item.cake?.name || 'Cake'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Size: {item.selectedSize}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Flavor: {item.selectedFlavor}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Layers: {item.selectedLayers}
                        </Typography>
                        {item.customMessage && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Message: "{item.customMessage}"
                          </Typography>
                        )}
                      </Box>

                      {/* Quantity & Price */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove />
                          </IconButton>
                          <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Add />
                          </IconButton>
                        </Box>

                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </Typography>

                        <IconButton
                          color="error"
                          onClick={() => removeItem(item.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Button
              variant="outlined"
              color="error"
              onClick={clearCart}
              sx={{ mt: 2 }}
            >
              Clear Cart
            </Button>
          </Box>

          {/* Order Summary */}
          <Box>
            <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Order Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    KSh {subtotal.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography color="text.secondary">Delivery Fee</Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    KSh {deliveryFee.toLocaleString()}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                    KSh {total.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleCheckout}
                sx={{ mb: 2 }}
              >
                Proceed to Checkout
              </Button>

              <Button
                component={Link}
                href="/cakes"
                fullWidth
                variant="outlined"
                size="large"
              >
                Continue Shopping
              </Button>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  💳 Secure M-Pesa Payment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  🚚 Free delivery on orders above KSh 5,000
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </>
  );
}