<?php

// app/Services/UserService.php
namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function getAllUsers(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = User::query()->latest();

        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $query->where(fn ($q) => $q
                ->where('name', 'like', "%$s%")
                ->orWhere('email', 'like', "%$s%")
                ->orWhere('whatsapp_number', 'like', "%$s%"));
        }

        return $query->paginate($perPage)->withQueryString();
        // Optionally ->through(...) to shape fields for Inertia
    }

    public function createUser(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'whatsapp_number' => $data['whatsapp_number'] ?? null,
            'is_admin' => (bool)($data['is_admin'] ?? false),
            'password' => Hash::make($data['password']),
        ]);
    }

    public function updateUser(int $id, array $data): User
    {
        $user = User::findOrFail($id);
        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
            'whatsapp_number' => $data['whatsapp_number'] ?? null,
            'is_admin' => (bool)($data['is_admin'] ?? false),
        ]);

        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return $user;
    }

    public function deleteUser(int $id): void
    {
        User::findOrFail($id)->delete();
    }
}
