<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MissionController extends Controller
{
    public function edit(): Response
    {
        $mission = Mission::first();
        
        if (!$mission) {
            // Create a default mission if none exists
            $mission = Mission::create([
                'content' => ['en' => '', 'ar' => '']
            ]);
        }

        $missionRaw = Mission::findOrFail($mission->id);

        return Inertia::render('admin/mission/Edit', [
            'mission' => [
                'id' => $missionRaw->id,
                'content' => json_decode($missionRaw->getAttributes()['content'], true),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'content.en' => 'required|string',
            'content.ar' => 'required|string',
        ]);

        $mission = Mission::first();

        if (!$mission) {
            Mission::create([
                'content' => $request->input('content')
            ]);
        } else {
            $mission->update([
                'content' => $request->input('content')
            ]);
        }

        return redirect()
            ->route('admin.mission.edit')
            ->with('success', 'Mission updated successfully.');
    }
}
