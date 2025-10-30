<?php

namespace App\Http\Controllers;

use App\Services\CourseService;
use App\Services\ScholarshipService;
use App\Models\Vision;
use App\Models\Mission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function __construct(
        protected CourseService $courseService,
        protected ScholarshipService $scholarshipService
    ) {}

    public function index(Request $request, string $locale): Response
    {
        // Get limited courses and scholarships for landing page
        $courses = $this->courseService->getAllCourses([], 6);
        $scholarships = $this->scholarshipService->getAllScholarships([], 6);
        
        return Inertia::render('Landing', [
            'courses' => $courses,
            'scholarships' => $scholarships,
            'vision' => Vision::first(),
            'mission' => Mission::first(),
            'locale' => $locale,
        ]);
    }

    /**
     * Global search from navbar
     */
    public function search(Request $request, string $locale): Response
    {
        $search = $request->input('search');
        
        $results = [
            'courses' => $this->courseService->globalSearch($search, 5),
            'scholarships' => $this->scholarshipService->globalSearch($search, 5),
        ];

        return Inertia::render('SearchResults', [
            'results' => $results,
            'query' => $search,
            'locale' => $locale,
        ]);
    }
}
