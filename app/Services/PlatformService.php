<?php

namespace App\Services;

use App\Models\Platform;
use Illuminate\Database\Eloquent\Collection;

class PlatformService
{
    /**
     * Get all platforms
     */
    public function getAllPlatforms(): Collection
    {
        return Platform::all();
    }

    /**
     * Get platform by ID
     */
    public function getPlatformById(int $id): Platform
    {
        return Platform::findOrFail($id);
    }

    /**
     * Create new platform
     */
    public function createPlatform(array $data): Platform
    {
        return Platform::create($data);
    }

    /**
     * Update platform
     */
    public function updatePlatform(int $id, array $data): Platform
    {
        $platform = Platform::findOrFail($id);
        $platform->update($data);
        return $platform;
    }

    /**
     * Delete platform
     */
    public function deletePlatform(int $id): bool
    {
        $platform = Platform::findOrFail($id);
        return $platform->delete();
    }
}
