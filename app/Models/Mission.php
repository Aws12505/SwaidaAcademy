<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Support\Facades\App;

class Mission extends Model
{
    use HasFactory, HasTranslations;

    public $translatable = ['content'];

    protected $fillable = [
        'content',
    ];

    protected $appends = ['content_translated'];

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
        
        // Replace content with translated version for frontend
        if (isset($array['content_translated'])) {
            $array['content'] = $array['content_translated'];
            unset($array['content_translated']);
        }
        
        return $array;
    }
}
