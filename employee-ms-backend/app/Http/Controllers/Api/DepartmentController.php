<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDepartmentRequest; 
use App\Http\Requests\UpdateDepartmentRequest; 
use App\Http\Resources\DepartmentResource; 
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::with('employees')->get();

        // Balut collection dengan Resource
        return DepartmentResource::collection($departments);
    }

    public function store(StoreDepartmentRequest $request) // <-- Guna StoreDepartmentRequest
    {
        // Validasi berjalan secara automatik
        $department = Department::create($request->validated());

        // Balut response dengan Resource
        return new DepartmentResource($department);
    }

    public function show(Department $department)
    {
        // Balut response dengan Resource
        return new DepartmentResource($department->load('employees'));
    }

    public function update(UpdateDepartmentRequest $request, Department $department) // <-- Guna UpdateDepartmentRequest
    {
        // Validasi berjalan secara automatik
        $department->update($request->validated());

        // Balut response dengan Resource
        return new DepartmentResource($department);
    }

    public function destroy(Department $department)
    {
        // Method ini sudah sempurna, tiada perubahan diperlukan
        $department->delete();

        return response()->json(null, 204);
    }
}
