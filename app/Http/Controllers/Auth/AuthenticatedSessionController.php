<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
public function create(Request $request): \Inertia\Response|\Illuminate\Http\RedirectResponse
{
    $locale = session('locale') ?? app()->getLocale() ?? 'en';

    if (auth()->check()) {
        return auth()->user()->is_admin
            ? redirect()->intended(route('admin.dashboard'))
            : redirect()->intended(route('landing', ['locale' => $locale]));
    }

    return \Inertia\Inertia::render('auth/Login', [
        'canResetPassword' => route('password.request') ? true : false,
        'status' => $request->session()->get('status'),
    ]);
}

public function store(Request $request): \Illuminate\Http\RedirectResponse
{
    $validated = $request->validate([
        'email'    => ['required', 'string', 'email'],
        'password' => ['required', 'string'],
        'remember' => ['nullable', 'boolean'],
    ]);

    if (!auth()->attempt(
        ['email' => $validated['email'], 'password' => $validated['password']],
        (bool)($validated['remember'] ?? false)
    )) {
        return back()->withErrors(['email' => __('auth.failed')])->onlyInput('email');
    }

    $request->session()->regenerate();

    $locale = session('locale') ?? app()->getLocale() ?? 'en';

    return auth()->user()->is_admin
        ? redirect()->intended(route('admin.dashboard'))
        : redirect()->intended(route('landing', ['locale' => $locale]));
}

public function destroy(Request $request): \Illuminate\Http\RedirectResponse
{
    auth()->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    $locale = session('locale') ?? app()->getLocale() ?? 'en';
    return redirect()->to("/{$locale}");
}

}
