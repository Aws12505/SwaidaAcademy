<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBlogRequest extends FormRequest
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
            'content' => 'sometimes|required|array',
            'content.en' => 'sometimes|required|string',
            'content.ar' => 'sometimes|required|string',
            'images' => 'nullable|array|max:10',
            'images.*.file' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'images.*.is_cover' => 'boolean',
        ];
    }
}
