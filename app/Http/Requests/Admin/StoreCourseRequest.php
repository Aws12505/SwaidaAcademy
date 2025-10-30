<?php

namespace App\Http\Requests\Admin;

use App\Enums\Level;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|array',
            'title.en' => 'required|string|max:255',
            'title.ar' => 'required|string|max:255',
            'description' => 'required|array',
            'description.en' => 'required|string',
            'description.ar' => 'required|string',
            'external_url' => 'required|url|max:500',
            'duration' => 'nullable|string|max:100',
            'platform_id' => 'required|integer|exists:platforms,id',
            'category_id' => 'required|integer|exists:categories,id',
            'have_certificate' => 'required|boolean',
            'level' => ['required', Rule::enum(Level::class)],
            'images' => 'nullable|array|max:10',
            'images.*.file' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'images.*.is_cover' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.en.required' => 'English title is required.',
            'title.ar.required' => 'Arabic title is required.',
            'description.en.required' => 'English description is required.',
            'description.ar.required' => 'Arabic description is required.',
            'external_url.url' => 'Please provide a valid URL.',
            'platform_id.exists' => 'Selected platform does not exist.',
            'category_id.exists' => 'Selected category does not exist.',
            'level.required' => 'Level is required.',
            'images.*.file.image' => 'Each file must be an image.',
            'images.*.file.max' => 'Each image must not exceed 2MB.',
        ];
    }
}
