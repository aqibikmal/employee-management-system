<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Cipta user untuk login
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'), // password is 'password'
            ]
        );

        // 2. create departments
        $departments = collect(['HR', 'Engineering', 'Sales', 'Marketing', 'Finance'])
            ->map(fn ($name) => Department::create(['name' => $name]));

        // 3. create employees for each department
        $departments->each(function ($department) {
            Employee::factory()->count(5)->create([
                'department_id' => $department->id,
            ]);
        });
    }
}
