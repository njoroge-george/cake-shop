'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  Divider,
} from '@mui/material';
import { Save, AccountCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import axios from 'axios';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    image: '',
    address: '',
    city: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      (async () => {
        try {
          const res = await axios.get('/api/profile');
          const user = res.data.user || {};
          setFormData({
            name: user.name || session?.user?.name || '',
            email: user.email || session?.user?.email || '',
            phone: user.phone || '',
            image: user.image || '',
            address: '',
            city: '',
          });
          setImagePreview(user.image || '');
        } catch (e) {
          console.error('Failed to load profile', e);
          // fallback to session values
          setFormData((prev) => ({
            ...prev,
            name: session?.user?.name || '',
            email: session?.user?.email || '',
          }));
        } finally {
          setInitialLoading(false);
        }
      })();
    }
  }, [status, session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;
      
      // Upload image if a new file was selected
      if (imageFile) {
        const formDataToUpload = new FormData();
        formDataToUpload.append('file', imageFile);
        formDataToUpload.append('type', 'user');
        
        const uploadResponse = await axios.post('/api/upload', formDataToUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        imageUrl = uploadResponse.data.url;
      }
      
      const payload = { 
        name: formData.name, 
        phone: formData.phone, 
        image: imageUrl 
      };
      await axios.put('/api/profile', payload);
      
      // Fetch the updated user data from the database
      const userResponse = await axios.get('/api/user');
      const updatedUser = userResponse.data.user;
      
      console.log('Updated user from database:', updatedUser);
      
      // Update the session with fresh data from database
      const updateResult = await update({
        name: updatedUser.name,
        image: updatedUser.image,
      });
      
      console.log('Session update result:', updateResult);
      
      alert('Profile updated successfully!');
      setImageFile(null);
    } catch (e) {
      console.error('Failed to update profile', e);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || initialLoading) {
    return (
      <>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: 'background.default', minHeight: '80vh' }}>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
            My Profile
          </Typography>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Paper sx={{ p: 4 }}>
              {/* Profile Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar
                  src={imagePreview || formData.image || undefined}
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: 32,
                    mr: 3,
                  }}
                >
                  {session.user?.name?.charAt(0).toUpperCase() || <AccountCircle />}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {session.user?.name || 'Guest User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {session.user?.email}
                  </Typography>
                  <Typography variant="caption" color="primary.main">
                    {(session.user as any)?.role || 'CUSTOMER'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Profile Form */}
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                    />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+254 712 345 678"
                  />
                </Box>
                
                {/* Image Upload Section */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Profile Image
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar
                      src={imagePreview || formData.image || undefined}
                      alt={formData.name}
                      sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}
                    >
                      {formData.name.charAt(0).toUpperCase() || <AccountCircle />}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="profile-image-upload"
                        type="file"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="profile-image-upload">
                        <Button variant="outlined" component="span" fullWidth>
                          Choose Image File
                        </Button>
                      </label>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {imageFile ? imageFile.name : 'JPG, PNG, or WebP (recommended: 300x300px)'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Profile Image URL (Optional)"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Or enter image URL"
                    helperText="Use file upload above or enter a URL here"
                  />
                </Box>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, mt: 3 }}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Nairobi"
                  />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Delivery Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    placeholder="Enter your complete delivery address"
                  />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={<Save />}
                    fullWidth
                  >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
              </form>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}
