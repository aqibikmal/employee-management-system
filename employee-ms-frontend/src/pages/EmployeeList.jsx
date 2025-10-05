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
    TablePagination,
    Card,
    CardContent,
    Snackbar,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Search as SearchIcon,
    Email as EmailIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
} from '@mui/icons-material';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const location = useLocation();

    useEffect(() => {
        fetchEmployees();

        // Check if there's a success message from add/edit employee
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
        // Filter employees based on search term
        const filtered = employees.filter(
            (emp) =>
                emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.department.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );
        setFilteredEmployees(filtered);
        setPage(0); // Reset to first page when searching
    }, [searchTerm, employees]);

    const fetchEmployees = async () => {
        try {
            const response = await apiClient.get('/employees');
            setEmployees(response.data);
            setFilteredEmployees(response.data);
        } catch (err) {
            console.error('Gagal mendapatkan data pekerja:', err);
            setError('Tidak dapat memuatkan data pekerja.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (employee) => {
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (employeeToDelete) {
            try {
                await apiClient.delete(`/employees/${employeeToDelete.id}`);
                setDeleteDialogOpen(false);
                setSnackbar({
                    open: true,
                    message: `Employee "${employeeToDelete.name}" has been deleted successfully!`,
                    severity: 'success',
                });
                setEmployeeToDelete(null);
                fetchEmployees();
            } catch (err) {
                console.error('Gagal memadam pekerja:', err);
                setSnackbar({
                    open: true,
                    message: 'Failed to delete employee. Please try again.',
                    severity: 'error',
                });
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getDepartmentColor = (deptName) => {
        const colors = {
            IT: 'primary',
            HR: 'secondary',
            Finance: 'success',
            Marketing: 'warning',
            Sales: 'error',
            Operations: 'info',
        };
        return colors[deptName] || 'default';
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
        <Container maxWidth="xl">
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
                        Employee Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your organization's employees
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
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                            md: '1fr 1fr 1fr',
                        },
                        gap: 2,
                        mb: 3,
                    }}
                >
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
                                    <Typography variant="h4" fontWeight="bold">
                                        {employees.length}
                                    </Typography>
                                </Box>
                                <Avatar
                                    sx={{
                                        bgcolor: 'primary.main',
                                        width: 56,
                                        height: 56,
                                    }}
                                >
                                    <PersonIcon fontSize="large" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>

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
                                        Departments
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        {
                                            new Set(
                                                employees.map(
                                                    (e) => e.department.name
                                                )
                                            ).size
                                        }
                                    </Typography>
                                </Box>
                                <Avatar
                                    sx={{
                                        bgcolor: 'secondary.main',
                                        width: 56,
                                        height: 56,
                                    }}
                                >
                                    <BusinessIcon fontSize="large" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>

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
                                        Filtered Results
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        {filteredEmployees.length}
                                    </Typography>
                                </Box>
                                <Avatar
                                    sx={{
                                        bgcolor: 'success.main',
                                        width: 56,
                                        height: 56,
                                    }}
                                >
                                    <SearchIcon fontSize="large" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

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
                        placeholder="Search by name, email, position, or department..."
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
                        to="/employees/add"
                        startIcon={<AddIcon />}
                        size="large"
                        sx={{ minWidth: '200px' }}
                    >
                        Add New Employee
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
                                    Employee
                                </TableCell>
                                <TableCell
                                    sx={{ fontWeight: 'bold', color: 'white' }}
                                >
                                    Contact
                                </TableCell>
                                <TableCell
                                    sx={{ fontWeight: 'bold', color: 'white' }}
                                >
                                    Position
                                </TableCell>
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
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        align="center"
                                        sx={{ py: 4 }}
                                    >
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                        >
                                            {searchTerm
                                                ? 'No employees found matching your search.'
                                                : 'No employees available.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredEmployees
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((employee) => (
                                        <TableRow
                                            key={employee.id}
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
                                                            bgcolor:
                                                                'primary.main',
                                                        }}
                                                    >
                                                        {getInitials(
                                                            employee.name
                                                        )}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight="medium"
                                                        >
                                                            {employee.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            ID: {employee.id}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <EmailIcon
                                                        fontSize="small"
                                                        color="action"
                                                    />
                                                    <Typography variant="body2">
                                                        {employee.email}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight="medium"
                                                >
                                                    {employee.position}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={
                                                        employee.department.name
                                                    }
                                                    color={getDepartmentColor(
                                                        employee.department.name
                                                    )}
                                                    size="small"
                                                    icon={<BusinessIcon />}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Edit Employee">
                                                    <IconButton
                                                        color="primary"
                                                        component={Link}
                                                        to={`/employees/edit/${employee.id}`}
                                                        size="small"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Employee">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                employee
                                                            )
                                                        }
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={filteredEmployees.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete{' '}
                        <strong>{employeeToDelete?.name}</strong>? This action
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

export default EmployeeList;
