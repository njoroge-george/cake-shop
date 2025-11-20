"use client";

import { useEffect, useRef, useState } from 'react';
import { Box, Drawer, IconButton, Typography, TextField, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface ChatPanelProps { open: boolean; onClose: () => void; }

interface ChatMessage { id: string; text: string; createdAt: string; sender: 'USER' | 'ADMIN'; }

export default function ChatPanel({ open, onClose }: ChatPanelProps) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/chat');
      setMessages(res.data.messages || []);
      setTimeout(scrollToBottom, 0);
    } catch (e) {
      console.error('Failed to load chat messages', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && status === 'authenticated') {
      loadMessages();
      const id = setInterval(loadMessages, 5000);
      return () => clearInterval(id);
    }
  }, [open, status]);

  const send = async () => {
    if (!text.trim()) return;
    try {
      setSending(true);
      const res = await axios.post('/api/chat', { text: text.trim() });
      setMessages((prev) => [...prev, res.data.message]);
      setText('');
      setTimeout(scrollToBottom, 0);
    } catch (e) {
      console.error('Failed to send message', e);
    } finally {
      setSending(false);
    }
  };

  const unauthView = (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Chat with us</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Please log in to start a conversation with our team.
      </Typography>
      <Button variant="contained" href="/login">Login</Button>
    </Box>
  );

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 420 } } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6">Customer Support</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>

      {status !== 'authenticated' ? (
        unauthView
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box ref={listRef} sx={{ px: 2, py: 2, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {messages.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                No messages yet. Say hello!
              </Typography>
            ) : messages.map((m) => (
              <Box key={m.id} sx={{ display: 'flex', justifyContent: m.sender === 'USER' ? 'flex-end' : 'flex-start' }}>
                <Box sx={{ bgcolor: m.sender === 'USER' ? 'primary.main' : 'grey.200', color: m.sender === 'USER' ? 'primary.contrastText' : 'text.primary', px: 2, py: 1, borderRadius: 2, maxWidth: '80%' }}>
                  <Typography variant="body2">{m.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
            <TextField
              fullWidth size="small" placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            />
            <Button variant="contained" endIcon={<SendIcon />} onClick={send} disabled={sending || !text.trim()}>
              Send
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
}
