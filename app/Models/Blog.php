<?php

// app/Models/Blog.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory, HasTranslations;

    public $translatable = ['title', 'content'];

    protected $fillable = ['title','content','slug'];

    protected $with = ['coverImage'];
    protected $appends = ['title_translated', 'content_translated'];

    protected static function booted()
    {
        static::creating(function (Blog $blog) {
            if (empty($blog->slug)) {
                $blog->slug = static::uniqueSlugFromTitleEn($blog->title);
            }
        });

        static::updating(function (Blog $blog) {
            // Regenerate slug only if EN title changed AND you want slug to follow changes.
            if ($blog->isDirty('title')) {
                $blog->slug = static::uniqueSlugFromTitleEn($blog->title);
            }
        });
    }

    public static function uniqueSlugFromTitleEn(array|string $title): string
    {
        // Ensure English title exists
        $en = is_array($title) ? ($title['en'] ?? '') : $title;
        $base = Str::slug($en ?: 'blog'); // English-only slugs
        $slug = $base;
        $i = 2;
        while (static::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }
        return $slug;
    }

    public function getRouteKeyName(): string
    {
        // For public site we’ll use slug; admin still uses id explicitly.
        return 'slug';
    }

    // relations …
    public function images() { return $this->morphMany(ImageGallery::class, 'imageable'); }
    public function coverImage() { return $this->morphOne(ImageGallery::class, 'imageable')->where('is_cover', true); }

    // translations accessors …
    public function getTitleTranslatedAttribute() { return $this->getTranslation('title', App::getLocale()); }
    public function getContentTranslatedAttribute() { return $this->getTranslation('content', App::getLocale()); }

    public function toArray() {
        $array = parent::toArray();
        if (isset($array['title_translated'])) { $array['title'] = $array['title_translated']; unset($array['title_translated']); }
        if (isset($array['content_translated'])) { $array['content'] = $array['content_translated']; unset($array['content_translated']); }
        return $array;
    }
}
