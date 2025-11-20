"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Chip, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Divider, Table, TableHead, TableRow, TableCell, TableBody, Stack } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AdminLayout from "@/components/admin/AdminLayout";
import axios from "axios";

interface CakeSize { name: string; price: number; serves: number; }
interface CakeItem { id: string; name: string; description: string; sizes: CakeSize[]; basePrice: number; inStock: boolean; isVisible: boolean; }
interface Category { id: string; name: string; slug: string; cakes?: CakeItem[] }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Admin-only endpoint with nested cakes
        const res = await axios.get('/api/admin/categories');
        setCategories(res.data.categories || []);
      } catch (e) {
        console.error('Failed to load categories', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Categories Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          View all cake types (categories). Expand a type to see each cake, how it's made, and size-based pricing to help you manage margins.
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : categories.length === 0 ? (
          <Typography color="text.secondary">No categories found.</Typography>
        ) : (
          <Box>
            {categories.map((category) => (
              <Accordion key={category.id} disableGutters sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{category.name}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={category.slug} size="small" />
                      <Chip label={`${category.cakes?.length ?? 0} cakes`} size="small" color="primary" />
                    </Stack>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  {(!category.cakes || category.cakes.length === 0) ? (
                    <Typography color="text.secondary">No cakes under this type yet.</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {(category.cakes ?? []).map((cake) => (
                        <Card key={cake.id} variant="outlined">
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, gap: 2, flexWrap: 'wrap' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{cake.name}</Typography>
                              <Stack direction="row" spacing={1}>
                                {!cake.inStock && <Chip size="small" label="Out of stock" />}
                                {!cake.isVisible && <Chip size="small" label="Hidden" />}
                                <Chip size="small" color="secondary" label={`Base KSh ${cake.basePrice.toLocaleString()}`} />
                              </Stack>
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {cake.description}
                            </Typography>

                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Sizes & Prices</Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Size</TableCell>
                                  <TableCell align="right">Serves</TableCell>
                                  <TableCell align="right">Price (KSh)</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {(cake.sizes || []).map((s, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{s.name}</TableCell>
                                    <TableCell align="right">{s.serves}</TableCell>
                                    <TableCell align="right">{s.price.toLocaleString()}</TableCell>
                                  </TableRow>
                                ))}
                                {(!cake.sizes || cake.sizes.length === 0) && (
                                  <TableRow>
                                    <TableCell colSpan={3}>
                                      <Typography color="text.secondary">No size pricing configured</Typography>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Box>
    </AdminLayout>
  );
}