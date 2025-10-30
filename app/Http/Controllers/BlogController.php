<?php

// app/Http/Controllers/BlogController.php
namespace App\Http\Controllers;

use App\Services\BlogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function __construct(protected BlogService $blogService) {}

    public function index(): Response
    {
        $blogs = $this->blogService->getAllBlogs(12);
        return Inertia::render('blogs/Index', ['blogs' => $blogs, 'locale' => app()->getLocale()]);
    }

    public function show(Request $request, string $locale, string $slug): Response
    {
        $blog = $this->blogService->getBlogBySlug($slug);
        return Inertia::render('blogs/Show', ['blog' => $blog, 'locale' => $locale]);
    }
}
