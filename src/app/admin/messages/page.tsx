'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import {
  MoreVert,
  Delete,
  MarkEmailRead,
  MarkEmailUnread,
  Search,
  Email,
  Phone,
} from '@mui/icons-material';
import AdminLayout from '@/components/admin/AdminLayout';
import axios from 'axios';
import { format } from 'date-fns';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session && (session.user as any)?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchMessages();
  }, [tabValue]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const isReadParam = tabValue === 0 ? '' : tabValue === 1 ? 'false' : 'true';
      const response = await axios.get('/api/messages', {
        params: { isRead: isReadParam, limit: 100 },
      });
      setMessages(response.data.messages);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, message: Message) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewClick = (message: Message) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);
    handleMenuClose();

    // Mark as read when viewing
    if (!message.isRead) {
      handleToggleRead(message, true);
    }
  };

  const handleToggleRead = async (message: Message, markAsRead?: boolean) => {
    try {
      const newReadStatus = markAsRead !== undefined ? markAsRead : !message.isRead;
      
      await axios.patch(`/api/messages/${message.id}`, {
        isRead: newReadStatus,
      });

      // Update local state
      setMessages(messages.map(m =>
        m.id === message.id ? { ...m, isRead: newReadStatus } : m
      ));

      setUnreadCount(prev => newReadStatus ? prev - 1 : prev + 1);
      
      if (selectedMessage?.id === message.id) {
        setSelectedMessage({ ...message, isRead: newReadStatus });
      }

      handleMenuClose();
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Failed to update message');
    }
  };

  const handleDeleteClick = (message: Message) => {
    setSelectedMessage(message);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleReplyClick = (message: Message) => {
    setSelectedMessage(message);
    setReplyText(message.reply || '');
    setReplyDialogOpen(true);
    handleMenuClose();
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }

    try {
      setSendingReply(true);
      const response = await axios.post(`/api/messages/${selectedMessage.id}/reply`, {
        reply: replyText,
      });

      if (response.data.success) {
        // Update local state
        setMessages(messages.map(m =>
          m.id === selectedMessage.id
            ? { ...m, reply: replyText, repliedAt: new Date().toISOString(), isRead: true }
            : m
        ));

        setReplyDialogOpen(false);
        setReplyText('');
        alert('Reply sent successfully!');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMessage) return;

    try {
      await axios.delete(`/api/messages/${selectedMessage.id}`);
      setMessages(messages.filter(m => m.id !== selectedMessage.id));
      setDeleteDialogOpen(false);
      setSelectedMessage(null);
      
      if (!selectedMessage.isRead) {
        setUnreadCount(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter(
    message =>
      message.name.toLowerCase().includes(search.toLowerCase()) ||
      message.email.toLowerCase().includes(search.toLowerCase()) ||
      message.subject.toLowerCase().includes(search.toLowerCase()) ||
      message.message.toLowerCase().includes(search.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Messages
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage customer messages
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label={`All Messages (${messages.length})`} />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Unread
                  {unreadCount > 0 && (
                    <Chip label={unreadCount} size="small" color="error" />
                  )}
                </Box>
              }
            />
            <Tab label="Read" />
          </Tabs>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />

        {/* Messages Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              sx={{
                position: 'relative',
                bgcolor: message.isRead ? 'background.paper' : 'action.hover',
                border: message.isRead ? 'none' : '2px solid',
                borderColor: 'primary.main',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => handleViewClick(message)}
            >
              {/* Unread Badge */}
              {!message.isRead && (
                <Chip
                  label="New"
                  size="small"
                  color="primary"
                  sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
                />
              )}

              {/* Menu Button */}
              <IconButton
                sx={{ position: 'absolute', top: 5, right: 5, zIndex: 2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(e, message);
                }}
              >
                <MoreVert />
              </IconButton>

              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, pr: 4 }}>
                  {message.subject}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {message.name}
                  </Typography>
                  {message.user && (
                    <Chip label="Customer" size="small" sx={{ ml: 1 }} />
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {message.email}
                  </Typography>
                </Box>

                {message.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                    <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {message.phone}
                    </Typography>
                  </Box>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {message.message.substring(0, 100)}
                  {message.message.length > 100 ? '...' : ''}
                </Typography>

                {message.reply && (
                  <Chip
                    label="Replied"
                    size="small"
                    color="success"
                    sx={{ mb: 1 }}
                  />
                )}

                <Typography variant="caption" color="text.secondary">
                  {format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm')}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Empty State */}
        {filteredMessages.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No messages found
            </Typography>
          </Box>
        )}

        {/* Action Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleReplyClick(selectedMessage!)}>
            <Email sx={{ mr: 1 }} />
            {selectedMessage?.reply ? 'Edit Reply' : 'Reply to Customer'}
          </MenuItem>
          <MenuItem onClick={() => handleToggleRead(selectedMessage!)}>
            {selectedMessage?.isRead ? (
              <>
                <MarkEmailUnread sx={{ mr: 1 }} />
                Mark as Unread
              </>
            ) : (
              <>
                <MarkEmailRead sx={{ mr: 1 }} />
                Mark as Read
              </>
            )}
          </MenuItem>
          <MenuItem onClick={() => handleDeleteClick(selectedMessage!)}>
            <Delete sx={{ mr: 1 }} color="error" />
            <Typography color="error">Delete</Typography>
          </MenuItem>
        </Menu>

        {/* View Message Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {selectedMessage?.subject}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedMessage && format(new Date(selectedMessage.createdAt), 'MMMM dd, yyyy HH:mm')}
                </Typography>
              </Box>
              <Chip
                label={selectedMessage?.isRead ? 'Read' : 'Unread'}
                size="small"
                color={selectedMessage?.isRead ? 'default' : 'primary'}
              />
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                From
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {selectedMessage?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Email sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                {selectedMessage?.email}
              </Typography>
              {selectedMessage?.phone && (
                <Typography variant="body2" color="text.secondary">
                  <Phone sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                  {selectedMessage.phone}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Message
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedMessage?.message}
              </Typography>
            </Box>

            {selectedMessage?.reply && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary.main" gutterBottom>
                  Your Reply ({selectedMessage.repliedAt && format(new Date(selectedMessage.repliedAt), 'MMM dd, yyyy HH:mm')})
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary' }}>
                  {selectedMessage.reply}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleReplyClick(selectedMessage!)}
              variant="contained"
              startIcon={<Email />}
            >
              {selectedMessage?.reply ? 'Edit Reply' : 'Reply In-App'}
            </Button>
            <Button
              href={`mailto:${selectedMessage?.email}?subject=Re: ${selectedMessage?.subject}`}
              variant="outlined"
            >
              Reply via Email Client
            </Button>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog
          open={replyDialogOpen}
          onClose={() => !sendingReply && setReplyDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedMessage?.reply ? 'Edit Reply' : 'Reply to Customer'}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Customer Message:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {selectedMessage?.name} ({selectedMessage?.email})
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Subject:</strong> {selectedMessage?.subject}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                {selectedMessage?.message}
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 2 }}>
              This reply will be sent via email to the customer and saved in the system.
            </Alert>

            <TextField
              fullWidth
              label="Your Reply"
              multiline
              rows={8}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              disabled={sendingReply}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplyDialogOpen(false)} disabled={sendingReply}>
              Cancel
            </Button>
            <Button
              onClick={handleSendReply}
              variant="contained"
              disabled={sendingReply || !replyText.trim()}
              startIcon={<Email />}
            >
              {sendingReply ? 'Sending...' : 'Send Reply'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Delete Message?</DialogTitle>
          <DialogContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              This action cannot be undone. The message will be permanently deleted.
            </Alert>
            <Typography variant="body1">
              Are you sure you want to delete this message from <strong>{selectedMessage?.name}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}