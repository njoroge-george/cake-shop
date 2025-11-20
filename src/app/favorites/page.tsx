'use client';

import { Box, Container, Typography, Paper, Button, Card, CardActionArea, CardMedia, CardContent, Chip, CircularProgress } from '@mui/material';
import { FavoriteBorder, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/layout/Header';

type FavoriteItem = {
  id: string;
  cake: { id: string; name: string; images: string[]; basePrice: number; featured: boolean; inStock: boolean };
};

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      (async () => {
        try {
          const res = await axios.get('/api/favorites');
          setFavorites(res.data.favorites || []);
        } catch (e) {
          console.error('Failed to load favorites', e);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [status]);

  if (status === 'loading') return null;

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: 'background.default', minHeight: '80vh' }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
            My Favorites ❤️
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : favorites.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Paper sx={{ p: 6, textAlign: 'center' }}>
                <FavoriteBorder sx={{ fontSize: 100, color: 'text.secondary', mb: 3 }} />
                <Typography variant="h5" sx={{ mb: 2 }}>
                  No favorites yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Start adding cakes to your favorites to see them here!
                </Typography>
                <Button variant="contained" size="large" endIcon={<ArrowForward />} onClick={() => router.push('/cakes')}>
                  Browse Cakes
                </Button>
              </Paper>
            </motion.div>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
              {favorites.map((fav) => (
                <motion.div key={fav.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <Card>
                      <CardActionArea onClick={() => router.push(`/cakes/${fav.cake.id}`)}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={fav.cake.images?.[0] || '/placeholder.png'}
                          alt={fav.cake.name}
                        />
                        <CardContent>
                          <Typography variant="h6" noWrap>{fav.cake.name}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="subtitle1" color="primary">
                              KSh {fav.cake.basePrice.toLocaleString()}
                            </Typography>
                            {!fav.cake.inStock && <Chip size="small" label="Out of stock" />}
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </motion.div>
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
