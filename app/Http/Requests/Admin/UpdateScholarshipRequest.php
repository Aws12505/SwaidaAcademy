<?php

namespace App\Http\Requests\Admin;

use App\Enums\Level;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateScholarshipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|array',
            'title.en' => 'sometimes|required|string|max:255',
            'title.ar' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|array',
            'description.en' => 'sometimes|required|string',
            'description.ar' => 'sometimes|required|string',
            'external_url' => 'sometimes|required|url|max:500',
            'duration' => 'nullable|string|max:100',
            'platform_id' => 'sometimes|required|integer|exists:platforms,id',
            'category_id' => 'sometimes|required|integer|exists:categories,id',
            'have_certificate' => 'sometimes|required|boolean',
            'level' => ['sometimes', 'required', Rule::enum(Level::class)],
            'images' => 'nullable|array|max:10',
            'images.*.file' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'images.*.is_cover' => 'boolean',
        ];
    }
}
