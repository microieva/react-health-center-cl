import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  CssBaseline,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  //ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useAuth } from '../utils/AuthProvider';
import { useLogout } from '../hooks/useLogout';
import { Header } from './Header';
import { useLogin } from '../hooks/useLogin';

const drawerWidth = 280;

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[];
}

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const { currentUser } = useAuth();
  //const { logout, isLoading } = useLogout();
  const {loading} = useLogin();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    //await logout('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    //theme toggle ?
  };


  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    ];

    const roleSpecificItems: Record<string, NavItem[]> = {
      admin: [
        { text: 'Users', icon: <PeopleIcon />, path: '/admin/users', roles: ['admin'] },
        { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings', roles: ['admin'] },
      ],
      doctor: [
        { text: 'Patients', icon: <PeopleIcon />, path: '/doctor/patients', roles: ['doctor'] },
        { text: 'Appointments', icon: <CalendarIcon />, path: '/doctor/appointments', roles: ['doctor'] },
      ],
      patient: [
        { text: 'Appointments', icon: <CalendarIcon />, path: '/patient/appointments', roles: ['patient'] },
        { text: 'Medical Records', icon: <MedicalIcon />, path: '/patient/records', roles: ['patient'] },
      ],
    };

    const role = currentUser?.userRole || 'patient';
    const roleItems = roleSpecificItems[role] || [];
    
    return [...baseItems, ...roleItems];
  };

  const navItems = getNavItems();

  // Drawer content
  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column',  overflow: 'hidden', }}>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 2, py: 1 }}>
        {navItems.map((item, index) => (
          <ListItem key={item.text+index} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                },
              }}
              selected={location.pathname === item.path}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Footer Actions */}
      {/* <Box sx={{ p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={toggleTheme}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </ListItemIcon>
            <ListItemText primary={isDarkMode ? 'Light Mode' : 'Dark Mode'} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            disabled={isLoading}
            sx={{ 
              borderRadius: 2,
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={isLoading ? 'Logging out...' : 'Logout'} />
          </ListItemButton>
        </ListItem>
      </Box> */}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex',  height: '100vh' }}>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header />
      <CssBaseline />
      <Box
        component="nav"
         sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              top: '4rem',
              height: `calc(100vh - 4rem)`,
              position: 'fixed', 
              overflow: 'hidden', 
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
       <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          height: '100vh',
          overflowY: 'auto', 
          backgroundColor: theme.palette.background.default,
          mt: `4rem`,
          // Hide scrollbar (optional)
          // '&::-webkit-scrollbar': { width: '8px' },
          // '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '4px' },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;