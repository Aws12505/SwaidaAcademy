<?php

namespace App\Http\Requests\Admin;

use App\Enums\Level;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreScholarshipRequest extends FormRequest
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
}
