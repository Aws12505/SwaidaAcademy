<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ScholarshipController;
use App\Http\Controllers\BlogController;

// Localized Routes for Frontend
Route::prefix('{locale}')->where(['locale' => 'en|ar'])
    ->middleware('set.locale')
    ->group(function () {
                Route::middleware('auth')->group(function () {
        Route::post('/courses/{course}/access', [App\Http\Controllers\Admin\UserController::class, 'pressCourseAccess'])
            ->name('courses.access');

        Route::post('/scholarships/{scholarship}/access', [App\Http\Controllers\Admin\UserController::class, 'pressScholarshipAccess'])
            ->name('scholarships.access');
        });
        // Landing Page
        Route::get('/', [LandingController::class, 'index'])->name('landing');
        
        // Global Search
        Route::get('/search', [LandingController::class, 'search'])->name('search');
        
        // Courses
        Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
Route::get('/courses/{course:slug}', [CourseController::class, 'show'])
    ->name('courses.show');        
        // Scholarships
        Route::get('/scholarships', [ScholarshipController::class, 'index'])->name('scholarships.index');
Route::get('/scholarships/{scholarship:slug}', [ScholarshipController::class, 'show'])
    ->name('scholarships.show');
        
        // Blogs
        Route::get('/blogs', [BlogController::class, 'index'])->name('blogs.index');
        Route::get('/blogs/{blog:slug}', [BlogController::class, 'show'])
            ->name('blogs.show');        
        // Auth Routes
        Route::middleware(['set.locale','guest'])->group(function () {
            Route::get('/login', function () {
                return inertia('auth/Login');
            })->name('login');
            
            Route::get('/register', function () {
                return inertia('auth/Register');
            })->name('register');
        });
    });

// Auth Actions (without locale)
Route::post('/login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store'])->middleware('set.locale');
Route::post('/register', [App\Http\Controllers\Auth\RegisteredUserController::class, 'store'])->middleware('set.locale');
Route::post('/logout', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])
    ->middleware(['set.locale','auth']);

// Admin Routes (No locale prefix)
Route::prefix('admin')->name('admin.')->middleware(['set.locale','auth','admin'])->group(function () {
    
        Route::get('/dashboard', [\App\Http\Controllers\Admin\AnalyticsController::class, 'dashboard'])
        ->name('dashboard');

    // Deep analytics
    Route::get('/analytics', [\App\Http\Controllers\Admin\AnalyticsController::class, 'index'])
        ->name('analytics.index');


    // Users
    Route::resource('users', App\Http\Controllers\Admin\UserController::class);

    Route::post('/courses/{course}/update', [\App\Http\Controllers\Admin\CourseController::class, 'update'])
    ->name('courses.update.post');

    // Courses
    Route::resource('courses', App\Http\Controllers\Admin\CourseController::class)->except('update');
    
    Route::post('/scholarships/{scholarship}/update', [\App\Http\Controllers\Admin\ScholarshipController::class, 'update'])
    ->name('scholarships.update.post');

    // Scholarships
    Route::resource('scholarships', App\Http\Controllers\Admin\ScholarshipController::class)->except('update');
    
    // Blogs
    // routes/web.php (inside the admin group)
Route::post('/blogs/{blog}/update', [\App\Http\Controllers\Admin\BlogController::class, 'update'])
    ->name('blogs.update.post');

    Route::resource('blogs', App\Http\Controllers\Admin\BlogController::class)->except('update');
    
    // Platforms
    Route::resource('platforms', App\Http\Controllers\Admin\PlatformController::class);
    
    // Categories
    Route::resource('categories', App\Http\Controllers\Admin\CategoryController::class);
    
    // Vision
    Route::get('/vision/edit', [App\Http\Controllers\Admin\VisionController::class, 'edit'])->name('vision.edit');
    Route::put('/vision', [App\Http\Controllers\Admin\VisionController::class, 'update'])->name('vision.update');
    
    // Mission
    Route::get('/mission/edit', [App\Http\Controllers\Admin\MissionController::class, 'edit'])->name('mission.edit');
    Route::put('/mission', [App\Http\Controllers\Admin\MissionController::class, 'update'])->name('mission.update');

        Route::post('/uploads/images', [\App\Http\Controllers\Admin\UploadController::class, 'store'])
        ->name('uploads.images.store'); // returns {id, image_url}
    Route::get('/uploads/images', [\App\Http\Controllers\Admin\UploadController::class, 'index'])
        ->name('uploads.images.index'); // list for gallery dialog
    Route::delete('/uploads/images/{imageGallery}', [\App\Http\Controllers\Admin\UploadController::class, 'destroy'])
        ->name('uploads.images.destroy');
});

// Default redirect to English
Route::get('/', function () {
    return redirect('/en');
});


require __DIR__.'/settings.php';
