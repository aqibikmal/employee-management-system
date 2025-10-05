<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $employeeId = $this->route('employee')->id;

        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,'.$employeeId.'|max:255',
            'position' => 'required|string|max:255',
            'salary' => 'required|numeric|min:0',
            'department_id' => 'required|exists:departments,id',
        ];
    }
}
