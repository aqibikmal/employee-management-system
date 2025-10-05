<?php

namespace App\services;

use App\Models\Department;
use App\Models\Employee;
use Illuminate\Support\Collection;

class DashboardService
{
    /**
     * Get all necessary statistics for the dashboard.
     *
     * @return array
     */
    public function getDashboardStats(): array
    {
        // take all departments with their employees
        $departments = Department::with('employees')->get();

        return [
            'total_employees' => Employee::count(),
            'employees_by_department' => $this->calculateEmployeesByDept($departments),
            'average_salary_by_department' => $this->calculateAvgSalaryByDept($departments),
        ];
    }

    /**
     * Calculate the number of employees for each department.
     */
    private function calculateEmployeesByDept(Collection $departments): Collection
    {
        return $departments->mapWithKeys(function ($department) {
            return [$department->name => $department->employees->count()];
        });
    }

    /**
     * Calculate the average salary for each department.
     */
    private function calculateAvgSalaryByDept(Collection $departments): Collection
    {
        return $departments->mapWithKeys(function ($department) {
            $average = $department->employees->avg('salary');
            return [$department->name => number_format($average ?? 0, 2, '.', '')];
        });
    }
}