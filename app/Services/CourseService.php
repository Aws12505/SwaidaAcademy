<?php

namespace App\Services;

use App\Models\Course;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CourseService
{
    protected ImageService $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    /**
     * Get all courses with filtering and pagination
     */
    public function getAllCourses(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        return Course::filter($filters)->paginate($perPage);
    }

    /**
     * Get course by ID
     */
    public function getCourseById(int $id): Course
    {
        return Course::with(['platform', 'category', 'images'])->findOrFail($id);
    }

    /**
     * Create new course
     */
    public function createCourse(array $data): Course
    {
        return DB::transaction(function () use ($data) {
            $images = $data['images'] ?? [];
            unset($data['images']);

            $course = Course::create($data);

            if (!empty($images)) {
                $this->imageService->handleImages($course, $images);
            }

            return $course->load(['platform', 'category', 'images']);
        });
    }

    /**
     * Update course
     */
    public function updateCourse(int $id, array $data): Course
    {
        return DB::transaction(function () use ($id, $data) {
            $course = Course::findOrFail($id);

            $images = $data['images'] ?? null;
            unset($data['images']);

            $course->update($data);

            if ($images !== null) {
                $this->imageService->handleImages($course, $images, true);
            }

            return $course->load(['platform', 'category', 'images']);
        });
    }

    /**
     * Delete course
     */
    public function deleteCourse(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $course = Course::findOrFail($id);
            $this->imageService->deleteModelImages($course);
            return $course->delete();
        });
    }

    /**
     * Global search across courses
     */
    public function globalSearch(string $search, int $limit = 5): array
    {
        return Course::filter(['search' => $search])
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function getCourseBySlug(string $slug): Course
{
    return Course::with(['platform','category','images'])->where('slug',$slug)->firstOrFail();
}

}
