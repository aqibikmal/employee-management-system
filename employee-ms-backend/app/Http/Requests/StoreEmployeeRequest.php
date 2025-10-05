<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email|max:255',
            'position' => 'required|string|max:255',
            'salary' => 'required|numeric|min:0',
            'department_id' => 'required|exists:departments,id',
        ];
    }
}
