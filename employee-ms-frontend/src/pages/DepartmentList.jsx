import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Link, useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Tooltip,
    Avatar,
    Card,
    CardContent,
    Grid,
    Snackbar,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Search as SearchIcon,
    Business as BusinessIcon,
    People as PeopleIcon,
    Category as CategoryIcon,
} from '@mui/icons-material';

function DepartmentList() {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const location = useLocation();

    useEffect(() => {
        fetchData();

        // Check if there's a success message from add/edit department
        if (location.state?.message) {
            setSnackbar({
                open: true,
                message: location.state.message,
                severity: 'success',
            });
            // Clear the state to prevent message showing again on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        // Filter departments based on search term
        const filtered = departments.filter((dept) =>
            dept.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredDepartments(filtered);
    }, [searchTerm, departments]);

    const fetchData = async () => {
        try {
            const [deptResponse, empResponse] = await Promise.all([
                apiClient.get('/departments'),
                apiClient.get('/employees'),
            ]);
            setDepartments(deptResponse.data);
            setFilteredDepartments(deptResponse.data);
            setEmployees(empResponse.data);
        } catch (err) {
            console.error('Gagal mendapatkan data:', err);
            setError('Tidak dapat memuatkan data jabatan.');
        } finally {
            setLoading(false);
        }
    };

    const getEmployeeCount = (deptId) => {
        return employees.filter((emp) => emp.department.id === deptId).length;
    };

    const handleDeleteClick = (department) => {
        const employeeCount = getEmployeeCount(department.id);
        if (employeeCount > 0) {
            setSnackbar({
                open: true,
                message: `Cannot delete "${department.name}" because it has ${employeeCount} employee(s). Please reassign or remove employees first.`,
                severity: 'warning',
            });
            return;
        }
        setDepartmentToDelete(department);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (departmentToDelete) {
            try {
                await apiClient.delete(`/departments/${departmentToDelete.id}`);
                setDeleteDialogOpen(false);
                setSnackbar({
                    open: true,
                    message: `Department "${departmentToDelete.name}" has been deleted successfully!`,
                    severity: 'success',
                });
                setDepartmentToDelete(null);
                fetchData();
            } catch (err) {
                console.error('Failed to delete department:', err);
                setSnackbar({
                    open: true,
                    message:
                        'Failed to delete department. It may have associated employees.',
                    severity: 'error',
                });
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setDepartmentToDelete(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getDepartmentColor = (deptName) => {
        const colors = [
            'primary',
            'secondary',
            'success',
            'warning',
            'error',
            'info',
        ];
        const index = deptName.length % colors.length;
        return colors[index];
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    if (loading) {
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
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                {/* Header Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        fontWeight="bold"
                        color="primary"
                        gutterBottom
                    >
                        Department Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your organization's departments
                    </Typography>
                </Box>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        onClose={() => setError('')}
                    >
                        {error}
                    </Alert>
                )}

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card elevation={2}>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Total Departments
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                        >
                                            {departments.length}
                                        </Typography>
                                    </Box>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.main',
                                            width: 56,
                                            height: 56,
                                        }}
                                    >
                                        <CategoryIcon fontSize="large" />
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Card elevation={2}>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Total Employees
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                        >
                                            {employees.length}
                                        </Typography>
                                    </Box>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'secondary.main',
                                            width: 56,
                                            height: 56,
                                        }}
                                    >
                                        <PeopleIcon fontSize="large" />
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Card elevation={2}>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Avg Employees/Dept
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                        >
                                            {departments.length > 0
                                                ? Math.round(
                                                      employees.length /
                                                          departments.length
                                                  )
                                                : 0}
                                        </Typography>
                                    </Box>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'success.main',
                                            width: 56,
                                            height: 56,
                                        }}
                                    >
                                        <BusinessIcon fontSize="large" />
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Search & Add Button */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                        gap: 2,
                        flexWrap: 'wrap',
                    }}
                >
                    <TextField
                        placeholder="Search departments..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ flexGrow: 1, minWidth: '250px' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        component={Link}
                        to="/departments/add"
                        startIcon={<AddIcon />}
                        size="large"
                        sx={{ minWidth: '220px' }}
                    >
                        Add New Department
                    </Button>
                </Box>

                {/* Table */}
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'primary.main' }}>
                            <TableRow>
                                <TableCell
                                    sx={{ fontWeight: 'bold', color: 'white' }}
                                >
                                    Department
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'white',
                                        textAlign: 'center',
                                    }}
                                >
                                    Employees
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'white',
                                        textAlign: 'center',
                                    }}
                                >
                                    Status
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'white',
                                        textAlign: 'center',
                                    }}
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDepartments.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        align="center"
                                        sx={{ py: 4 }}
                                    >
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                        >
                                            {searchTerm
                                                ? 'No departments found matching your search.'
                                                : 'No departments available.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredDepartments.map((dept) => {
                                    const employeeCount = getEmployeeCount(
                                        dept.id
                                    );
                                    return (
                                        <TableRow
                                            key={dept.id}
                                            hover
                                            sx={{
                                                '&:hover': {
                                                    bgcolor: 'action.hover',
                                                },
                                            }}
                                        >
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: `${getDepartmentColor(dept.name)}.main`,
                                                        }}
                                                    >
                                                        {getInitials(dept.name)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight="medium"
                                                        >
                                                            {dept.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            ID: {dept.id}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={employeeCount}
                                                    color={
                                                        employeeCount > 0
                                                            ? 'primary'
                                                            : 'default'
                                                    }
                                                    size="small"
                                                    icon={<PeopleIcon />}
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        minWidth: '80px',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={
                                                        employeeCount > 0
                                                            ? 'Active'
                                                            : 'Empty'
                                                    }
                                                    color={
                                                        employeeCount > 0
                                                            ? 'success'
                                                            : 'default'
                                                    }
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Edit Department">
                                                    <IconButton
                                                        color="primary"
                                                        component={Link}
                                                        to={`/departments/edit/${dept.id}`}
                                                        size="small"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip
                                                    title={
                                                        employeeCount > 0
                                                            ? `Cannot delete: ${employeeCount} employee(s) assigned`
                                                            : 'Delete Department'
                                                    }
                                                >
                                                    <span>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    dept
                                                                )
                                                            }
                                                            size="small"
                                                            disabled={
                                                                employeeCount >
                                                                0
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Department Summary */}
                {filteredDepartments.length > 0 && (
                    <Box
                        sx={{
                            mt: 3,
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        {filteredDepartments.map((dept) => (
                            <Chip
                                key={dept.id}
                                label={`${dept.name}: ${getEmployeeCount(dept.id)}`}
                                color={getDepartmentColor(dept.name)}
                                variant="outlined"
                                size="small"
                            />
                        ))}
                    </Box>
                )}
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete{' '}
                        <strong>{departmentToDelete?.name}</strong>? This action
                        cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success/Error Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default DepartmentList;
