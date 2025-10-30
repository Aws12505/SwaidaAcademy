<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlatformRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $platformId = $this->route('platform');
        
        return [
            'name' => 'sometimes|required|array',
            'name.en' => "sometimes|required|string|max:255|unique:platforms,name->en,{$platformId}",
            'name.ar' => "sometimes|required|string|max:255|unique:platforms,name->ar,{$platformId}",
        ];
    }
}
