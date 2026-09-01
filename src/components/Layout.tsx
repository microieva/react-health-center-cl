import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
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
import { PageFooter } from './PageFooter';

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
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isDashboard, setIsDashboard] =  useState<boolean>(true);
  
  const { currentUser } = useAuth();
  const location = useLocation();
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
      { text: 'Dashboard', icon: <PeopleIcon />, path: '/dashboard' },
      { text: 'My Account', icon: <PeopleIcon />, path: '/account' },
    ];

    const roleSpecificItems: Record<string, NavItem[]> = {
      admin: [  
        { text: 'Patients', icon: <SettingsIcon />, path: '/admin/patients', roles: ['admin'] },
        { text: 'Doctors', icon: <SettingsIcon />, path: '/admin/doctors', roles: ['admin'] },
        { text: 'Messages', icon: <SettingsIcon />, path: '/admin/chat', roles: ['admin'] },
        { text: 'Feedback', icon: <SettingsIcon />, path: '/admin/feedback', roles: ['admin'] },
      ],
      doctor: [
        { text: 'Appointments', icon: <CalendarIcon />, path: '/doctor/appointments', roles: ['doctor'] },
        { text: 'Medical Records', icon: <PeopleIcon />, path: '/doctor/records ', roles: ['doctor'] },
        { text: 'Messages', icon: <SettingsIcon />, path: '/doctor/chat', roles: ['doctor'] },
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

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column',  overflow: 'hidden', }}>

      {/* Navigation */}
      <List sx={{ flex: 1, p:0 }}>
        {navItems.map((item, index) => (
          <>
            <ListItem key={item.text + index} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'var(--color-primary-slate-gray)',
                    color: 'var(--color-primary-white)',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-slate-gray)',
                    color: 'var(--color-primary-white)',
                  },
                }}
                selected={item.path.endsWith(location.pathname) || location.pathname.endsWith(item.path)}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
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
              //top: '4rem',
              //height: `calc(100vh - 4rem)`,
              position: 'fixed', 
              overflow: 'hidden',
              marginTop: '3.6rem'
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
          //p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          height: '100vh',
          overflowY: 'auto', 
          backgroundColor: theme.palette.background.default,
          mt: `3rem`,
          // Hide scrollbar (optional)
          // '&::-webkit-scrollbar': { width: '8px' },
          // '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '4px' },
        }}
      >
        <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#f1f5f9' }}>
          <Outlet />
        </div>
      </Box>
    </Box>
  );
};

export default Layout;