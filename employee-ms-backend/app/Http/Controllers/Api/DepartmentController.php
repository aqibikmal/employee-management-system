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

        // Wrap collection with Resource
        return DepartmentResource::collection($departments);
    }

    public function store(StoreDepartmentRequest $request) // <-- Use StoreDepartmentRequest
    {
        // Validation runs automatically
        $department = Department::create($request->validated());

        // Wrap response with Resource
        return new DepartmentResource($department);
    }

    public function show(Department $department)
    {
        // Wrap response with Resource and load employees relationship
        return new DepartmentResource($department->load('employees'));
    }

    public function update(UpdateDepartmentRequest $request, Department $department) // <-- Use UpdateDepartmentRequest
    {
        // Validation runs automatically
        $department->update($request->validated());

        // Wrap response with Resource
        return new DepartmentResource($department);
    }

    public function destroy(Department $department)
    {
        
        $department->delete();

        return response()->json(null, 204);
    }
}
