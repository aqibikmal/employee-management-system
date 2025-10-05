import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate, useParams } from 'react-router-dom';
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
    Edit as EditIcon,
    BusinessCenter as BusinessCenterIcon,
} from '@mui/icons-material';
import useApi from '../hooks/useApi';
import useSubmit from '../hooks/useSubmit';

function EditDepartment() {
    const { departmentId } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');

    // 1. use useApi for fetching initial department data
    const {
        data: department,
        loading: isLoadingData,
        error: fetchError,
    } = useApi(() => apiClient.get(`/departments/${departmentId}`));

    // 2. use useSubmit for handling form submission
    const [updateDepartment, { loading: isUpdating, error: updateError }] =
        useSubmit((data) =>
            apiClient.put(`/departments/${departmentId}`, data)
        );

    // 3. useEffect to populate form fields when department data is fetched
    useEffect(() => {
        if (department) {
            setName(department.name);
        }
    }, [department]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDepartment({ name });
            // Navigate with success message including department name
            navigate('/departments', {
                state: {
                    message: `Department "${name}" has been updated successfully!`,
                },
            });
        } catch (err) {
            // error handling is managed in useSubmit
        }
    };

    const handleCancel = () => {
        navigate('/departments');
    };

    // show loading spinner while fetching data
    if (isLoadingData) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                }}
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    const anyError = fetchError || updateError;

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
                        Edit Department
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Update department information below
                    </Typography>
                </Box>

                <Paper elevation={3} sx={{ p: 4 }}>
                    {fetchError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {fetchError}
                        </Alert>
                    )}

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
                                disabled={isUpdating}
                                placeholder="e.g. Human Resources, IT, Finance"
                                helperText="Enter a unique name for the department"
                            />
                        </Box>

                        {updateError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {updateError}
                            </Alert>
                        )}

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isUpdating}
                                startIcon={
                                    isUpdating ? (
                                        <CircularProgress
                                            size={20}
                                            color="inherit"
                                        />
                                    ) : (
                                        <EditIcon />
                                    )
                                }
                            >
                                {isUpdating
                                    ? 'Updating Department...'
                                    : 'Update Department'}
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                                onClick={handleCancel}
                                disabled={isUpdating}
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

export default EditDepartment;
