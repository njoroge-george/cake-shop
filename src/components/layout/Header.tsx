'use client';

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Container,
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Cake as CakeIcon,
  Menu as MenuIcon,
  ChatBubbleOutline,
  LightMode,
  DarkMode,
  Home,
  Info,
  Email,
  Dashboard,
  Favorite,
  ShoppingBag,
  Person,
  Logout,
  AdminPanelSettings,
  AutoAwesome,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useThemeContext } from '@/contexts/ThemeContext';
import { Avatar } from '@mui/material';

const ChatPanel = dynamic(() => import('@/components/ChatPanel'), { ssr: false });

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const itemCount = useCartStore((state) => state.getItemCount());
  const [chatOpen, setChatOpen] = useState(false);
  const { mode, toggleTheme } = useThemeContext();
  useEffect(() => {
    const openChatListener = () => setChatOpen(true);
    if (typeof window !== 'undefined') {
      window.addEventListener('open-chat', openChatListener as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('open-chat', openChatListener as EventListener);
      }
    };
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    handleClose();
  };

  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <AppBar position="sticky" sx={{ bgcolor: "theme.palette.mode", color: 'text.primary' }} elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box
              component={Link}
              href="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'primary.main',
                mr: 4,
              }}
            >
              <CakeIcon sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Cake Shop
              </Typography>
            </Box>
          </motion.div>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button component={Link} href="/" color="inherit" startIcon={<Home />}>
              Home
            </Button>
            <Button component={Link} href="/cakes" color="inherit" startIcon={<CakeIcon />}>
              All Cakes
            </Button>
            <Button component={Link} href="/custom-order" color="inherit" startIcon={<AutoAwesome />}>
              Custom Order
            </Button>
            <Button component={Link} href="/about" color="inherit" startIcon={<Info />}>
              About
            </Button>
            <Button component={Link} href="/contact" color="inherit" startIcon={<Email />}>
              Contact
            </Button>
            {isAdmin && (
              <Button component={Link} href="/admin" color="primary" variant="outlined" startIcon={<AdminPanelSettings />}>
                Admin Panel
              </Button>
            )}
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton onClick={handleMobileMenu} color="inherit">
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Right Side Icons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={toggleTheme} 
              color="primary"
              aria-label="Toggle theme"
            >
              {mode === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
            <IconButton 
              color="primary" 
              onClick={() => setChatOpen(true)} 
              aria-label="Open chat"
            >
              <ChatBubbleOutline />
            </IconButton>
            <IconButton component={Link} href="/cart" color="primary">
              <Badge badgeContent={itemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {session ? (
              <>
                <IconButton onClick={handleMenu} color="primary">
                  {(session.user as any)?.image ? (
                    <Avatar 
                      src={(session.user as any).image} 
                      alt={session.user?.name || 'User'}
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={() => { router.push('/dashboard'); handleClose(); }}>
                    <Dashboard sx={{ mr: 1, color: 'primary.main' }} /> Dashboard
                  </MenuItem>
                  <MenuItem onClick={() => { router.push('/orders'); handleClose(); }}>
                    <ShoppingBag sx={{ mr: 1, color: 'primary.main' }} /> My Orders
                  </MenuItem>
                  <MenuItem onClick={() => { router.push('/favorites'); handleClose(); }}>
                    <Favorite sx={{ mr: 1, color: 'primary.main' }} /> Favorites
                  </MenuItem>
                  <MenuItem onClick={() => { router.push('/profile'); handleClose(); }}>
                    <Person sx={{ mr: 1, color: 'primary.main' }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>
                    <Logout sx={{ mr: 1, color: 'error.main' }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={Link} href="/login" variant="contained" color="primary">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        sx={{ display: { md: 'none' } }}
      >
        <MenuItem onClick={() => { router.push('/'); handleMobileMenuClose(); }}>
          <Home sx={{ mr: 1, color: 'primary.main' }} /> Home
        </MenuItem>
        <MenuItem onClick={() => { router.push('/cakes'); handleMobileMenuClose(); }}>
          <CakeIcon sx={{ mr: 1, color: 'primary.main' }} /> All Cakes
        </MenuItem>
        <MenuItem onClick={() => { router.push('/custom-order'); handleMobileMenuClose(); }}>
          <AutoAwesome sx={{ mr: 1, color: 'primary.main' }} /> Custom Order
        </MenuItem>
        <MenuItem onClick={() => { router.push('/about'); handleMobileMenuClose(); }}>
          <Info sx={{ mr: 1, color: 'primary.main' }} /> About
        </MenuItem>
        <MenuItem onClick={() => { router.push('/contact'); handleMobileMenuClose(); }}>
          <Email sx={{ mr: 1, color: 'primary.main' }} /> Contact
        </MenuItem>
        {isAdmin && (
          <MenuItem onClick={() => { router.push('/admin'); handleMobileMenuClose(); }}>
            <AdminPanelSettings sx={{ mr: 1, color: 'secondary.main' }} /> Admin Panel
          </MenuItem>
        )}
      </Menu>
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </AppBar>
  );
}
