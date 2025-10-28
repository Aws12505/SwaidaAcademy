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
    /**
     * Show the login page.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->intended(route('dashboard'));
        }

        return Inertia::render('auth/Login', [
            'canResetPassword' => route('password.request') ? true : false,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle login (validation inside the controller).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);

        $credentials = [
            'email'    => $validated['email'],
            'password' => $validated['password'],
        ];

        if (! Auth::attempt($credentials, (bool)($validated['remember'] ?? false))) {
            return back()
                ->withErrors(['email' => __('auth.failed')])
                ->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Logout.
     */
    public function destroy(Request $request): RedirectResponse
    {
        if (Auth::check()) {
            Auth::logout();
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home'); // or '/'
    }
}
