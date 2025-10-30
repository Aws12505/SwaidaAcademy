<?php

// app/Http/Requests/Admin/UpdateUserRequest.php
namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\User;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // adjust to your policy
    }

    public function rules(): array
    {
        $id = (int) $this->route('user');

        return [
            'name' => ['required','string','max:255'],
            'email' => [
                'required','string','lowercase','email','max:255',
                Rule::unique(User::class)->ignore($id),
            ],
            'is_admin' => ['required','boolean'],
            // required unless is_admin is true
            'whatsapp_number' => ['required_unless:is_admin,true','nullable','string','max:20'],
            // Password optional on update
            'password' => ['nullable','confirmed', \Illuminate\Validation\Rules\Password::defaults()],
        ];
    }

    public function messages(): array
    {
        return [
            'whatsapp_number.required_unless' => 'WhatsApp is required for non-admin users.',
        ];
    }
}
