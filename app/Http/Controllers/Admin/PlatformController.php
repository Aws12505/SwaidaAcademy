<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\PlatformService;
use App\Http\Requests\Admin\StorePlatformRequest;
use App\Http\Requests\Admin\UpdatePlatformRequest;
use App\Models\Platform;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PlatformController extends Controller
{
    public function __construct(protected PlatformService $platformService) {}

    public function index(): Response
    {
        return Inertia::render('admin/platforms/Index', [
            'platforms' => $this->platformService->getAllPlatforms(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/platforms/Create');
    }

    public function store(StorePlatformRequest $request): RedirectResponse
    {
        $this->platformService->createPlatform($request->validated());
        return redirect()->route('admin.platforms.index')->with('success', 'Platform created successfully.');
    }

    public function show(string $id): Response
    {
        $platformRaw = Platform::findOrFail((int)$id);

        return Inertia::render('admin/platforms/Show', [
            'platform' => [
                'id' => $platformRaw->id,
                'name' => json_decode($platformRaw->getAttributes()['name'], true),
            ],
        ]);
    }

    public function edit(string $id): Response
    {
        $platformRaw = Platform::findOrFail((int)$id);

        return Inertia::render('admin/platforms/Edit', [
            'platform' => [
                'id' => $platformRaw->id,
                'name' => json_decode($platformRaw->getAttributes()['name'], true),
            ],
        ]);
    }

    public function update(UpdatePlatformRequest $request, string $id): RedirectResponse
    {
        $this->platformService->updatePlatform((int)$id, $request->validated());
        return redirect()->route('admin.platforms.index')->with('success', 'Platform updated successfully.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->platformService->deletePlatform((int)$id);
        return redirect()->route('admin.platforms.index')->with('success', 'Platform deleted successfully.');
    }
}
