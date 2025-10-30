<?php

// app/Models/ImageGallery.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageGallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'imageable_type','imageable_id','image_path','is_cover',
        'is_inline','meta','draft_token',
    ];

    protected $casts = [
        'is_cover' => 'boolean',
        'is_inline' => 'boolean',
        'meta' => 'array',
    ];

    protected $appends = ['image_url'];

    public function imageable() { return $this->morphTo(); }

    public function getImageUrlAttribute() { return asset('storage/'.$this->image_path); }
}
