<?php

// app/Http/Controllers/Admin/UploadController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\ImageGallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UploadController extends Controller
{
    // List images for gallery picker
    public function index(Request $request)
    {
        $blogId = $request->integer('blog_id');
        $draft = $request->string('draft_token')->toString();

        $query = ImageGallery::query()
            ->when($blogId, fn($q) => $q->where('imageable_type', Blog::class)->where('imageable_id', $blogId))
            ->when($draft, fn($q) => $q->orWhere(fn($q2) => $q2
                ->where('imageable_type', Blog::class)
                ->where('imageable_id', 0)
                ->where('draft_token', $draft)));

        return response()->json([
            'images' => $query->latest()->limit(60)->get(['id','image_path','is_inline','meta'])->map(fn($i)=>[
                'id'=>$i->id,'image_url'=>$i->image_url,'is_inline'=>$i->is_inline,'meta'=>$i->meta
            ]),
        ]);
    }

    // Upload image (inline by default)
    public function store(Request $request)
    {
        $data = $request->validate([
            'file' => ['required','image','max:8192'], // 8MB
            'blog_id' => ['nullable','integer', Rule::exists('blogs','id')],
            'draft_token' => ['nullable','string','max:100'],
            'is_inline' => ['sometimes','boolean'],
            'alt' => ['nullable','string','max:200'],
        ]);

        $path = $request->file('file')->store('images','public');

        $image = ImageGallery::create([
            'imageable_type' => Blog::class,
            'imageable_id'   => $data['blog_id'] ?? 0,
            'image_path'     => $path,
            'is_cover'       => false,
            'is_inline'      => $data['is_inline'] ?? true,
            'meta'           => ['alt' => $data['alt'] ?? null],
            'draft_token'    => $data['draft_token'] ?? null,
        ]);

        return response()->json([
            'id' => $image->id,
            'image_url' => $image->image_url,
        ], 201);
    }

    // Remove an uploaded image (if not used)
    public function destroy(ImageGallery $imageGallery)
    {
        Storage::disk('public')->delete($imageGallery->image_path);
        $imageGallery->delete();
        return response()->noContent();
    }
}
