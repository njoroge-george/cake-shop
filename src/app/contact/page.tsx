'use client';

import { Box, Container, Typography, Card, CardContent, Button, Paper } from '@mui/material';
import { Email, Phone, LocationOn, Schedule } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '@/components/layout/Header';

const contactInfo = [
  {
    icon: <Phone sx={{ fontSize: 40 }} />,
    title: 'Phone',
    details: ['+254 101456700', '+254 7101456700'],
  },
  {
    icon: <Email sx={{ fontSize: 40 }} />,
    title: 'Email',
    details: ['info@cakeshop.com', 'orders@cakeshop.com'],
  },
  {
    icon: <LocationOn sx={{ fontSize: 40 }} />,
    title: 'Location',
    details: ['Nyeri', 'Kenya'],
  },
  {
    icon: <Schedule sx={{ fontSize: 40 }} />,
    title: 'Working Hours',
    details: ['Mon - Sat: 8:00 AM - 8:00 PM'],
  },
];

export default function ContactPage() {
  const handleOpenChat = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-chat'));
    }
  };

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
                Get In Touch 📞
              </Typography>
              <Typography
                variant="h5"
                sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', opacity: 0.95 }}
              >
                Have a question or special request? We'd love to hear from you!
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Contact Info Cards */}
        <Container maxWidth="lg" sx={{ mt: -4, mb: 8 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                  <CardContent>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {info.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      {info.title}
                    </Typography>
                    {info.details.map((detail, i) => (
                      <Typography
                        key={i}
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {detail}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>

        {/* Chat CTA & Map */}
        <Container maxWidth="lg" sx={{ pb: 10 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>
            {/* Chat CTA */}
            <Box>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                  Chat With Us
                </Typography>
                <Paper sx={{ p: 4 }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    We’ve moved from contact forms to live chat for faster help. Use the chat bubble in the top bar to start a conversation with our team.
                  </Typography>
                  <Button variant="contained" size="large" fullWidth onClick={handleOpenChat}>
                    Open Chat
                  </Button>
                </Paper>
              </motion.div>
            </Box>

            {/* Map & Additional Info */}
            <Box>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                  Visit Our Store
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 400,
                    bgcolor: 'grey.200',
                    borderRadius: 2,
                    mb: 3,
                    overflow: 'hidden',
                  }}
                >
                  {/* Google Maps Embed */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8192451857!2d36.80639631475395!3d-1.2832531359843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d640000001%3A0x9bce9d5c4e0e2f5!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1699999999999!5m2!1sen!2ske"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </Box>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Why Visit Us?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • See our cake displays in person
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Taste free samples of our signature cakes
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Consult with our expert bakers for custom designs
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Pick up your order and save on delivery fees
                  </Typography>
                  <Typography variant="body2">
                    • Free parking available on premises
                  </Typography>
                </Paper>
              </motion.div>
            </Box>
          </Box>
        </Container>

        {/* FAQ or CTA Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #FF69B4 0%, #9C27B0 100%)',
            color: 'white',
            py: 6,
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}
            >
              Need Immediate Assistance?
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', mb: 3, opacity: 0.95 }}
            >
              Call us at +254 712 345 678 for urgent orders or inquiries.
              <br />
              We're here to help make your celebration perfect!
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                href="tel:+254712345678"
                variant="contained"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                Call Now
              </Button>
              <Button
                href="/cakes"
                variant="outlined"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { borderColor: 'grey.100', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Browse Cakes
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}
