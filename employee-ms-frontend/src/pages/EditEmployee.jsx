import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import useSubmit from '../hooks/useSubmit';

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
    Edit as EditIcon,
    Person as PersonIcon,
} from '@mui/icons-material';

function EditEmployee() {
    const { employeeId } = useParams();
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

    // 2. use useApi for fetching employee details
    const {
        data: employeeData,
        loading: isLoadingEmp,
        error: fetchEmpError,
    } = useApi(() => apiClient.get(`/employees/${employeeId}`));

    // 3. use useSubmit for updating employee
    const [updateEmployee, { loading: isUpdating, error: updateError }] =
        useSubmit((data) => apiClient.put(`/employees/${employeeId}`, data));

    // 4. useEffect to populate form when employeeData is fetched
    useEffect(() => {
        if (employeeData) {
            setFormData({
                name: employeeData.name || '',
                email: employeeData.email || '',
                position: employeeData.position || '',
                salary: employeeData.salary || '',
                department_id: employeeData.department?.id || '',
            });
        }
    }, [employeeData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateEmployee(formData);
            // Navigate with success message
            navigate('/employees', {
                state: {
                    message: `Employee "${formData.name}" has been updated successfully!`,
                },
            });
        } catch (err) {
            // error is handled by useSubmit
        }
    };

    const handleCancel = () => {
        navigate('/employees');
    };

    // show loading spinner while fetching data
    if (isLoadingDepts || isLoadingEmp) {
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

    const anyError = fetchDeptsError || fetchEmpError || updateError;

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
                        Edit Employee
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Update employee information below
                    </Typography>
                </Box>

                <Paper elevation={3} sx={{ p: 4 }}>
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
                                <PersonIcon /> Personal Information
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
                                disabled={isUpdating}
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
                                disabled={isUpdating}
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
                                disabled={isUpdating}
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
                                disabled={isUpdating}
                                placeholder="e.g. 5000"
                                inputProps={{ min: 0, step: 100 }}
                            />

                            <FormControl
                                fullWidth
                                margin="normal"
                                required
                                disabled={isUpdating}
                            >
                                <InputLabel id="department-select-label">
                                    Department
                                </InputLabel>
                                <Select
                                    labelId="department-select-label"
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

                        {anyError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {anyError}
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
                                    ? 'Updating Employee...'
                                    : 'Update Employee'}
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

export default EditEmployee;
