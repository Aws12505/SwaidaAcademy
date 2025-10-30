<?php

// app/Services/BlogService.php
namespace App\Services;

use App\Models\Blog;
use App\Models\ImageGallery;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class BlogService
{
    protected ImageService $imageService;
    public function __construct(ImageService $imageService) { $this->imageService = $imageService; }

    public function getAllBlogs(int $perPage = 12): LengthAwarePaginator
    {
        return Blog::latest()->paginate($perPage);
    }

    public function getBlogById(int $id): Blog
    {
        return Blog::with('images','coverImage')->findOrFail($id);
    }

    public function getBlogBySlug(string $slug): Blog
    {
        return Blog::with('images','coverImage')->where('slug',$slug)->firstOrFail();
    }

    public function createBlog(array $data): Blog
    {
        return DB::transaction(function () use ($data) {
            $images = $data['images'] ?? [];
            $draft  = $data['draft_token'] ?? null;
            unset($data['images'], $data['draft_token']);

            $blog = Blog::create($data);

            // Attach “normal” images (cards/gallery)
            if (!empty($images)) {
                $this->imageService->handleImages($blog, $images);
            }

            // Reattach any inline images uploaded during draft via dialog
            if ($draft) {
                ImageGallery::where('imageable_type', Blog::class)
                    ->where('imageable_id', 0)
                    ->where('draft_token', $draft)
                    ->update([
                        'imageable_id' => $blog->id,
                        'draft_token' => null,
                    ]);
            }

            // Remove inline uploads that are *not in the final content*
            $this->imageService->deleteInlineImagesNotInContent($blog, $blog->getTranslation('content','en'));
            $this->imageService->deleteInlineImagesNotInContent($blog, $blog->getTranslation('content','ar'));

            return $blog->load('images','coverImage');
        });
    }

    public function updateBlog(int $id, array $data): Blog
    {
        return DB::transaction(function () use ($id, $data) {
            $blog = Blog::findOrFail($id);

            $images = $data['images'] ?? null;
            $draft  = $data['draft_token'] ?? null;
            unset($data['images'], $data['draft_token']);

            $blog->update($data);

            if ($images !== null) {
                $this->imageService->handleImages($blog, $images, true);
            }

            if ($draft) {
                ImageGallery::where('imageable_type', Blog::class)
                    ->where('imageable_id', 0)
                    ->where('draft_token', $draft)
                    ->update([
                        'imageable_id' => $blog->id,
                        'draft_token' => null,
                    ]);
            }

            $this->imageService->deleteInlineImagesNotInContent($blog, $blog->getTranslation('content','en'));
            $this->imageService->deleteInlineImagesNotInContent($blog, $blog->getTranslation('content','ar'));

            return $blog->load('images','coverImage');
        });
    }

    public function deleteBlog(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $blog = Blog::findOrFail($id);
            $this->imageService->deleteModelImages($blog);
            return $blog->delete();
        });
    }
}
