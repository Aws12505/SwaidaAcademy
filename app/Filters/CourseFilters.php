<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\App;

class CourseFilters
{
    /**
     * Apply all filters to the query
     */
    public function apply(Builder $query, array $filters): Builder
    {
        if (isset($filters['search']) && !empty($filters['search'])) {
            $this->search($query, $filters['search']);
        }

        if (isset($filters['platform_id']) && !empty($filters['platform_id'])) {
            $this->platform($query, $filters['platform_id']);
        }

        if (isset($filters['category_id']) && !empty($filters['category_id'])) {
            $this->category($query, $filters['category_id']);
        }

        if (isset($filters['level']) && !empty($filters['level'])) {
            $this->level($query, $filters['level']);
        }

        if (isset($filters['have_certificate'])) {
            $this->certificate($query, $filters['have_certificate']);
        }

        if (isset($filters['duration']) && !empty($filters['duration'])) {
            $this->duration($query, $filters['duration']);
        }

        if (isset($filters['sort_by']) && !empty($filters['sort_by'])) {
            $this->sort($query, $filters['sort_by'], $filters['sort_direction'] ?? 'asc');
        } else {
            $query->latest();
        }

        return $query;
    }

    /**
     * Search in title and description
     */
    protected function search(Builder $query, string $search): void
    {
        $locale = App::getLocale();
        
        $query->where(function ($q) use ($search, $locale) {
            $q->where("title->{$locale}", 'LIKE', "%{$search}%")
              ->orWhere("description->{$locale}", 'LIKE', "%{$search}%");
        });
    }

    /**
     * Filter by platform
     */
    protected function platform(Builder $query, int|array $platformId): void
    {
        if (is_array($platformId)) {
            $query->whereIn('platform_id', $platformId);
        } else {
            $query->where('platform_id', $platformId);
        }
    }

    /**
     * Filter by category
     */
    protected function category(Builder $query, int|array $categoryId): void
    {
        if (is_array($categoryId)) {
            $query->whereIn('category_id', $categoryId);
        } else {
            $query->where('category_id', $categoryId);
        }
    }

    /**
     * Filter by level
     */
    protected function level(Builder $query, string|array $level): void
    {
        if (is_array($level)) {
            $query->whereIn('level', $level);
        } else {
            $query->where('level', $level);
        }
    }

    /**
     * Filter by certificate availability
     */
    protected function certificate(Builder $query, bool|string $haveCertificate): void
    {
        $value = filter_var($haveCertificate, FILTER_VALIDATE_BOOLEAN);
        $query->where('have_certificate', $value);
    }

    /**
     * Filter by duration (search in duration string)
     */
    protected function duration(Builder $query, string $duration): void
    {
        $query->where('duration', 'LIKE', "%{$duration}%");
    }

    /**
     * Sort results
     */
    protected function sort(Builder $query, string $sortBy, string $direction = 'asc'): void
    {
        $allowedSorts = ['created_at', 'title', 'duration'];
        $direction = in_array($direction, ['asc', 'desc']) ? $direction : 'asc';

        if (in_array($sortBy, $allowedSorts)) {
            if ($sortBy === 'title') {
                $locale = App::getLocale();
                $query->orderByRaw("JSON_EXTRACT(title, '$.{$locale}') {$direction}");
            } else {
                $query->orderBy($sortBy, $direction);
            }
        }
    }
}
