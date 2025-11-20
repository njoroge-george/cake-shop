'use client';

import { Box, Container, Typography, Button, Card, CardMedia, CardContent, Avatar, Paper, useTheme } from '@mui/material';
import { 
  ArrowForward, 
  Cake, 
  LocalShipping, 
  Star, 
  EmojiEvents, 
  Favorite, 
  AutoAwesome,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/layout/Header';

const categories = [
  { 
    name: 'Birthday Cakes', 
    image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&q=80',
    slug: 'birthday',
    description: 'Celebrate life\'s special moments'
  },
  { 
    name: 'Wedding Cakes', 
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&q=80',
    slug: 'wedding',
    description: 'Elegant masterpieces for your big day'
  },
  { 
    name: 'Custom Cakes', 
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&q=80',
    slug: 'custom',
    description: 'Your imagination, our creation'
  },
  { 
    name: 'Corporate Events', 
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&q=80',
    slug: 'corporate',
    description: 'Professional excellence delivered'
  },
];

const features = [
  { 
    icon: <Cake sx={{ fontSize: 50 }} />, 
    title: 'Premium Quality', 
    description: 'Only the finest ingredients, baked to perfection',
    color: '#FF69B4'
  },
  { 
    icon: <LocalShipping sx={{ fontSize: 50 }} />, 
    title: 'Lightning Fast', 
    description: 'Same-day delivery across Nairobi',
    color: '#9C27B0'
  },
  { 
    icon: <Star sx={{ fontSize: 50 }} />, 
    title: 'Award Winning', 
    description: '5-star rated by 10,000+ customers',
    color: '#FFD700'
  },
  { 
    icon: <AutoAwesome sx={{ fontSize: 50 }} />, 
    title: 'Artistic Design', 
    description: 'Every cake is a work of art',
    color: '#FF6B6B'
  },
];

const stats = [
  { value: '10,000+', label: 'Happy Customers', icon: <Favorite /> },
  { value: '15+', label: 'Years Excellence', icon: <EmojiEvents /> },
  { value: '50+', label: 'Cake Varieties', icon: <Cake /> },
  { value: '99%', label: 'Satisfaction', icon: <TrendingUp /> },
];

export default function Home() {
  const theme = useTheme();
  
  return (
    <>
      <Header />
      <Box>
        {/* Epic Hero Section */}
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: '90vh', md: '95vh' },
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #0A1929 0%, #1a237e 50%, #4a148c 100%)'
              : 'linear-gradient(135deg, #FF69B4 0%, #9C27B0 50%, #6A1B9A 100%)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              animation: 'pulse 8s ease-in-out infinite',
            },
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.5 },
            },
          }}
        >
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
                gap: 6,
                alignItems: 'center',
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                <Box>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'rgba(255,255,255,0.9)',
                        mb: 2,
                        fontWeight: 600,
                        letterSpacing: 3,
                        textTransform: 'uppercase',
                      }}
                    >
                      Kenya's Premier Cake Shop
                    </Typography>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 900,
                        mb: 3,
                        fontSize: { xs: '3rem', sm: '4rem', md: '5rem', lg: '6rem' },
                        lineHeight: 1.1,
                        color: 'white',
                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      }}
                    >
                      Cakes That
                      <br />
                      <Box
                        component="span"
                        sx={{
                          background: 'linear-gradient(90deg, #FFD700, #FFA500, #FF69B4)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          animation: 'shimmer 3s ease-in-out infinite',
                          '@keyframes shimmer': {
                            '0%, 100%': { backgroundPosition: '0% 50%' },
                            '50%': { backgroundPosition: '100% 50%' },
                          },
                          backgroundSize: '200% 200%',
                        }}
                      >
                        Dominate
                      </Box>
                    </Typography>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 5,
                        color: 'rgba(255,255,255,0.85)',
                        fontWeight: 400,
                        maxWidth: 600,
                        lineHeight: 1.6,
                      }}
                    >
                      Uncompromising quality. Breathtaking designs. Delivered with precision.
                      Your celebrations deserve nothing less than perfection.
                    </Typography>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Button
                        component={Link}
                        href="/cakes"
                        variant="contained"
                        size="large"
                        sx={{
                          bgcolor: 'white',
                          color: 'primary.main',
                          px: 5,
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          borderRadius: 3,
                          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                          '&:hover': {
                            bgcolor: 'grey.100',
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                        endIcon={<ArrowForward />}
                      >
                        Explore Collection
                      </Button>
                      <Button
                        component={Link}
                        href="/custom-order"
                        variant="outlined"
                        size="large"
                        sx={{
                          borderColor: 'white',
                          borderWidth: 2,
                          color: 'white',
                          px: 5,
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          borderRadius: 3,
                          '&:hover': {
                            borderWidth: 2,
                            borderColor: 'white',
                            bgcolor: 'rgba(255,255,255,0.15)',
                            transform: 'translateY(-4px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                        startIcon={<AutoAwesome />}
                      >
                        Custom Order
                      </Button>
                    </Box>
                  </motion.div>
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    display: { xs: 'none', lg: 'block' },
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&q=80"
                    alt="Masterpiece Cake"
                    sx={{
                      width: '100%',
                      borderRadius: 6,
                      boxShadow: '0 30px 90px rgba(0,0,0,0.5)',
                      transform: 'perspective(1000px) rotateY(-5deg)',
                      transition: 'transform 0.6s ease',
                      '&:hover': {
                        transform: 'perspective(1000px) rotateY(0deg) scale(1.05)',
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 40px rgba(255,215,0,0.4)',
                      animation: 'float 3s ease-in-out infinite',
                      '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0)' },
                        '50%': { transform: 'translateY(-20px)' },
                      },
                    }}
                  >
                    <Star sx={{ fontSize: 40, color: 'white', mb: 1 }} />
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>
                      5.0
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: 'white', fontWeight: 600 }}>
                      RATING
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Container>
        </Box>

        {/* Stats Section */}
        <Container maxWidth="xl" sx={{ mt: -8, mb: 12, position: 'relative', zIndex: 2 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Paper
                  elevation={10}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 4,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #132F4C 0%, #1a237e 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                    border: theme.palette.mode === 'dark' ? '1px solid rgba(255,215,0,0.2)' : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: 'primary.main',
                      mx: 'auto',
                      mb: 2,
                      fontSize: 30,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: 'primary.main',
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: 'text.secondary',
                      letterSpacing: 1,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Container>

        {/* Features Section */}
        <Box sx={{ bgcolor: 'background.default', py: 12 }}>
          <Container maxWidth="xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  textAlign: 'center',
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Why We're{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  Unbeatable
                </Box>
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ textAlign: 'center', mb: 8, maxWidth: 700, mx: 'auto' }}
              >
                We don't just bake cakes. We craft experiences that leave lasting impressions.
              </Typography>
            </motion.div>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 4,
              }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Box
                    sx={{
                      p: 4,
                      height: '100%',
                      borderRadius: 4,
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, #132F4C 0%, #1a237e 100%)'
                        : 'white',
                      border: theme.palette.mode === 'dark' 
                        ? '2px solid rgba(255,215,0,0.2)' 
                        : '2px solid transparent',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      transition: 'all 0.4s ease',
                      '&:hover': {
                        borderColor: feature.color,
                        boxShadow: `0 20px 60px ${feature.color}40`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: feature.color,
                        mb: 3,
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 3,
                        bgcolor: `${feature.color}15`,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.8 }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Categories Section */}
        <Box sx={{ py: 12 }}>
          <Container maxWidth="xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  textAlign: 'center',
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Our{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  Signature
                </Box>{' '}
                Collections
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ textAlign: 'center', mb: 8, maxWidth: 700, mx: 'auto' }}
              >
                Meticulously crafted for every milestone in your journey
              </Typography>
            </motion.div>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 4,
              }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card
                    component={Link}
                    href={`/cakes?category=${category.slug}`}
                    sx={{
                      textDecoration: 'none',
                      height: '100%',
                      cursor: 'pointer',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                      transition: 'all 0.4s ease',
                      '&:hover': {
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                        '& .category-overlay': {
                          bgcolor: 'rgba(0,0,0,0.3)',
                        },
                        '& .category-title': {
                          transform: 'translateY(-10px)',
                        },
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 350 }}>
                      <CardMedia
                        component="img"
                        height="350"
                        image={category.image}
                        alt={category.name}
                        sx={{
                          transition: 'transform 0.6s ease',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        }}
                      />
                      <Box
                        className="category-overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                          transition: 'all 0.4s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          p: 3,
                        }}
                      >
                        <Box className="category-title" sx={{ transition: 'transform 0.4s ease' }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 900,
                              color: 'white',
                              mb: 1,
                              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                            }}
                          >
                            {category.name}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'rgba(255,255,255,0.9)',
                              fontWeight: 500,
                            }}
                          >
                            {category.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Epic CTA Section */}
        <Box
          sx={{
            position: 'relative',
            py: 15,
            overflow: 'hidden',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1a237e 0%, #4a148c 50%, #6A1B9A 100%)'
                : 'linear-gradient(135deg, #FF69B4 0%, #9C27B0 50%, #6A1B9A 100%)',
          }}
        >
          {/* Animated background elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              animation: 'pulse 4s ease-in-out infinite',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '-30%',
              left: '-5%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              animation: 'pulse 4s ease-in-out infinite 2s',
            }}
          />

          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  Ready to Experience{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(90deg, #FFD700, #FFF, #FFD700)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: 'shimmer 3s linear infinite',
                    }}
                  >
                    Perfection
                  </Box>
                  ?
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    mb: 5,
                    opacity: 0.95,
                    maxWidth: 600,
                    mx: 'auto',
                    fontWeight: 500,
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  }}
                >
                  Join thousands of satisfied customers who trust us to make their celebrations
                  unforgettable. Your dream cake is just a click away.
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Button
                    component={Link}
                    href="/cakes"
                    variant="contained"
                    size="large"
                    sx={{
                      py: 2,
                      px: 6,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      borderRadius: 50,
                      bgcolor: 'white',
                      color: 'primary.main',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'translateY(-5px)',
                        boxShadow: '0 15px 50px rgba(0,0,0,0.4)',
                      },
                    }}
                  >
                    Browse Cakes
                  </Button>

                  <Button
                    component={Link}
                    href="/custom-order"
                    variant="outlined"
                    size="large"
                    sx={{
                      py: 2,
                      px: 6,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      borderRadius: 50,
                      borderColor: 'white',
                      color: 'white',
                      borderWidth: 2,
                      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-5px)',
                        borderWidth: 2,
                        boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
                      },
                    }}
                  >
                    Custom Order
                  </Button>
                </Box>

                {/* Trust badges */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 5,
                    mt: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  {[
                    { icon: <Favorite />, text: '99% Satisfaction' },
                    { icon: <EmojiEvents />, text: 'Award Winning' },
                    { icon: <AutoAwesome />, text: 'Premium Quality' },
                  ].map((badge, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        opacity: 0.9,
                      }}
                    >
                      <Box sx={{ color: '#FFD700' }}>{badge.icon}</Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {badge.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Container>
        </Box>
      </Box>
    </>
  );
}

