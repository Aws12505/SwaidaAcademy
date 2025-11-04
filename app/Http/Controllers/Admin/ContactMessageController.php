<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string)$request->get('search', ''));

        $messages = ContactMessage::query()
            ->when($search, function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('whatsapp_number', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        // shape data for frontend (consistent with your PaginatedData style)
        $mapped = [
            'data' => $messages->getCollection()->map(function ($m) {
                return [
                    'id' => $m->id,
                    'full_name' => $m->full_name,
                    'email' => $m->email,
                    'whatsapp_number' => $m->whatsapp_number,
                    'message' => $m->message,
                    'created_at' => $m->created_at,
                ];
            }),
            'current_page' => $messages->currentPage(),
            'last_page'    => $messages->lastPage(),
            'per_page'     => $messages->perPage(),
            'total'        => $messages->total(),
            'links'        => $messages->linkCollection(),
        ];

        return Inertia::render('admin/contacts/Index', [
            'messages' => $mapped,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function destroy(ContactMessage $contact_message)
    {
        $contact_message->delete();
        return back()->with('success', 'Message deleted.');
    }
}
