<?php

namespace App\Models;

use App\Enums\Level;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;

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
        'slug',
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
protected static function booted()
{
    static::creating(function (Course $course) {
        if (empty($course->slug)) {
            $course->slug = static::uniqueSlugFromTitleEn($course->title);
        }
    });

    static::updating(function (Course $course) {
        if ($course->isDirty('title')) {
            $course->slug = static::uniqueSlugFromTitleEn($course->title);
        }
    });
}

public static function uniqueSlugFromTitleEn(array|string $title): string
{
    $en = is_array($title) ? ($title['en'] ?? '') : $title;
    $base = Str::slug($en ?: 'course');
    $slug = $base ?: 'course';
    $i = 2;
    while (static::where('slug', $slug)->exists()) {
        $slug = $base.'-'.$i++;
    }
    return $slug;
}

// Optional if you ever use implicit route-model binding publicly:
public function getRouteKeyName(): string
{
    return 'slug';
}
}
