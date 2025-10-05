import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemText,
    Container,
    Chip,
    Avatar,
    LinearProgress,
    Tooltip,
} from '@mui/material';
import {
    People as PeopleIcon,
    BusinessCenter as BusinessIcon,
    AttachMoney as MoneyIcon,
    TrendingUp as TrendingUpIcon,
    Category as CategoryIcon,
} from '@mui/icons-material';
import apiClient from '../api/apiClient';
import useApi from '../hooks/useApi';

// --- Reusable Sub-Components ---

// Enhanced StatCard with better styling
const StatCard = ({ title, value, icon, gradient, subtitle }) => (
    <Card
        sx={{
            mb: 4,
            background: gradient,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                transform: 'translate(50%, -50%)',
            },
        }}
        elevation={4}
    >
        <CardContent>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Box sx={{ zIndex: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
                        {title}
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ opacity: 0.3, zIndex: 0 }}>{icon}</Box>
            </Box>
        </CardContent>
    </Card>
);

// Mini stat card for grid layout
const MiniStatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
        <CardContent>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
            >
                <Avatar
                    sx={{ bgcolor: `${color}.main`, width: 48, height: 48 }}
                >
                    {icon}
                </Avatar>
            </Box>
            <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
                {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {title}
            </Typography>
        </CardContent>
    </Card>
);

// Enhanced StatListCard with progress bars
const StatListCard = ({
    title,
    icon,
    data,
    renderValue,
    showProgress = false,
    total = 0,
}) => (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
        <Box display="flex" alignItems="center" mb={2}>
            {icon}
            <Typography variant="h6" fontWeight="bold">
                {title}
            </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List>
            {Object.entries(data).map(([key, value]) => {
                const percentage = total > 0 ? (value / total) * 100 : 0;
                return (
                    <ListItem
                        key={key}
                        sx={{
                            py: 1.5,
                            px: 2,
                            mb: 1,
                            '&:hover': { bgcolor: 'action.hover' },
                            borderRadius: 1,
                            flexDirection: 'column',
                            alignItems: 'stretch',
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={showProgress ? 1 : 0}
                        >
                            <Typography variant="body1" fontWeight="medium">
                                {key}
                            </Typography>
                            {renderValue(value)}
                        </Box>
                        {showProgress && (
                            <Tooltip
                                title={`${percentage.toFixed(1)}% of total`}
                            >
                                <LinearProgress
                                    variant="determinate"
                                    value={percentage}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        bgcolor: 'action.hover',
                                    }}
                                />
                            </Tooltip>
                        )}
                    </ListItem>
                );
            })}
        </List>
    </Paper>
);

// --- Main Dashboard Component ---

function Dashboard() {
    const {
        data: stats,
        loading,
        error,
    } = useApi(() => apiClient.get('/dashboard/stats'));

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="80vh"
            >
                <Box textAlign="center">
                    <CircularProgress size={60} />
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                    >
                        Loading dashboard...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="h6">
                        Failed to load dashboard
                    </Typography>
                    {error}
                </Alert>
            </Container>
        );
    }

    // Calculate additional metrics
    const totalDepartments = stats
        ? Object.keys(stats.employees_by_department).length
        : 0;
    const totalEmployees = stats?.total_employees || 0;
    const avgEmployeesPerDept =
        totalDepartments > 0
            ? (totalEmployees / totalDepartments).toFixed(1)
            : 0;

    // Calculate overall average salary
    const overallAvgSalary = stats
        ? Object.values(stats.average_salary_by_department).reduce(
              (sum, val) => sum + parseFloat(val),
              0
          ) / totalDepartments
        : 0;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box mb={4}>
                <Typography
                    variant="h4"
                    gutterBottom
                    fontWeight="bold"
                    color="primary"
                >
                    Dashboard Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Your organization's key metrics at a glance
                </Typography>
            </Box>

            {stats && (
                <>
                    {/* Main Stats Grid */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={3}>
                            <MiniStatCard
                                title="Total Employees"
                                value={stats.total_employees}
                                icon={<PeopleIcon />}
                                color="primary"
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <MiniStatCard
                                title="Departments"
                                value={totalDepartments}
                                icon={<CategoryIcon />}
                                color="secondary"
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <MiniStatCard
                                title="Avg per Department"
                                value={avgEmployeesPerDept}
                                icon={<BusinessIcon />}
                                color="info"
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <MiniStatCard
                                title="Avg Salary"
                                value={`RM ${overallAvgSalary.toLocaleString('ms-MY', { maximumFractionDigits: 0 })}`}
                                icon={<TrendingUpIcon />}
                                color="success"
                            />
                        </Grid>
                    </Grid>

                    {/* Detailed Stats Grid */}
                    <Grid container spacing={3}>
                        {/* Employees by Department with Progress Bars */}
                        <Grid item xs={12} md={6}>
                            <StatListCard
                                title="Employees by Department"
                                icon={
                                    <BusinessIcon
                                        color="primary"
                                        sx={{ mr: 1, fontSize: 28 }}
                                    />
                                }
                                data={stats.employees_by_department}
                                total={stats.total_employees}
                                showProgress={true}
                                renderValue={(count) => (
                                    <Chip
                                        label={`${count} employees`}
                                        color="primary"
                                        size="small"
                                        sx={{
                                            fontWeight: 'bold',
                                            minWidth: '100px',
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Average Salary by Department */}
                        <Grid item xs={12} md={6}>
                            <StatListCard
                                title="Average Salary by Department"
                                icon={
                                    <MoneyIcon
                                        color="success"
                                        sx={{ mr: 1, fontSize: 28 }}
                                    />
                                }
                                data={stats.average_salary_by_department}
                                renderValue={(avg) => (
                                    <Chip
                                        label={`RM ${parseFloat(
                                            avg
                                        ).toLocaleString('ms-MY', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}`}
                                        color="success"
                                        size="small"
                                        sx={{
                                            fontWeight: 'bold',
                                            minWidth: '120px',
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                    {/* Summary Card */}
                    <Card sx={{ mt: 3 }} elevation={2}>
                        <CardContent>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                gutterBottom
                                color="primary"
                            >
                                Quick Summary
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box textAlign="center" py={1}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Total Workforce
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                            color="primary"
                                        >
                                            {stats.total_employees}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box textAlign="center" py={1}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Active Departments
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                            color="secondary"
                                        >
                                            {totalDepartments}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box textAlign="center" py={1}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Distribution
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                            color="info.main"
                                        >
                                            {avgEmployeesPerDept}/dept
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box textAlign="center" py={1}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Avg Compensation
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                            color="success.main"
                                        >
                                            RM{' '}
                                            {overallAvgSalary.toLocaleString(
                                                'ms-MY',
                                                { maximumFractionDigits: 0 }
                                            )}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </>
            )}
        </Container>
    );
}

export default Dashboard;
