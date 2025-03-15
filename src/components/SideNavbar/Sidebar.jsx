import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, CssBaseline, Toolbar, Typography, Divider, IconButton, Tooltip, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'; // Grouped common MUI components
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';

// Grouping Material-UI Icons
import KeyboardDoubleArrowLeftTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowLeftTwoTone';
import KeyboardDoubleArrowRightTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowRightTwoTone';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListAltIcon from '@mui/icons-material/ListAlt'; // For Registered Advisories
import NoteAddIcon from '@mui/icons-material/NoteAdd'; // For Add Advisory
import InventoryIcon from '@mui/icons-material/Inventory'; // For Product List
import ReorderIcon from '@mui/icons-material/Reorder'; // For All Advisory Orders
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For Confirm Orders

// Importing images and routing
import { Link, useNavigate } from 'react-router-dom';
import icon from '../../Assets/images/icon.webp';
import Kisaanstar from '../../Assets/images/Kisaanstarlogo1.webp';
import axios from 'axios';

// Transition Group
import { CSSTransition } from 'react-transition-group'; // Importing CSSTransition

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
  const [message, setMessage] = React.useState("");
  const navigate = useNavigate();
  const [inProp, setInProp] = React.useState(true); // State for transition

  const handleLogout = async () => {
    const clearCookie = (name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/operational-admin/logout`,
        {},
        { withCredentials: true }
      );
      clearCookie("operationalAdminToken");
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

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon sx={{ color: '#6C584C' }} />, link: '/operational-admin-dashboard' },
    { text: 'Add Product', icon: <AddCircleIcon sx={{ color: '#6C584C' }} />, link: '/operational-admin-dashboard/add-product' },
    { text: 'Registered Advisories', icon: <ListAltIcon sx={{ color: '#6C584C' }} />, link: '/operational-admin-dashboard/list-advisory' },
    { text: 'Add Advisory', icon: <NoteAddIcon sx={{ color: '#6C584C' }} />, link: '/operational-admin-dashboard/add-advisory' },
    { text: 'Product List', icon: <InventoryIcon sx={{ color: '#6C584C' }} />, link: '/operational-admin-dashboard/list-product' },
    { text: 'All Advisory Orders', icon: <ReorderIcon sx={{ color: '#6C584C' }} />, link: '/operational-admin-dashboard/list-orders' },
    { text: 'Confirm Orders', icon: <CheckCircleIcon sx={{ color: '#6C584C' }} />, link: '/operational-admin-dashboard/show-confirm-orders' },
    // { text: 'Register Operations', icon: <CheckCircleIcon sx={{ color: '#6C584C' }} />, link: '/OperationalAdminRegister' },

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
                  Operations Admin
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
                  onClick={() => {
                    setInProp(false); // Trigger exit animation
                    setTimeout(() => {
                      setInProp(true); // Trigger enter animation
                    }, 300); // Match duration of exit animation
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
        <CSSTransition
          in={inProp}
          timeout={300}
          classNames="fade" // Adding this class for animation
          unmountOnExit
        >
          <div>
            {children}
          </div>
        </CSSTransition>
      </Box>
    </Box>
  );
}