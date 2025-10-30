<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Support\Facades\App;

class Platform extends Model
{
    use HasFactory, HasTranslations;

    public $translatable = ['name'];

    protected $fillable = [
        'name',
    ];

    protected $appends = ['name_translated'];

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function scholarships()
    {
        return $this->hasMany(Scholarship::class);
    }

    /**
     * Get translated name for current locale
     */
    public function getNameTranslatedAttribute()
    {
        return $this->getTranslation('name', App::getLocale());
    }

    /**
     * Override toArray to use translated values in frontend
     */
    public function toArray()
    {
        $array = parent::toArray();
        
        // Replace name with translated version for frontend
        if (isset($array['name_translated'])) {
            $array['name'] = $array['name_translated'];
            unset($array['name_translated']);
        }
        
        return $array;
    }
}
