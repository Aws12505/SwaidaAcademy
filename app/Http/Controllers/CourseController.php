<?php

namespace App\Http\Controllers;

use App\Services\CourseService;
use App\Services\PlatformService;
use App\Services\CategoryService;
use App\Enums\Level;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function __construct(
        protected CourseService $courseService,
        protected PlatformService $platformService,
        protected CategoryService $categoryService
    ) {}

    /**
     * Display paginated and filtered courses
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

        $courses = $this->courseService->getAllCourses($filters, 12);

        return Inertia::render('courses/Index', [
            'courses' => $courses,
            'filters' => $filters,
            'platforms' => $this->platformService->getAllPlatforms(),
            'categories' => $this->categoryService->getAllCategories(),
            'levels' => Level::options(),
            'locale' => app()->getLocale(),
        ]);
    }

    /**
     * Display single course
     */
    public function show(Request $request, string $locale, int $id): Response
    {
        $course = $this->courseService->getCourseById($id);

        return Inertia::render('courses/Show', [
            'course' => $course,
            'locale' => $locale,
        ]);
    }
}
