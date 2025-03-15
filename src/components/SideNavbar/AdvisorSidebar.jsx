import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, CssBaseline, Toolbar, Typography, Divider, Stack } from '@mui/material'; // Grouped common MUI components

import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Grouping Material-UI Icons
import KeyboardDoubleArrowLeftTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowLeftTwoTone';
import KeyboardDoubleArrowRightTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowRightTwoTone';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ListIcon from '@mui/icons-material/List';

// Importing images and routing
import icon from '../../Assets/images/icon.webp';
import { Link, useNavigate } from 'react-router-dom';
import Kisaanstar from '../../Assets/images/Kisaanstarlogo1.webp';
import axios from 'axios';

const drawerWidth = 240;

// Drawer animations
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// Styled components
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#6C584C', // Dark Brown for the AppBar
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    backgroundColor: '#DDE5B6', // Light Green for Sidebar
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': {
        backgroundColor: '#DDE5B6', // Light Green for Sidebar
        ...openedMixin(theme),
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        backgroundColor: '#DDE5B6', // Light Green for Sidebar
        ...closedMixin(theme),
      },
    }),
  })
);

export default function Sidebar({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const [message, setMessage] = React.useState("");

  const clearCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/advisory/logout`,
        {},
        { withCredentials: true }
      );
      clearCookie("AdvisoryToken"); 
      navigate("/"); 
    } catch (error) {
      setMessage("Logout failed. Please try again.");
    }
  };

  if (message) {
    return <Typography color="error">{message}</Typography>;
  }

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Using the same menu items for consistency
  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon sx={{ color: '#6C584C' }} />, link: '/advisory-dashboard' },
    { text: 'Search CX', icon: <SearchIcon sx={{ color: '#6C584C' }} />, link: '/advisory-dashboard/search-customer' },
    { text: 'Product List', icon: <ListIcon sx={{ color: '#6C584C' }} />, link: '/advisory-dashboard/product-list' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#F0EAD2' }}>
            <img src={Kisaanstar} alt="Logo" width={150} height={60} style={{ marginRight: 10, borderRadius: 30 }} />
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon sx={{ color: '#F0EAD2' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1 }}>
            {open && (
              <>
                <img src={icon} width={120} height={120} alt="icon" />
                <Typography variant="h6" align="center" sx={{ marginTop: 1, fontWeight: 'bold', color: '#6C584C', fontFamily: 'Exo' }}>
                  Advisor
                </Typography>
              </>
            )}
          </Box>
        </DrawerHeader>
        <Divider sx={{ backgroundColor: '#ADC178' }} />
        <List>
          {menuItems.map((item) => (
            <Tooltip title={item.text} arrow placement="right" key={item.text}>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  component={Link}
                  to={item.link}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    color: item.link === window.location.pathname ? '#F0EAD2' : '#6C584C', // Active state color
                    backgroundColor: item.link === window.location.pathname ? '#A98467' : 'transparent', // Active background
                    borderTopRightRadius: item.link === window.location.pathname ? '50px' : '0',
                    borderBottomRightRadius: item.link === window.location.pathname ? '50px' : '0',
                    '&:hover': {
                      backgroundColor: '#A98467', // Hover color
                      color: '#F0EAD2',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: item.link === window.location.pathname ? '#F0EAD2' : '#6C584C',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0, color: item.link === window.location.pathname ? '#F0EAD2' : '#6C584C', fontFamily: 'Exo' }} />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: '#F0EAD2', // Icon color
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
          }}
        >
          <Tooltip title={open ? "Collapse Navbar" : "Open Navbar"} arrow>
            {open ? (
              <KeyboardDoubleArrowLeftTwoToneIcon sx={{ color: '#000' }} />
            ) : (
              <KeyboardDoubleArrowRightTwoToneIcon sx={{ color: '#000' }} />
            )}
          </Tooltip>
        </IconButton>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#F7F7F7', p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}