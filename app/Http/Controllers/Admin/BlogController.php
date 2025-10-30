<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\BlogService;
use App\Http\Requests\Admin\StoreBlogRequest;
use App\Http\Requests\Admin\UpdateBlogRequest;
use App\Models\Blog;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function __construct(protected BlogService $blogService) {}

    public function index(): Response
    {
        $blogs = $this->blogService->getAllBlogs(20);
        return Inertia::render('admin/blogs/Index', ['blogs' => $blogs]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/blogs/Create');
    }

    public function store(StoreBlogRequest $request): RedirectResponse
    {
        $this->blogService->createBlog($request->validated());
        return redirect()->route('admin.blogs.index')->with('success', 'Blog created successfully.');
    }

    public function show(string $id): Response
    {
        $blogRaw = Blog::with(['images', 'coverImage'])->findOrFail((int)$id);

        return Inertia::render('admin/blogs/Show', [
            'blog' => [
                'id' => $blogRaw->id,
                'title' => json_decode($blogRaw->getAttributes()['title'], true),
                'content' => json_decode($blogRaw->getAttributes()['content'], true),
                'images' => $blogRaw->images,
                'cover_image' => $blogRaw->coverImage,
                'created_at' => $blogRaw->created_at,
                'updated_at' => $blogRaw->updated_at,
            ],
        ]);
    }

    public function edit(string $id): Response
    {
        $blogRaw = Blog::with(['images', 'coverImage'])->findOrFail((int)$id);

        return Inertia::render('admin/blogs/Edit', [
            'blog' => [
                'id' => $blogRaw->id,
                'title' => json_decode($blogRaw->getAttributes()['title'], true),
                'content' => json_decode($blogRaw->getAttributes()['content'], true),
                'images' => $blogRaw->images,
                'cover_image' => $blogRaw->coverImage,
            ],
        ]);
    }

    public function update(UpdateBlogRequest $request, string $id): RedirectResponse
    {
        $this->blogService->updateBlog((int)$id, $request->validated());
        return redirect()->route('admin.blogs.index')->with('success', 'Blog updated successfully.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->blogService->deleteBlog((int)$id);
        return redirect()->route('admin.blogs.index')->with('success', 'Blog deleted successfully.');
    }
}
