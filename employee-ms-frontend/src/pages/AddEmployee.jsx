import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import useSubmit from '../hooks/useSubmit';

// import MUI components
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    CircularProgress,
    Paper,
    Divider,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    PersonAdd as PersonAddIcon,
} from '@mui/icons-material';

function AddEmployee() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        salary: '',
        department_id: '',
    });

    // 1. use useApi for fetching departments
    const {
        data: departments,
        loading: isLoadingDepts,
        error: fetchDeptsError,
    } = useApi(() => apiClient.get('/departments'));

    // 2. use useSubmit for submitting the form
    // The useSubmit hook returns a function to call for submission,
    // along with loading and error states
    const [addEmployee, { loading: isSubmitting, error: submitError }] =
        useSubmit((data) => apiClient.post('/employees', data));

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addEmployee(formData);
            // Navigate with success message
            navigate('/employees', {
                state: {
                    message: `Employee "${formData.name}" has been added successfully!`,
                },
            });
        } catch (err) {
            // error state is handled by useSubmit
        }
    };

    const handleCancel = () => {
        navigate('/employees');
    };

    // show loading spinner while fetching departments
    if (isLoadingDepts) {
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
                        Back to Employee List
                    </Button>
                    <Typography
                        component="h1"
                        variant="h4"
                        fontWeight="bold"
                        color="primary"
                    >
                        Add New Employee
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Fill in the details below to add a new employee to the
                        system
                    </Typography>
                </Box>

                <Paper elevation={3} sx={{ p: 4 }}>
                    {fetchDeptsError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {fetchDeptsError}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        {/* Personal Information Section */}
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
                                <PersonAddIcon /> Personal Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <TextField
                                name="name"
                                label="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                fullWidth
                                margin="normal"
                                disabled={isSubmitting}
                                placeholder="e.g. John Doe"
                            />

                            <TextField
                                name="email"
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                fullWidth
                                margin="normal"
                                disabled={isSubmitting}
                                placeholder="e.g. john.doe@company.com"
                            />
                        </Box>

                        {/* Job Information Section */}
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                color="primary"
                            >
                                Job Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <TextField
                                name="position"
                                label="Position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                fullWidth
                                margin="normal"
                                disabled={isSubmitting}
                                placeholder="e.g. Software Engineer"
                            />

                            <TextField
                                name="salary"
                                label="Salary (RM)"
                                type="number"
                                value={formData.salary}
                                onChange={handleChange}
                                required
                                fullWidth
                                margin="normal"
                                disabled={isSubmitting}
                                placeholder="e.g. 5000"
                                inputProps={{ min: 0, step: 100 }}
                            />

                            <FormControl
                                fullWidth
                                margin="normal"
                                required
                                disabled={isSubmitting}
                            >
                                <InputLabel id="department-select-label">
                                    Department
                                </InputLabel>
                                <Select
                                    labelId="department-select-label"
                                    id="department_id"
                                    name="department_id"
                                    value={formData.department_id}
                                    label="Department"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">
                                        <em>Select a department</em>
                                    </MenuItem>
                                    {departments?.map((dept) => (
                                        <MenuItem key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {submitError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {submitError}
                            </Alert>
                        )}

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isSubmitting}
                                startIcon={
                                    isSubmitting ? (
                                        <CircularProgress
                                            size={20}
                                            color="inherit"
                                        />
                                    ) : (
                                        <PersonAddIcon />
                                    )
                                }
                            >
                                {isSubmitting
                                    ? 'Adding Employee...'
                                    : 'Add Employee'}
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                                onClick={handleCancel}
                                disabled={isSubmitting}
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

export default AddEmployee;
