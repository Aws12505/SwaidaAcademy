<?php

namespace App\Services;

use App\Models\Blog;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BlogService
{
    protected ImageService $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    /**
     * Get all blogs with pagination
     */
    public function getAllBlogs(int $perPage = 12): LengthAwarePaginator
    {
        return Blog::latest()->paginate($perPage);
    }

    /**
     * Get blog by ID
     */
    public function getBlogById(int $id): Blog
    {
        return Blog::with('images')->findOrFail($id);
    }

    /**
     * Create new blog
     */
    public function createBlog(array $data): Blog
    {
        return DB::transaction(function () use ($data) {
            $images = $data['images'] ?? [];
            unset($data['images']);

            $blog = Blog::create($data);

            if (!empty($images)) {
                $this->imageService->handleImages($blog, $images);
            }

            return $blog->load('images');
        });
    }

    /**
     * Update blog
     */
    public function updateBlog(int $id, array $data): Blog
    {
        return DB::transaction(function () use ($id, $data) {
            $blog = Blog::findOrFail($id);

            $images = $data['images'] ?? null;
            unset($data['images']);

            $blog->update($data);

            if ($images !== null) {
                $this->imageService->handleImages($blog, $images, true);
            }

            return $blog->load('images');
        });
    }

    /**
     * Delete blog
     */
    public function deleteBlog(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $blog = Blog::findOrFail($id);
            $this->imageService->deleteModelImages($blog);
            return $blog->delete();
        });
    }
}
