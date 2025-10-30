<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('category');
        
        return [
            'name' => 'sometimes|required|array',
            'name.en' => "sometimes|required|string|max:255|unique:categories,name->en,{$categoryId}",
            'name.ar' => "sometimes|required|string|max:255|unique:categories,name->ar,{$categoryId}",
        ];
    }
}
