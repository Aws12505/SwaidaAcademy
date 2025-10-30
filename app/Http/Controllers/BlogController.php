<?php

namespace App\Http\Controllers;

use App\Services\BlogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function __construct(protected BlogService $blogService) {}

    /**
     * Display paginated blogs
     */
    public function index(): Response
    {
        $blogs = $this->blogService->getAllBlogs(12);

        return Inertia::render('blogs/Index', [
            'blogs' => $blogs,
            'locale' => app()->getLocale(),
        ]);
    }

    /**
     * Display single blog
     */
    public function show(Request $request, string $locale, int $id): Response
    {
        $blog = $this->blogService->getBlogById($id);

        return Inertia::render('blogs/Show', [
            'blog' => $blog,
            'locale' => $locale,
        ]);
    }
}
