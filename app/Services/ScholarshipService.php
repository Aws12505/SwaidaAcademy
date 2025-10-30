<?php

namespace App\Services;

use App\Models\Scholarship;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ScholarshipService
{
    protected ImageService $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    /**
     * Get all scholarships with filtering and pagination
     */
    public function getAllScholarships(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        return Scholarship::filter($filters)->paginate($perPage);
    }

    /**
     * Get scholarship by ID
     */
    public function getScholarshipById(int $id): Scholarship
    {
        return Scholarship::with(['platform', 'category', 'images'])->findOrFail($id);
    }

    /**
     * Create new scholarship
     */
    public function createScholarship(array $data): Scholarship
    {
        return DB::transaction(function () use ($data) {
            $images = $data['images'] ?? [];
            unset($data['images']);

            $scholarship = Scholarship::create($data);

            if (!empty($images)) {
                $this->imageService->handleImages($scholarship, $images);
            }

            return $scholarship->load(['platform', 'category', 'images']);
        });
    }

    /**
     * Update scholarship
     */
    public function updateScholarship(int $id, array $data): Scholarship
    {
        return DB::transaction(function () use ($id, $data) {
            $scholarship = Scholarship::findOrFail($id);

            $images = $data['images'] ?? null;
            unset($data['images']);

            $scholarship->update($data);

            if ($images !== null) {
                $this->imageService->handleImages($scholarship, $images, true);
            }

            return $scholarship->load(['platform', 'category', 'images']);
        });
    }

    /**
     * Delete scholarship
     */
    public function deleteScholarship(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $scholarship = Scholarship::findOrFail($id);
            $this->imageService->deleteModelImages($scholarship);
            return $scholarship->delete();
        });
    }

    /**
     * Global search across scholarships
     */
    public function globalSearch(string $search, int $limit = 5): array
    {
        return Scholarship::filter(['search' => $search])
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function getScholarshipBySlug(string $slug): Scholarship
{
    return Scholarship::with(['platform','category','images'])->where('slug',$slug)->firstOrFail();
}

}
