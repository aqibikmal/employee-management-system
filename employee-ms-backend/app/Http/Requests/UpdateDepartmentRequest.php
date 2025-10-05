<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // get the department id from the route
        $departmentId = $this->route('department')->id;

        return [
            'name' => 'required|string|unique:departments,name,'.$departmentId.'|max:255',
        ];
    }
}
