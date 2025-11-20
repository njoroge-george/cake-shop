'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Cake,
  Schedule,
  ThumbUp,
  LocalShipping,
  EmojiEvents,
  Favorite,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import axios from 'axios';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string | null;
  order: number;
}

const values = [
  {
    icon: <Cake sx={{ fontSize: 40 }} />,
    title: 'Fresh Ingredients',
    description: 'We use only the finest, freshest ingredients sourced locally to ensure every cake is of the highest quality.',
  },
  {
    icon: <ThumbUp sx={{ fontSize: 40 }} />,
    title: 'Expert Bakers',
    description: 'Our team of professional pastry chefs brings years of experience and passion to every creation.',
  },
  {
    icon: <LocalShipping sx={{ fontSize: 40 }} />,
    title: 'Timely Delivery',
    description: 'We guarantee on-time delivery to make your celebrations perfect and stress-free.',
  },
  {
    icon: <Favorite sx={{ fontSize: 40 }} />,
    title: 'Custom Designs',
    description: 'Every cake can be customized to match your vision and make your occasion truly special.',
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 40 }} />,
    title: 'Award Winning',
    description: 'Recognized for excellence in taste, design, and customer service across Kenya.',
  },
  {
    icon: <Schedule sx={{ fontSize: 40 }} />,
    title: 'Quick Service',
    description: 'From order to delivery in as little as 48 hours, without compromising on quality.',
  },
];

const stats = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '15+', label: 'Years of Excellence' },
  { value: '50+', label: 'Cake Varieties' },
  { value: '99%', label: 'Satisfaction Rate' },
];

export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get('/api/team-members');
        setTeam(response.data.teamMembers || []);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoadingTeam(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: 'background.default' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #FF69B4 0%, #9C27B0 100%)',
            color: 'white',
            py: 8,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h2"
                sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}
              >
                About Our Cake Shop 🍰
              </Typography>
              <Typography
                variant="h5"
                sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', opacity: 0.95 }}
              >
                Crafting sweet memories since 2010, one delicious cake at a time
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Stats Section */}
        <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Container>

        {/* Our Story */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
              },
              gap: 6,
              alignItems: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                Our Story
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                Founded in 2010 with a simple mission: to bring joy to every celebration through
                exceptional cakes. What started as a small home bakery has grown into Kenya's
                premier cake shop, serving thousands of happy customers across Nairobi and beyond.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                Our passion for perfection drives everything we do. From selecting the finest
                ingredients to crafting each design with meticulous attention to detail, we ensure
                that every cake that leaves our kitchen is a masterpiece.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                Today, we're proud to be the go-to choice for weddings, birthdays, corporate events,
                and every celebration in between. But we never forget where we started – with a love
                for baking and a commitment to making people smile.
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800"
                alt="Our bakery"
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </motion.div>
          </Box>
        </Container>

        <Divider sx={{ my: 6 }} />

        {/* Our Values */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}
          >
            Why Choose Us
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            We're committed to excellence in every aspect of our service
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: "0 30px",
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        mb: 2,
                      }}
                    >
                      {value.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>

        <Divider sx={{ my: 6 }} />

        {/* Meet the Team */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}
          >
            Meet Our Team
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            The talented people behind every delicious creation
          </Typography>

          {loadingTeam ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : team.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                Our team information is being updated. Check back soon!
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 4,
              }}
            >
              {team.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: "30px 0",
                      textAlign: 'center',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Avatar
                        src={member.image || undefined}
                        alt={member.name}
                        sx={{
                          width: 150,
                          height: 200,
                          fontSize: 50,
                          mx: 'auto',
                          mb: 2,
                          bgcolor: 'primary.light',
                          color: 'primary.main',
                        }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {member.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="primary.main"
                        sx={{ fontWeight: 600, mb: 2 }}
                      >
                        {member.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.bio}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          )}
        </Container>

        {/* CTA Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #FF69B4 0%, #9C27B0 100%)',
            color: 'white',
            py: 8,
            mt: 8,
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}
            >
              Ready to Order?
            </Typography>
            <Typography
              variant="h6"
              sx={{ textAlign: 'center', mb: 4, opacity: 0.95 }}
            >
              Browse our collection of delicious cakes and place your order today!
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <motion.a
                href="/cakes"
                style={{ textDecoration: 'none' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 2,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                  }}
                >
                  Browse Cakes
                </Box>
              </motion.a>
              <motion.a
                href="/contact"
                style={{ textDecoration: 'none' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  sx={{
                    bgcolor: 'transparent',
                    color: 'white',
                    border: '2px solid white',
                    px: 4,
                    py: 2,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                  }}
                >
                  Contact Us
                </Box>
              </motion.a>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}
