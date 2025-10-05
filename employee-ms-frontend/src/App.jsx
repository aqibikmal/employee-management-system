import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    Divider,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Business as BusinessIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import Login from './components/Login';

function App() {
    const [token, setToken] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleLoginSuccess = (newToken) => {
        setToken(newToken);
        localStorage.setItem('authToken', newToken);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Employees', icon: <PeopleIcon />, path: '/employees' },
        { text: 'Departments', icon: <BusinessIcon />, path: '/departments' },
    ];

    // Drawer for mobile view
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography
                variant="h6"
                sx={{ my: 2, fontWeight: 'bold', color: 'primary.main' }}
            >
                EMS
            </Typography>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.light',
                                    '&:hover': {
                                        backgroundColor: 'primary.light',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color:
                                        location.pathname === item.path
                                            ? 'primary.main'
                                            : 'inherit',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <Divider sx={{ my: 1 }} />
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    // if no token, show login
    if (!token) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    // if have token, show app
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <AppBar position="sticky" elevation={2}>
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, fontWeight: 'bold' }}
                    >
                        Employee Management System
                    </Typography>

                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {menuItems.map((item) => (
                                <Button
                                    key={item.text}
                                    color="inherit"
                                    component={Link}
                                    to={item.path}
                                    startIcon={item.icon}
                                    sx={{
                                        backgroundColor:
                                            location.pathname === item.path
                                                ? 'rgba(255,255,255,0.2)'
                                                : 'transparent',
                                        '&:hover': {
                                            backgroundColor:
                                                'rgba(255,255,255,0.3)',
                                        },
                                    }}
                                >
                                    {item.text}
                                </Button>
                            ))}
                            <Divider
                                orientation="vertical"
                                flexItem
                                sx={{
                                    mx: 1,
                                    borderColor: 'rgba(255,255,255,0.3)',
                                }}
                            />
                            <Button
                                color="inherit"
                                onClick={handleLogout}
                                startIcon={<LogoutIcon />}
                                sx={{
                                    '&:hover': {
                                        backgroundColor:
                                            'rgba(255,255,255,0.2)',
                                    },
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 240,
                    },
                }}
            >
                {drawer}
            </Drawer>

            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', py: 3 }}
            >
                <Container maxWidth="xl">
                    <Outlet />
                </Container>
            </Box>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 2,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: 'background.paper',
                    borderTop: 1,
                    borderColor: 'divider',
                    textAlign: 'center',
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} Employee Management System.
                    All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}

export default App;
