<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name'        => ['required','string','max:120'],
            'whatsapp_number'  => ['required','string','max:50'],
            'email'            => ['nullable','email','max:255'],
            'message'          => ['required','string','max:2000'],
        ];
    }
}
