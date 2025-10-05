import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Paper,
    Divider,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    BusinessCenter as BusinessCenterIcon,
} from '@mui/icons-material';
import useSubmit from '../hooks/useSubmit';

function AddDepartment() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    // useSubmit hook to handle form submission
    // It returns a function to submit data and an object with loading and error states
    const [submitData, { loading, error }] = useSubmit((data) =>
        apiClient.post('/departments', data)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await submitData({ name });
            // Navigate with success message including department name
            navigate('/departments', {
                state: {
                    message: `Department "${name}" has been added successfully!`,
                },
            });
        } catch (err) {
            // error state is handled by useSubmit hook
        }
    };

    const handleCancel = () => {
        navigate('/departments');
    };

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ marginTop: 4, marginBottom: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={handleCancel}
                        sx={{ mb: 2 }}
                    >
                        Back to Department List
                    </Button>
                    <Typography
                        component="h1"
                        variant="h4"
                        fontWeight="bold"
                        color="primary"
                    >
                        Add New Department
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Create a new department for your organization
                    </Typography>
                </Box>

                <Paper elevation={3} sx={{ p: 4 }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        {/* Department Information Section */}
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                color="primary"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <BusinessCenterIcon /> Department Information
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Department Name"
                                name="name"
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                placeholder="e.g. Human Resources, IT, Finance"
                                helperText="Enter a unique name for the department"
                            />
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loading}
                                startIcon={
                                    loading ? (
                                        <CircularProgress
                                            size={20}
                                            color="inherit"
                                        />
                                    ) : (
                                        <BusinessCenterIcon />
                                    )
                                }
                            >
                                {loading
                                    ? 'Adding Department...'
                                    : 'Add Department'}
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default AddDepartment;
