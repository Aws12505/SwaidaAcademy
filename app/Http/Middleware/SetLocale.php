<?php

// app/Http/Middleware/SetLocale.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\URL;   // ← add this
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->route('locale');

        if ($locale && in_array($locale, ['en', 'ar'])) {
            App::setLocale($locale);
            session(['locale' => $locale]);
        } else {
            $locale = session('locale', 'en');
            App::setLocale($locale);
        }

        // ✅ Make Laravel auto-inject {locale} when calling route()
        URL::defaults(['locale' => $locale]);

        return $next($request);
    }
}
