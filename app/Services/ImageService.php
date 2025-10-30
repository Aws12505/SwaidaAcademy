<?php

// app/Services/ImageService.php
namespace App\Services;

use App\Models\ImageGallery;
use Illuminate\Support\Facades\Storage;

class ImageService
{
    public function handleImages($model, array $images, bool $deleteExisting = false): void
    {
        if ($deleteExisting) {
            $this->deleteModelImages($model, inlineAlso:false);
        }

        foreach ($images as $imageData) {
            if (isset($imageData['file']) && $imageData['file']->isValid()) {
                $path = $imageData['file']->store('images', 'public');
                $model->images()->create([
                    'image_path' => $path,
                    'is_cover'   => $imageData['is_cover'] ?? false,
                    'is_inline'  => false,
                ]);
            }
        }

        $this->ensureSingleCoverImage($model);
    }

    public function deleteModelImages($model, bool $inlineAlso = true): void
    {
        $query = $model->images();
        if (!$inlineAlso) $query->where('is_inline', false);

        foreach ($query->get() as $image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }
    }

    public function ensureSingleCoverImage($model): void
    {
        $coverImages = $model->images()->where('is_cover', true)->get();
        if ($coverImages->count() > 1) {
            $coverImages->skip(1)->each(fn($img) => $img->update(['is_cover' => false]));
        } elseif ($coverImages->count() === 0 && $model->images()->where('is_inline',false)->count() > 0) {
            $model->images()->where('is_inline',false)->first()->update(['is_cover' => true]);
        }
    }

    public function deleteInlineImagesNotInContent($model, ?string $html): void
    {
        if (!$html) return;

        preg_match_all('/<img[^>]+src=["\']([^"\']+)["\']/i', $html, $matches);
        $srcsInContent = collect($matches[1] ?? [])->map(function ($src) {
            // convert full URL back to relative storage path
            $prefix = asset('storage/').'/';
            return str_starts_with($src, $prefix) ? substr($src, strlen($prefix)) : null;
        })->filter()->values();

        $model->images()
            ->where('is_inline', true)
            ->get()
            ->each(function (ImageGallery $img) use ($srcsInContent) {
                if (!$srcsInContent->contains($img->image_path)) {
                    Storage::disk('public')->delete($img->image_path);
                    $img->delete();
                }
            });
    }
}
