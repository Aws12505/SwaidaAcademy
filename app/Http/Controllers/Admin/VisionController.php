<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vision;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VisionController extends Controller
{
    public function edit(): Response
    {
        $vision = Vision::first();
        
        if (!$vision) {
            // Create a default vision if none exists
            $vision = Vision::create([
                'content' => json_encode(['en' => '', 'ar' => ''])
            ]);
        }

        $visionRaw = Vision::findOrFail($vision->id);

        return Inertia::render('admin/vision/Edit', [
            'vision' => [
                'id' => $visionRaw->id,
                'content' => json_decode($visionRaw->getAttributes()['content'], true),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'content.en' => 'required|string',
            'content.ar' => 'required|string',
        ]);

        $vision = Vision::first();

        if (!$vision) {
            Vision::create([
                'content' => json_encode($request->input('content'))
            ]);
        } else {
            $vision->update([
                'content' => json_encode($request->input('content'))
            ]);
        }

        return redirect()
            ->route('admin.vision.edit')
            ->with('success', 'Vision updated successfully.');
    }
}
