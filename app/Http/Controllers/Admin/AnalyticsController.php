<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Scholarship;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    /**
     * Dashboard: last 30 days counters
     */
    public function dashboard(Request $request): Response
    {
        $from = Carbon::now()->subDays(30);

        // Access presses in last 30 days
        $courseAccessCount = DB::table('course_user_accesses')
            ->where('created_at', '>=', $from)
            ->count();

        $scholarshipAccessCount = DB::table('scholarship_user_accesses')
            ->where('created_at', '>=', $from)
            ->count();

        // New users in last 30 days
        $newUsersCount = User::where('created_at', '>=', $from)->count();

        return Inertia::render('admin/analytics/Dashboard', [
            'stats' => [
                'from' => $from->toDateString(),
                'to'   => Carbon::now()->toDateString(),
                'course_accesses' => $courseAccessCount,
                'scholarship_accesses' => $scholarshipAccessCount,
                'new_users' => $newUsersCount,
            ],
        ]);
    }

    /**
     * Deep analytics with filters/sorting/pagination
     * Query params:
     *  - type: 'courses' | 'scholarships' | 'users' (default: 'courses')
     *  - q: string (search)
     *  - sort_by: string (default: created_at)
     *  - sort_dir: 'asc' | 'desc' (default: desc)
     *  - date_from, date_to: YYYY-MM-DD (optional)
     */
    public function index(Request $request): Response
    {
        $type     = $request->string('type')->lower()->toString() ?: 'courses';
        $q        = trim($request->string('q')->toString());
        $sortBy   = $request->input('sort_by', 'created_at');
        $sortDir  = $request->input('sort_dir', 'desc') === 'asc' ? 'asc' : 'desc';
        $dateFrom = $request->date('date_from');
        $dateTo   = $request->date('date_to');

        // normalize date_to to end of day if provided
        if ($dateTo) {
            $dateTo = Carbon::parse($dateTo)->endOfDay();
        }

        if ($type === 'courses') {
            // Join course presses with users and courses
            $query = DB::table('course_user_accesses as cua')
                ->join('users as u', 'u.id', '=', 'cua.user_id')
                ->join('courses as c', 'c.id', '=', 'cua.course_id')
                ->select([
                    'cua.id',
                    'cua.created_at',
                    'u.id as user_id',
                    'u.name as user_name',
                    'u.email as user_email',
                    'c.id as item_id',
                    DB::raw("JSON_UNQUOTE(JSON_EXTRACT(c.title, '$.\"en\"')) as title_en"),
                    DB::raw("JSON_UNQUOTE(JSON_EXTRACT(c.title, '$.\"ar\"')) as title_ar"),
                ]);

            if ($q) {
                $like = '%' . $q . '%';
                $query->where(function ($w) use ($like) {
                    $w->where('u.name', 'like', $like)
                      ->orWhere('u.email', 'like', $like)
                      ->orWhereRaw("JSON_EXTRACT(c.title, '$.\"en\"') like ?", [$like])
                      ->orWhereRaw("JSON_EXTRACT(c.title, '$.\"ar\"') like ?", [$like]);
                });
            }

            if ($dateFrom) $query->where('cua.created_at', '>=', Carbon::parse($dateFrom)->startOfDay());
            if ($dateTo)   $query->where('cua.created_at', '<=', $dateTo);

            // allow sorting by created_at, user_name, title_en
            $sortable = ['created_at' => 'cua.created_at', 'user_name' => 'u.name', 'title' => 'title_en'];
            $query->orderBy($sortable[$sortBy] ?? 'cua.created_at', $sortDir);

            $data = $query->paginate(20)->withQueryString();

            return Inertia::render('admin/analytics/Details', [
                'type' => 'courses',
                'items' => $data,
                'filters' => [
                    'q' => $q,
                    'sort_by' => $sortBy,
                    'sort_dir' => $sortDir,
                    'date_from' => $dateFrom?->toDateString(),
                    'date_to' => $dateTo?->toDateString(),
                ],
            ]);
        }

        if ($type === 'scholarships') {
            $query = DB::table('scholarship_user_accesses as sua')
                ->join('users as u', 'u.id', '=', 'sua.user_id')
                ->join('scholarships as s', 's.id', '=', 'sua.scholarship_id')
                ->select([
                    'sua.id',
                    'sua.created_at',
                    'u.id as user_id',
                    'u.name as user_name',
                    'u.email as user_email',
                    's.id as item_id',
                    DB::raw("JSON_UNQUOTE(JSON_EXTRACT(s.title, '$.\"en\"')) as title_en"),
                    DB::raw("JSON_UNQUOTE(JSON_EXTRACT(s.title, '$.\"ar\"')) as title_ar"),
                ]);

            if ($q) {
                $like = '%' . $q . '%';
                $query->where(function ($w) use ($like) {
                    $w->where('u.name', 'like', $like)
                      ->orWhere('u.email', 'like', $like)
                      ->orWhereRaw("JSON_EXTRACT(s.title, '$.\"en\"') like ?", [$like])
                      ->orWhereRaw("JSON_EXTRACT(s.title, '$.\"ar\"') like ?", [$like]);
                });
            }

            if ($dateFrom) $query->where('sua.created_at', '>=', Carbon::parse($dateFrom)->startOfDay());
            if ($dateTo)   $query->where('sua.created_at', '<=', $dateTo);

            $sortable = ['created_at' => 'sua.created_at', 'user_name' => 'u.name', 'title' => 'title_en'];
            $query->orderBy($sortable[$sortBy] ?? 'sua.created_at', $sortDir);

            $data = $query->paginate(20)->withQueryString();

            return Inertia::render('admin/analytics/Details', [
                'type' => 'scholarships',
                'items' => $data,
                'filters' => [
                    'q' => $q,
                    'sort_by' => $sortBy,
                    'sort_dir' => $sortDir,
                    'date_from' => $dateFrom?->toDateString(),
                    'date_to' => $dateTo?->toDateString(),
                ],
            ]);
        }

        // users (registrations) analytics
        $query = User::query()
            ->select(['id', 'name', 'email', 'created_at', 'is_admin']);

        if ($q) {
            $like = '%' . $q . '%';
            $query->where(function ($w) use ($like) {
                $w->where('name', 'like', $like)
                  ->orWhere('email', 'like', $like);
            });
        }
        if ($dateFrom) $query->where('created_at', '>=', Carbon::parse($dateFrom)->startOfDay());
        if ($dateTo)   $query->where('created_at', '<=', $dateTo);

        $sortable = ['created_at' => 'created_at', 'name' => 'name', 'email' => 'email'];
        $query->orderBy($sortable[$sortBy] ?? 'created_at', $sortDir);

        $data = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/analytics/Details', [
            'type' => 'users',
            'items' => $data,
            'filters' => [
                'q' => $q,
                'sort_by' => $sortBy,
                'sort_dir' => $sortDir,
                'date_from' => $dateFrom?->toDateString(),
                'date_to' => $dateTo?->toDateString(),
            ],
        ]);
    }
}
