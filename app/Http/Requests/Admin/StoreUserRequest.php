<?php

// app/Http/Requests/Admin/StoreUserRequest.php
namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // adjust to your policy
    }

    public function rules(): array
    {
        return [
            'name' => ['required','string','max:255'],
            'email' => ['required','string','lowercase','email','max:255','unique:'.User::class],
            'is_admin' => ['required','boolean'],
            // whatsapp_number required unless is_admin is true
            'whatsapp_number' => ['required_unless:is_admin,true','nullable','string','max:20'],
            'password' => ['required','confirmed', \Illuminate\Validation\Rules\Password::defaults()],
        ];
    }

    public function messages(): array
    {
        return [
            'whatsapp_number.required_unless' => 'WhatsApp is required for non-admin users.',
        ];
    }
}
