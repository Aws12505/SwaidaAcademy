<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Support\Facades\App;

class Blog extends Model
{
    use HasFactory, HasTranslations;

    public $translatable = ['title', 'content'];

    protected $fillable = [
        'title',
        'content',
    ];

    protected $with = ['coverImage'];

    protected $appends = ['title_translated', 'content_translated'];

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
     * Get translated content for current locale
     */
    public function getContentTranslatedAttribute()
    {
        return $this->getTranslation('content', App::getLocale());
    }

    /**
     * Override toArray to use translated values in frontend
     */
    public function toArray()
    {
        $array = parent::toArray();
        
        // Replace title and content with translated versions for frontend
        if (isset($array['title_translated'])) {
            $array['title'] = $array['title_translated'];
            unset($array['title_translated']);
        }
        
        if (isset($array['content_translated'])) {
            $array['content'] = $array['content_translated'];
            unset($array['content_translated']);
        }
        
        return $array;
    }
}
