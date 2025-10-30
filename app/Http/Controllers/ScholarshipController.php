<?php

namespace App\Http\Controllers;

use App\Services\ScholarshipService;
use App\Services\PlatformService;
use App\Services\CategoryService;
use App\Enums\Level;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScholarshipController extends Controller
{
    public function __construct(
        protected ScholarshipService $scholarshipService,
        protected PlatformService $platformService,
        protected CategoryService $categoryService
    ) {}

    /**
     * Display paginated and filtered scholarships
     */
    public function index(Request $request): Response
    {
        $filters = $request->only([
            'search',
            'platform_id',
            'category_id',
            'level',
            'have_certificate',
            'duration',
            'sort_by',
            'sort_direction'
        ]);

        $scholarships = $this->scholarshipService->getAllScholarships($filters, 12);

        return Inertia::render('scholarships/Index', [
            'scholarships' => $scholarships,
            'filters' => $filters,
            'platforms' => $this->platformService->getAllPlatforms(),
            'categories' => $this->categoryService->getAllCategories(),
            'levels' => Level::options(),
            'locale' => app()->getLocale(),
        ]);
    }

    /**
     * Display single scholarship
     */
public function show(Request $request, string $locale, string $slug): Response
{
    $scholarship = $this->scholarshipService->getScholarshipBySlug($slug);

    return Inertia::render('scholarships/Show', [
        'scholarship' => $scholarship,
        'locale' => $locale,
    ]);
}
}
