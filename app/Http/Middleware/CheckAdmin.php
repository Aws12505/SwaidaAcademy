<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Prefer the session locale; fallback to current app locale or 'en'
        $locale = session('locale') ?? app()->getLocale() ?? 'en';

        if (!auth()->check()) {
            // API/JSON → 401
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            // Web → redirect to localized login
            return redirect()->to("/{$locale}/login");
        }

        if (!auth()->user()->is_admin) {
            if ($request->expectsJson()) {
                abort(403, 'Forbidden');
            }
            // Web → redirect to localized landing
            return redirect()->to("/{$locale}");
        }

        return $next($request);
    }
}
