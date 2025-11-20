"use client";
import { useEffect, useState } from "react";
import { Box, Card, Typography, Chip, CircularProgress, TextField, MenuItem, Button, Paper, Alert } from "@mui/material";
import AdminLayout from "@/components/admin/AdminLayout";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface PromoCode {
  id: string;
  code: string;
  description?: string;
  discount: number;
  type: 'PERCENTAGE' | 'FIXED';
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  season?: string;
  reference?: string;
}

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    code: '', description: '', type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED', discount: 10,
    minOrder: '', maxDiscount: '', validFrom: '', validUntil: '', usageLimit: '', isActive: true,
    season: '', reference: ''
  });
  const datesInvalid = Boolean(form.validFrom && form.validUntil && dayjs(form.validUntil).isBefore(dayjs(form.validFrom)));

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/admin/promo-codes');
        setPromoCodes(res.data.promoCodes || []);
      } catch (e) {
        console.error('Failed to load promo codes', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refresh = async () => {
    const res = await axios.get('/api/admin/promo-codes');
    setPromoCodes(res.data.promoCodes || []);
  };

  const createCode = async () => {
    try {
      setCreating(true);
      const payload = {
        ...form,
        discount: Number(form.discount),
        minOrder: form.minOrder ? Number(form.minOrder) : undefined,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      };
      await axios.post('/api/admin/promo-codes', payload);
      setForm({ code: '', description: '', type: 'PERCENTAGE', discount: 10, minOrder: '', maxDiscount: '', validFrom: '', validUntil: '', usageLimit: '', isActive: true, season: '', reference: '' });
      await refresh();
    } catch (e) {
      console.error('Failed to create promo code', e);
      alert('Failed to create promo code');
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Promo Codes Management
        </Typography>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Create New Code</Typography>
          {/* Row 1: Code / Type / Discount */}
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, mb: 2 }}>
            <TextField label="Code" value={form.code} onChange={e=>setForm({...form, code:e.target.value.toUpperCase()})} fullWidth required />
            <TextField select label="Type" value={form.type} onChange={e=>setForm({...form, type: e.target.value as any})} fullWidth>
              <MenuItem value="PERCENTAGE">Percentage (%)</MenuItem>
              <MenuItem value="FIXED">Fixed (KSh)</MenuItem>
            </TextField>
            <TextField label={form.type==='PERCENTAGE'? 'Discount %':'Discount KSh'} type="number" value={form.discount} onChange={e=>setForm({...form, discount: Number(e.target.value)})} fullWidth />
          </Box>

          {/* Row 2: Min/Max/Usage */}
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, mb: 2 }}>
            <TextField label="Min Order (KSh)" type="number" value={form.minOrder} onChange={e=>setForm({...form, minOrder: e.target.value})} fullWidth />
            <TextField label="Max Discount (KSh)" type="number" value={form.maxDiscount} onChange={e=>setForm({...form, maxDiscount: e.target.value})} fullWidth />
            <TextField label="Usage Limit" type="number" value={form.usageLimit} onChange={e=>setForm({...form, usageLimit: e.target.value})} fullWidth />
          </Box>

          {/* Row 3: Dates side-by-side using pickers */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, mb: 2 }}>
              <DateTimePicker
                label="Valid From"
                value={form.validFrom ? dayjs(form.validFrom) : null}
                onChange={(v: Dayjs | null) => setForm({ ...form, validFrom: v ? v.toISOString() : '' })}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <DateTimePicker
                label="Valid Until"
                value={form.validUntil ? dayjs(form.validUntil) : null}
                onChange={(v: Dayjs | null) => setForm({ ...form, validUntil: v ? v.toISOString() : '' })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
          </LocalizationProvider>

          {/* Row 4: Season / Reference */}
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, mb: 2 }}>
            <TextField label="Season" value={form.season} onChange={e=>setForm({...form, season: e.target.value})} fullWidth placeholder="e.g. Black Friday, Christmas" />
            <TextField label="Reference" value={form.reference} onChange={e=>setForm({...form, reference: e.target.value})} fullWidth placeholder="Campaign or internal ref" />
          </Box>

          {/* Row 5: Description */}
          <Box sx={{ mb: 2 }}>
            <TextField label="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} fullWidth />
          </Box>
          {datesInvalid && (
            <Alert severity="warning" sx={{ mb: 2 }}>Valid Until must be after Valid From.</Alert>
          )}
          <Button variant="contained" onClick={createCode} disabled={creating || !form.code || !form.validFrom || !form.validUntil || datesInvalid}>Create Code</Button>
        </Paper>
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : promoCodes.length === 0 ? (
            <Typography color="text.secondary">No promo codes found.</Typography>
          ) : (
            promoCodes.map((promo) => (
              <Card key={promo.id} sx={{ mb: 2, p: 2 }}>
                <Typography variant="h6">{promo.code}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {promo.description || 'No description'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  <Chip label={`${promo.type === 'PERCENTAGE' ? promo.discount + '%' : 'KSh ' + promo.discount}`} size="small" />
                  <Chip label={promo.isActive ? 'Active' : 'Inactive'} color={promo.isActive ? 'success' : 'default'} size="small" />
                  <Chip label={`Valid: ${new Date(promo.validFrom).toLocaleDateString()} - ${new Date(promo.validUntil).toLocaleDateString()}`} size="small" />
                  {promo.season && <Chip label={`Season: ${promo.season}`} size="small" />}
                  {promo.reference && <Chip label={`Ref: ${promo.reference}`} size="small" />}
                </Box>
              </Card>
            ))
          )}
        </Box>
      </Box>
    </AdminLayout>
  );
}