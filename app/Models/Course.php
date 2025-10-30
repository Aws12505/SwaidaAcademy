<?php

namespace App\Models;

use App\Enums\Level;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Support\Facades\App;

class Course extends Model
{
    use HasFactory, HasTranslations;

    public $translatable = ['title', 'description'];

    protected $fillable = [
        'title',
        'description',
        'external_url',
        'duration',
        'platform_id',
        'category_id',
        'have_certificate',
        'level',
    ];

    protected $casts = [
        'have_certificate' => 'boolean',
        'level' => Level::class,
    ];

    protected $with = ['platform', 'category', 'coverImage'];

    protected $appends = ['title_translated', 'description_translated'];

    public function platform()
    {
        return $this->belongsTo(Platform::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->morphMany(ImageGallery::class, 'imageable');
    }

    public function coverImage()
    {
        return $this->morphOne(ImageGallery::class, 'imageable')
            ->where('is_cover', true);
    }

    /**
     * Get translated title for current locale
     */
    public function getTitleTranslatedAttribute()
    {
        return $this->getTranslation('title', App::getLocale());
    }

    /**
     * Get translated description for current locale
     */
    public function getDescriptionTranslatedAttribute()
    {
        return $this->getTranslation('description', App::getLocale());
    }

    /**
     * Scope for filtering courses
     */
    public function scopeFilter($query, array $filters)
    {
        return app(\App\Filters\CourseFilters::class)->apply($query, $filters);
    }

    /**
     * Override toArray to use translated values in frontend
     */
    public function toArray()
    {
        $array = parent::toArray();
        
        // Replace title and description with translated versions for frontend
        if (isset($array['title_translated'])) {
            $array['title'] = $array['title_translated'];
            unset($array['title_translated']);
        }
        
        if (isset($array['description_translated'])) {
            $array['description'] = $array['description_translated'];
            unset($array['description_translated']);
        }
        
        return $array;
    }

    // app/Models/Course.php
public function accessedBy()
{
    return $this->belongsToMany(User::class, 'course_user_accesses')
        ->withTimestamps();
}

}
