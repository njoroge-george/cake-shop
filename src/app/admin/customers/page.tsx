"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Chip, CircularProgress } from "@mui/material";
import AdminLayout from "@/components/admin/AdminLayout";
import axios from "axios";

interface Customer { id: string; name: string; email: string; phone?: string; orderCount: number; createdAt: string; }

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/admin/customers');
        setCustomers(res.data.customers || []);
      } catch (e) {
        console.error('Failed to load customers', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Customers Management
        </Typography>
        <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
          {loading ? (
            <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : customers.length === 0 ? (
            <Typography color="text.secondary">No customers found.</Typography>
          ) : (
            customers.map((c) => (
              <Card key={c.id}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{c.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{c.email}</Typography>
                  {c.phone && (
                    <Typography variant="body2" color="text.secondary">{c.phone}</Typography>
                  )}
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <Chip label={`Orders: ${c.orderCount}`} size="small" />
                    <Chip label={new Date(c.createdAt).toLocaleDateString()} size="small" />
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
    </AdminLayout>
  );
}