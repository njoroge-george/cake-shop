"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Drawer, IconButton, Typography, TextField, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface ChatPanelProps { open: boolean; onClose: () => void; }

interface ChatMessage { id: string; text: string; createdAt: string; sender: 'USER' | 'ADMIN'; optimistic?: boolean; }

export default function ChatPanel({ open, onClose }: ChatPanelProps) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  // Error UI removed per user request; we only log to console on failures.
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const atBottomRef = useRef(true);
  const sendingRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    if (listRef.current && atBottomRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, []);

  const handleScroll = () => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    atBottomRef.current = scrollTop + clientHeight >= scrollHeight - 40;
  };

  const loadMessages = useCallback(async () => {
    // Avoid refetch spam while sending to prevent flicker
    if (sendingRef.current) return;
    try {
      const res = await axios.get('/api/chat');
      const incoming: ChatMessage[] = res.data.messages || [];
      // Only update if length changed or newest id differs to reduce re-renders
      if (incoming.length !== messages.length || (incoming[incoming.length - 1]?.id !== messages[messages.length - 1]?.id)) {
        // Preserve optimistic messages not yet confirmed
        const optimistic = messages.filter(m => m.optimistic && !incoming.some(im => im.id === m.id));
        const merged = [...incoming, ...optimistic];
        setMessages(merged);
        setTimeout(scrollToBottom, 0);
      }
    } catch (e) {
      console.error('Failed to load chat messages', e);
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open && status === 'authenticated') {
      setLoading(true);
      loadMessages().finally(() => setLoading(false));
      pollingRef.current = setInterval(loadMessages, 7000);
      return () => {
        if (pollingRef.current) clearInterval(pollingRef.current);
        pollingRef.current = null;
      };
    }
  }, [open, status, loadMessages]);

  const send = async () => {
    const value = text.trim();
    if (!value || sendingRef.current) return;
    // Optimistic append
    const optimisticMessage: ChatMessage = {
      id: `optimistic-${Date.now()}`,
      text: value,
      createdAt: new Date().toISOString(),
      sender: 'USER',
      optimistic: true,
    };
    setMessages(prev => [...prev, optimisticMessage]);
    setText('');
    sendingRef.current = true;
    setSending(true);
    scrollToBottom();
    try {
      const isAdmin = (session?.user as any)?.role === 'ADMIN';
      const selfId = (session?.user as any)?.id;
      const payload: any = { text: value };
      // Provide fallback userId for admin so server doesn't reject with 400
      if (isAdmin && selfId) payload.userId = selfId;
      const res = await axios.post('/api/chat', payload);
      const saved = res.data.message as ChatMessage;
      // Replace optimistic message
      setMessages(prev => prev.map(m => m.id === optimisticMessage.id ? saved : m));
      scrollToBottom();
    } catch (e) {
      console.error('Failed to send message', e);
      // Remove failed optimistic bubble & restore original text for user convenience
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      setText(value);
    } finally {
      sendingRef.current = false;
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
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6">Customer Support</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        {status !== 'authenticated' ? (
          unauthView
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              ref={listRef}
              onScroll={handleScroll}
              sx={{ px: 2, py: 2, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
            >
              {messages.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  No messages yet. Say hello!
                </Typography>
              ) : messages.map((m) => (
                <Box key={m.id} sx={{ display: 'flex', justifyContent: m.sender === 'USER' ? 'flex-end' : 'flex-start' }}>
                  <Box
                    sx={{
                      bgcolor: m.sender === 'USER' ? 'primary.main' : 'gray.200',
                      color: m.sender === 'USER' ? 'primary.contrastText' : 'text.primary',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      maxWidth: '80%',
                      opacity: m.optimistic ? 0.7 : 1,
                    }}
                  >
                    <Typography variant="body2">{m.text}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
              <TextField
                inputRef={inputRef}
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={send}
                disabled={sending || !text.trim()}
              >
                {sending ? 'Sending' : 'Send'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
