<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'position' => $this->position,
            'salary' => (float) $this->salary, // make sure always float
            // use department resource to department data
            'department' => new DepartmentResource($this->whenLoaded('department')),
        ];
    }
}
