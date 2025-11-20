//admin settings page
"use client";
import { Box, Typography, TextField, Button, Paper, Alert } from "@mui/material";
import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminSettingsPage() {
  const [number, setNumber] = useState("");
  const [defaultAccount, setDefaultAccount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/admin/settings/paybill');
        setNumber(res.data.number || "");
        setDefaultAccount(res.data.defaultAccount || "");
        setNote(res.data.note || "");
      } catch (e: any) {
        setError(e.response?.data?.error || 'Failed to load settings');
      }
    })();
  }, []);

  const save = async () => {
    try {
      setSaving(true);
      setError("");
      setSaved(false);
      await axios.put('/api/admin/settings/paybill', { number, defaultAccount, note });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Paper sx={{ p: 3, maxWidth: 640 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Paybill Settings</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {saved && <Alert severity="success" sx={{ mb: 2 }}>Saved</Alert>}
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Paybill Number" value={number} onChange={(e) => setNumber(e.target.value)} fullWidth />
            <TextField label="Default Account Number" value={defaultAccount} onChange={(e) => setDefaultAccount(e.target.value)} fullWidth />
            <TextField label="Note (shown at checkout)" value={note} onChange={(e) => setNote(e.target.value)} fullWidth multiline minRows={2} />
            <Box>
              <Button variant="contained" onClick={save} disabled={saving}>Save</Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </AdminLayout>
  );
}