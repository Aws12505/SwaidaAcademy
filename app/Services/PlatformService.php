<?php

namespace App\Services;

use App\Models\Platform;
use Illuminate\Database\Eloquent\Collection;

class PlatformService
{
    /**
     * Get all platforms with item counts
     */
    public function getAllPlatforms(): Collection
    {
        return Platform::withCount(['courses', 'scholarships'])->get();
    }

    /**
     * Get platform by ID with counts
     */
    public function getPlatformById(int $id): Platform
    {
        return Platform::withCount(['courses', 'scholarships'])->findOrFail($id);
    }

    public function createPlatform(array $data): Platform
    {
        return Platform::create($data);
    }

    public function updatePlatform(int $id, array $data): Platform
    {
        $platform = Platform::findOrFail($id);
        $platform->update($data);
        return $platform;
    }

    public function deletePlatform(int $id): bool
    {
        $platform = Platform::findOrFail($id);
        return $platform->delete();
    }
}
