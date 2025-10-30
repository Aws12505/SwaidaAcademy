<?php

namespace App\Services;

use App\Models\ImageGallery;
use Illuminate\Support\Facades\Storage;

class ImageService
{
    /**
     * Handle image upload and association
     */
    public function handleImages($model, array $images, bool $deleteExisting = false): void
    {
        if ($deleteExisting) {
            $this->deleteModelImages($model);
        }

        foreach ($images as $imageData) {
            if (isset($imageData['file']) && $imageData['file']->isValid()) {
                $path = $imageData['file']->store('images', 'public');
                
                $model->images()->create([
                    'image_path' => $path,
                    'is_cover' => $imageData['is_cover'] ?? false,
                ]);
            }
        }

        // Ensure only one cover image exists
        $this->ensureSingleCoverImage($model);
    }

    /**
     * Delete all images for a model
     */
    public function deleteModelImages($model): void
    {
        foreach ($model->images as $image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }
    }

    /**
     * Ensure model has only one cover image
     */
    protected function ensureSingleCoverImage($model): void
    {
        $coverImages = $model->images()->where('is_cover', true)->get();

        if ($coverImages->count() > 1) {
            // Keep the first one, remove cover status from others
            $coverImages->skip(1)->each(function ($image) {
                $image->update(['is_cover' => false]);
            });
        } elseif ($coverImages->count() === 0 && $model->images()->count() > 0) {
            // If no cover, make the first image the cover
            $model->images()->first()->update(['is_cover' => true]);
        }
    }
}
