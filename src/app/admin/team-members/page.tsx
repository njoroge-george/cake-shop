'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Avatar,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Close,
  Save,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminTeamMembersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    order: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session && (session.user as any)?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (status === 'authenticated' && (session.user as any)?.role === 'ADMIN') {
      fetchMembers();
    }
  }, [status, session]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/team-members');
      setMembers(response.data.teamMembers || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        bio: member.bio,
        image: member.image || '',
        order: member.order,
        isActive: member.isActive,
      });
      setImagePreview(member.image || '');
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        bio: '',
        image: '',
        order: members.length,
        isActive: true,
      });
      setImagePreview('');
    }
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMember(null);
    setImageFile(null);
    setImagePreview('');
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

  const handleSave = async () => {
    try {
      setSaving(true);
      
      let imageUrl = formData.image;
      
      // Upload image if a new file was selected
      if (imageFile) {
        const formDataToUpload = new FormData();
        formDataToUpload.append('file', imageFile);
        formDataToUpload.append('type', 'team');
        
        const uploadResponse = await axios.post('/api/upload', formDataToUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        imageUrl = uploadResponse.data.url;
      }
      
      const dataToSave = {
        ...formData,
        image: imageUrl,
      };
      
      if (editingMember) {
        await axios.put(`/api/team-members/${editingMember.id}`, dataToSave);
      } else {
        await axios.post('/api/team-members', dataToSave);
      }
      await fetchMembers();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save team member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      await axios.delete(`/api/team-members/${id}`);
      await fetchMembers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete team member');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </AdminLayout>
    );
  }

  if (status === 'unauthenticated' || (session?.user as any)?.role !== 'ADMIN') {
    return null;
  }

  return (
    <AdminLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Team Members
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your team members displayed on the About page
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Member
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Image</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Bio</strong></TableCell>
                <TableCell><strong>Order</strong></TableCell>
                <TableCell><strong>Active</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">
                      No team members yet. Add your first team member!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id} hover>
                    <TableCell>
                      <Avatar
                        src={member.image || undefined}
                        alt={member.name}
                        sx={{ width: 50, height: 50 }}
                      >
                        {member.name.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {member.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                        {member.bio}
                      </Typography>
                    </TableCell>
                    <TableCell>{member.order}</TableCell>
                    <TableCell>
                      {member.isActive ? '✓' : '✗'}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(member)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </Typography>
              <IconButton onClick={handleCloseDialog} size="small">
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 3, pt: 1 }}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Head Pastry Chef"
                required
                fullWidth
              />
              <TextField
                label="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                multiline
                rows={3}
                required
                fullWidth
              />
              
              {/* Image Upload Section */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Profile Image
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar
                    src={imagePreview || formData.image || undefined}
                    alt={formData.name}
                    sx={{ width: 80, height: 80 }}
                  >
                    {formData.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="team-image-upload"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="team-image-upload">
                      <Button variant="outlined" component="span" fullWidth>
                        Choose Image File
                      </Button>
                    </label>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {imageFile ? imageFile.name : 'JPG, PNG, or WebP (recommended: 400x400px)'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <TextField
                label="Image URL (Optional)"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Or enter image URL"
                fullWidth
                helperText="Use file upload above or enter a URL here"
              />
              
              <TextField
                label="Display Order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                fullWidth
                helperText="Lower numbers appear first"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active (visible on About page)"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || !formData.name || !formData.role || !formData.bio}
              startIcon={saving ? <CircularProgress size={20} /> : <Save />}
            >
              {editingMember ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}
