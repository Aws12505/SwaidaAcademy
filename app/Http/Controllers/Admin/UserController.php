<?php

// app/Http/Controllers/Admin/UserController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Models\{Course, Scholarship};
class UserController extends Controller
{
    public function __construct(protected UserService $userService) {}

    public function index(Request $request): Response
    {
        $users = $this->userService->getAllUsers([
            'search' => $request->query('search'),
        ], 20);

        return Inertia::render('admin/users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $request->query('search', ''),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/Create');
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->userService->createUser($request->validated());

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    public function show(string $id): Response
    {
        $user = User::findOrFail((int)$id);

        return Inertia::render('admin/users/Show', [
            'user' => $user,
        ]);
    }

    public function edit(string $id): Response
    {
        $user = User::findOrFail((int)$id);

        return Inertia::render('admin/users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(UpdateUserRequest $request, string $id): RedirectResponse
    {
        $this->userService->updateUser((int)$id, $request->validated());

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $this->userService->deleteUser((int)$id);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

public function pressCourseAccess(Request $request,string $locale, $course): RedirectResponse
{
    $user = $request->user();
    if (!$user) {
        abort(403, 'Forbidden');
    }
    else if ($user->is_admin){
       return back(); 
    }

    // Idempotent pivot attach
    $user->accessedCourses()->syncWithoutDetaching([$course]);

    // back to the same page (or you can return 204 in JSON if calling via XHR)
    return back();
}

public function pressScholarshipAccess(Request $request,string $locale, $scholarship): RedirectResponse
{
    $user = $request->user();
    if (!$user) {
        abort(403, 'Forbidden');
    }
    else if ($user->is_admin){
       return back(); 
    }

    $user->accessedScholarships()->syncWithoutDetaching([$scholarship]);

    return back();
}
}
