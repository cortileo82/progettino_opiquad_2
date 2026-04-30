<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MuscleGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    protected $perPage = 10;

    public function exercises(): HasMany
    {
        return $this->hasMany(Exercise::class);
    }

    public static function getForDropDown()
    {
        return self::orderBy('name')->get(['id', 'name']);
    }

    public function scopeSearch($query, $search)
    {
        return $query->when($search, function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%");
        });
    }
}
