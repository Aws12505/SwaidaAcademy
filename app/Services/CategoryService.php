<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    /**
     * Get all categories (with counts)
     */
    public function getAllCategories(): Collection
    {
        return Category::withCount(['courses', 'scholarships'])->get();
    }

    /**
     * Get category by ID (with counts)
     */
    public function getCategoryById(int $id): Category
    {
        return Category::withCount(['courses', 'scholarships'])->findOrFail($id);
    }

    /**
     * Create new category
     */
    public function createCategory(array $data): Category
    {
        return Category::create($data);
    }

    /**
     * Update category
     */
    public function updateCategory(int $id, array $data): Category
    {
        $category = Category::findOrFail($id);
        $category->update($data);
        return $category;
    }

    /**
     * Delete category
     */
    public function deleteCategory(int $id): bool
    {
        $category = Category::findOrFail($id);
        return $category->delete();
    }
}
