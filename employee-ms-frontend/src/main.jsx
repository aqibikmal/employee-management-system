import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import ThemeProvider, createTheme, dan CssBaseline from MUI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { blue, grey } from '@mui/material/colors';

// Import komponen & halaman
import App from './App.jsx';
import './index.css';
import Dashboard from './components/Dashboard.jsx';
import EmployeeList from './pages/EmployeeList.jsx';
import AddEmployee from './pages/AddEmployee.jsx';
import EditEmployee from './pages/EditEmployee.jsx';
import DepartmentList from './pages/DepartmentList.jsx';
import AddDepartment from './pages/AddDepartment.jsx';
import EditDepartment from './pages/EditDepartment.jsx';

// Cipta tema "Korporat" anda
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0D47A1', // DIUBAH: Biru yang lebih gelap (blue[900])
        },
        secondary: {
            main: grey[600],
        },
        background: {
            default: '#F4F6F8',
            paper: '#FFFFFF',
        },
        text: {
            primary: grey[900],
            secondary: grey[700],
        },
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 5px 15px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    // DIUBAH: Gunakan warna biru yang lebih gelap
                    backgroundColor: '#0D47A1',
                    '& .MuiTableCell-root': {
                        color: '#FFFFFF',
                        fontWeight: 600,
                    },
                },
            },
        },
    },
});

// Konfigurasi router anda (tidak berubah)
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'employees', element: <EmployeeList /> },
            { path: 'employees/add', element: <AddEmployee /> },
            { path: 'employees/edit/:employeeId', element: <EditEmployee /> },
            { path: 'departments', element: <DepartmentList /> },
            { path: 'departments/add', element: <AddDepartment /> },
            {
                path: 'departments/edit/:departmentId',
                element: <EditDepartment />,
            },
        ],
    },
]);

// Render aplikasi
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>
);
