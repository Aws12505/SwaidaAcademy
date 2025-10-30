<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ScholarshipService;
use App\Services\PlatformService;
use App\Services\CategoryService;
use App\Http\Requests\Admin\StoreScholarshipRequest;
use App\Http\Requests\Admin\UpdateScholarshipRequest;
use App\Models\Scholarship;
use App\Enums\Level;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ScholarshipController extends Controller
{
    public function __construct(
        protected ScholarshipService $scholarshipService,
        protected PlatformService $platformService,
        protected CategoryService $categoryService
    ) {}

    public function index(): Response
    {
        $scholarships = $this->scholarshipService->getAllScholarships([], 20);

        return Inertia::render('admin/scholarships/Index', [
            'scholarships' => $scholarships,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/scholarships/Create', [
            'platforms' => $this->platformService->getAllPlatforms(),
            'categories' => $this->categoryService->getAllCategories(),
            'levels' => Level::options(),
        ]);
    }

    public function store(StoreScholarshipRequest $request): RedirectResponse
    {
        $this->scholarshipService->createScholarship($request->validated());

        return redirect()
            ->route('admin.scholarships.index')
            ->with('success', 'Scholarship created successfully.');
    }

    public function show(string $id): Response
    {
        $scholarshipRaw = Scholarship::with(['platform', 'category', 'images', 'coverImage'])->findOrFail((int)$id);

        return Inertia::render('admin/scholarships/Show', [
            'scholarship' => [
                'id' => $scholarshipRaw->id,
                'title' => json_decode($scholarshipRaw->getAttributes()['title'], true),
                'description' => json_decode($scholarshipRaw->getAttributes()['description'], true),
                'external_url' => $scholarshipRaw->external_url,
                'duration' => $scholarshipRaw->duration,
                'platform_id' => $scholarshipRaw->platform_id,
                'category_id' => $scholarshipRaw->category_id,
                'have_certificate' => $scholarshipRaw->have_certificate,
                'level' => $scholarshipRaw->level->value,
                'platform' => $scholarshipRaw->platform,
                'category' => $scholarshipRaw->category,
                'images' => $scholarshipRaw->images,
                'cover_image' => $scholarshipRaw->coverImage,
                'created_at' => $scholarshipRaw->created_at,
                'updated_at' => $scholarshipRaw->updated_at,
            ],
        ]);
    }

    public function edit(string $id): Response
    {
        $scholarshipRaw = Scholarship::with(['platform', 'category', 'images', 'coverImage'])->findOrFail((int)$id);

        return Inertia::render('admin/scholarships/Edit', [
            'scholarship' => [
                'id' => $scholarshipRaw->id,
                'title' => json_decode($scholarshipRaw->getAttributes()['title'], true),
                'description' => json_decode($scholarshipRaw->getAttributes()['description'], true),
                'external_url' => $scholarshipRaw->external_url,
                'duration' => $scholarshipRaw->duration,
                'platform_id' => $scholarshipRaw->platform_id,
                'category_id' => $scholarshipRaw->category_id,
                'have_certificate' => $scholarshipRaw->have_certificate,
                'level' => $scholarshipRaw->level->value,
                'platform' => $scholarshipRaw->platform,
                'category' => $scholarshipRaw->category,
                'images' => $scholarshipRaw->images,
                'cover_image' => $scholarshipRaw->coverImage,
            ],
            'platforms' => $this->platformService->getAllPlatforms(),
            'categories' => $this->categoryService->getAllCategories(),
            'levels' => Level::options(),
        ]);
    }

    public function update(UpdateScholarshipRequest $request, string $id): RedirectResponse
    {
        $this->scholarshipService->updateScholarship((int)$id, $request->validated());

        return redirect()
            ->route('admin.scholarships.index')
            ->with('success', 'Scholarship updated successfully.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->scholarshipService->deleteScholarship((int)$id);

        return redirect()
            ->route('admin.scholarships.index')
            ->with('success', 'Scholarship deleted successfully.');
    }
}
