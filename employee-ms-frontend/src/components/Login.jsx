import React, { useState } from 'react';
import apiClient from '../api/apiClient'; //Using centralized API client
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    Avatar,
    InputAdornment,
    IconButton,
    Divider,
    useTheme,
    alpha,
} from '@mui/material';
import {
    LockOutlined as LockIcon,
    Visibility,
    VisibilityOff,
    Email as EmailIcon,
    Login as LoginIcon,
    Business as BusinessIcon,
} from '@mui/icons-material';

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const theme = useTheme();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // --- CHANGED: Using apiClient with relative path ---
            const response = await apiClient.post('/login', {
                email: email,
                password: password,
            });
            onLoginSuccess(response.data.token);
        } catch (err) {
            console.error('Login Error:', err);
            if (err.response && err.response.status === 422) {
                setError('Invalid credentials. Please try again.');
            } else {
                setError('Failed to login. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                py: 4,
            }}
        >
            <Container component="main" maxWidth="sm">
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Decorative background element */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                            zIndex: 0,
                        }}
                    />

                    {/* Content */}
                    <Box
                        sx={{
                            position: 'relative',
                            zIndex: 1,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {/* Logo/Icon */}
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                bgcolor: 'primary.main',
                                boxShadow: 3,
                                mb: 2,
                            }}
                        >
                            <BusinessIcon sx={{ fontSize: 48 }} />
                        </Avatar>

                        {/* Title */}
                        <Typography
                            component="h1"
                            variant="h4"
                            fontWeight="bold"
                            color="primary"
                            gutterBottom
                        >
                            Welcome Back
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            Sign in to access the Employee Management System
                        </Typography>

                        <Divider sx={{ mb: 3, width: '100%' }} />

                        {/* Login Form */}
                        <Box
                            component="form"
                            onSubmit={handleLogin}
                            sx={{ width: '100%' }}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleTogglePassword}
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{ mt: 2 }}
                                    onClose={() => setError('')}
                                >
                                    {error}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={loading ? null : <LoginIcon />}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    fontWeight: 'bold',
                                }}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>

                            {/* Demo Credentials */}
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    bgcolor: alpha(
                                        theme.palette.info.light,
                                        0.1
                                    ),
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    color="text.secondary"
                                >
                                    Demo Credentials:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Email: admin@example.com
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Password: password
                                </Typography>
                            </Paper>
                        </Box>
                    </Box>

                    {/* Footer */}
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            © {new Date().getFullYear()} Employee Management
                            System
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default Login;
