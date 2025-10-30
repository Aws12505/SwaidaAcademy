<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CourseService;
use App\Services\PlatformService;
use App\Services\CategoryService;
use App\Http\Requests\Admin\StoreCourseRequest;
use App\Http\Requests\Admin\UpdateCourseRequest;
use App\Models\Course;
use App\Enums\Level;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function __construct(
        protected CourseService $courseService,
        protected PlatformService $platformService,
        protected CategoryService $categoryService
    ) {}

    public function index(): Response
    {
        $courses = $this->courseService->getAllCourses([], 20);

        return Inertia::render('admin/courses/Index', [
            'courses' => $courses,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/courses/Create', [
            'platforms' => $this->platformService->getAllPlatforms(),
            'categories' => $this->categoryService->getAllCategories(),
            'levels' => Level::options(),
        ]);
    }

    public function store(StoreCourseRequest $request): RedirectResponse
    {
        $this->courseService->createCourse($request->validated());

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Course created successfully.');
    }

    public function show(string $id): Response
    {
        $courseRaw = Course::with(['platform', 'category', 'images', 'coverImage'])->findOrFail((int)$id);

        return Inertia::render('admin/courses/Show', [
            'course' => [
                'id' => $courseRaw->id,
                'title' => json_decode($courseRaw->getAttributes()['title'], true),
                'description' => json_decode($courseRaw->getAttributes()['description'], true),
                'external_url' => $courseRaw->external_url,
                'duration' => $courseRaw->duration,
                'platform_id' => $courseRaw->platform_id,
                'category_id' => $courseRaw->category_id,
                'have_certificate' => $courseRaw->have_certificate,
                'level' => $courseRaw->level->value,
                'platform' => $courseRaw->platform,
                'category' => $courseRaw->category,
                'images' => $courseRaw->images,
                'cover_image' => $courseRaw->coverImage,
                'created_at' => $courseRaw->created_at,
                'updated_at' => $courseRaw->updated_at,
            ],
        ]);
    }

    public function edit(string $id): Response
    {
        $courseRaw = Course::with(['platform', 'category', 'images', 'coverImage'])->findOrFail((int)$id);

        return Inertia::render('admin/courses/Edit', [
            'course' => [
                'id' => $courseRaw->id,
                'title' => json_decode($courseRaw->getAttributes()['title'], true),
                'description' => json_decode($courseRaw->getAttributes()['description'], true),
                'external_url' => $courseRaw->external_url,
                'duration' => $courseRaw->duration,
                'platform_id' => $courseRaw->platform_id,
                'category_id' => $courseRaw->category_id,
                'have_certificate' => $courseRaw->have_certificate,
                'level' => $courseRaw->level->value,
                'platform' => $courseRaw->platform,
                'category' => $courseRaw->category,
                'images' => $courseRaw->images,
                'cover_image' => $courseRaw->coverImage,
            ],
            'platforms' => $this->platformService->getAllPlatforms(),
            'categories' => $this->categoryService->getAllCategories(),
            'levels' => Level::options(),
        ]);
    }

    public function update(UpdateCourseRequest $request, string $id): RedirectResponse
    {
        $this->courseService->updateCourse((int)$id, $request->validated());

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Course updated successfully.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->courseService->deleteCourse((int)$id);

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Course deleted successfully.');
    }
}
