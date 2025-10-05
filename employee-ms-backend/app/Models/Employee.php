<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute; 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Employee
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $position
 * @property float $salary
 * @property int $department_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Department|null $department
 */
class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'position',
        'salary',
        'department_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        // make sure salary is always cast to float
        'salary' => 'float',
        // make sure department_id is always cast to integer
        'department_id' => 'integer',
    ];

    /**
     * Get the department that owns the Employee.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Interact with the employee's name.
     *
     * Mutator: Ensures the name is always stored in Title Case.
     * Example: "john doe" becomes "John Doe".
     */
    protected function name(): Attribute 
    {
        return Attribute::make(
            set: fn (string $value) => ucwords(strtolower($value)),
        );
    }
}
