<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CategoryService;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(protected CategoryService $categoryService) {}

    public function index(): Response
    {
        return Inertia::render('admin/categories/Index', [
            'categories' => $this->categoryService->getAllCategories(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/categories/Create');
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $this->categoryService->createCategory($request->validated());
        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    public function show(string $id): Response
    {
        $categoryRaw = Category::withCount(['courses','scholarships'])->findOrFail((int)$id);

        return Inertia::render('admin/categories/Show', [
            'category' => [
                'id' => $categoryRaw->id,
                'name' => json_decode($categoryRaw->getAttributes()['name'], true), // keep both langs
                'courses_count' => $categoryRaw->courses_count,
                'scholarships_count' => $categoryRaw->scholarships_count,
            ],
        ]);
    }

    public function edit(string $id): Response
    {
        $categoryRaw = Category::withCount(['courses','scholarships'])->findOrFail((int)$id);

        return Inertia::render('admin/categories/Edit', [
            'category' => [
                'id' => $categoryRaw->id,
                'name' => json_decode($categoryRaw->getAttributes()['name'], true),
                'courses_count' => $categoryRaw->courses_count,
                'scholarships_count' => $categoryRaw->scholarships_count,
            ],
        ]);
    }

    public function update(UpdateCategoryRequest $request, string $id): RedirectResponse
    {
        $this->categoryService->updateCategory((int)$id, $request->validated());
        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->categoryService->deleteCategory((int)$id);
        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }
}
