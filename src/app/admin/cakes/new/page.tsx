'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Switch,
  FormControlLabel,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import axios from 'axios';

interface SizeRow { name: string; serves: number; price: number; }
interface LayerRow { name: string; price: number; }

export default function NewCakePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [basePrice, setBasePrice] = useState<number>(0);
  const [images, setImages] = useState<string>('');
  const [flavors, setFlavors] = useState<string>('Vanilla,Chocolate');
  const [sizes, setSizes] = useState<SizeRow[]>([
    { name: 'Small (6")', serves: 6, price: 0 },
    { name: 'Medium (8")', serves: 12, price: 800 },
    { name: 'Large (10")', serves: 20, price: 2000 },
  ]);
  const [layers, setLayers] = useState<LayerRow[]>([
    { name: 'Single Layer', price: 0 },
    { name: 'Double Layer', price: 500 },
  ]);
  const [featured, setFeatured] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [stock, setStock] = useState<number>(10);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (session && (session.user as any)?.role !== 'ADMIN') router.push('/');
  }, [status, session]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data.categories || []);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    })();
  }, []);

  const addSize = () => setSizes([...sizes, { name: '', serves: 0, price: 0 }]);
  const addLayer = () => setLayers([...layers, { name: '', price: 0 }]);

  const save = async () => {
    try {
      setSaving(true);
      setError('');
      const payload = {
        name,
        description,
        basePrice: Number(basePrice) || 0,
        categoryId,
        images: images.split(',').map((s) => s.trim()).filter(Boolean),
        flavors: flavors.split(',').map((s) => s.trim()).filter(Boolean),
        sizes,
        layers,
        featured,
        inStock,
        isVisible,
        stock,
        tags: [],
      };
      await axios.post('/api/cakes', payload);
      router.push('/admin/cakes');
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to create cake');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Add New Cake</Typography>
        <Paper sx={{ p: 3, display: 'grid', gap: 2, maxWidth: 900 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline minRows={3} />

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={categoryId} label="Category" onChange={(e) => setCategoryId(String(e.target.value))}>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField type="number" label="Base Price (KSh)" value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} />
          </Box>

          <TextField label="Image URLs (comma-separated)" value={images} onChange={(e) => setImages(e.target.value)} fullWidth />
          <TextField label="Flavors (comma-separated)" value={flavors} onChange={(e) => setFlavors(e.target.value)} fullWidth />

          {/* Sizes */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Sizes</Typography>
            <Box sx={{ display: 'grid', gap: 1 }}>
              {sizes.map((s, idx) => (
                <Box key={idx} sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr' } }}>
                  <TextField label="Name" value={s.name} onChange={(e) => setSizes(sizes.map((row, i) => i === idx ? { ...row, name: e.target.value } : row))} />
                  <TextField type="number" label="Serves" value={s.serves} onChange={(e) => setSizes(sizes.map((row, i) => i === idx ? { ...row, serves: Number(e.target.value) } : row))} />
                  <TextField type="number" label="Price (KSh)" value={s.price} onChange={(e) => setSizes(sizes.map((row, i) => i === idx ? { ...row, price: Number(e.target.value) } : row))} />
                </Box>
              ))}
            </Box>
            <Button onClick={addSize} sx={{ mt: 1 }}>Add Size</Button>
          </Box>

          {/* Layers */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Layers</Typography>
            <Box sx={{ display: 'grid', gap: 1 }}>
              {layers.map((l, idx) => (
                <Box key={idx} sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '2fr 1fr' } }}>
                  <TextField label="Name" value={l.name} onChange={(e) => setLayers(layers.map((row, i) => i === idx ? { ...row, name: e.target.value } : row))} />
                  <TextField type="number" label="Price (KSh)" value={l.price} onChange={(e) => setLayers(layers.map((row, i) => i === idx ? { ...row, price: Number(e.target.value) } : row))} />
                </Box>
              ))}
            </Box>
            <Button onClick={addLayer} sx={{ mt: 1 }}>Add Layer</Button>
          </Box>

          {/* Toggles */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControlLabel control={<Switch checked={featured} onChange={(e) => setFeatured(e.target.checked)} />} label="Featured" />
            <FormControlLabel control={<Switch checked={inStock} onChange={(e) => setInStock(e.target.checked)} />} label="In Stock" />
            <FormControlLabel control={<Switch checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} />} label="Visible in Store" />
          </Box>

          <TextField type="number" label="Stock Count" value={stock} onChange={(e) => setStock(Number(e.target.value))} sx={{ maxWidth: 240 }} />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={() => router.push('/admin/cakes')}>Cancel</Button>
            <Button variant="contained" onClick={save} disabled={saving || !name || !categoryId}>Save Cake</Button>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
}
