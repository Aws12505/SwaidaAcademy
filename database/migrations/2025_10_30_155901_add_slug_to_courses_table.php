<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration {
    public function up(): void
    {
        // 1) Add slug (nullable first)
        Schema::table('courses', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('id');
        });

        // 2) Backfill unique slugs from English title
        $used = [];
        DB::table('courses')->orderBy('id')->chunkById(500, function ($rows) use (&$used) {
            foreach ($rows as $row) {
                $enTitle = null;
                $rawTitle = $row->title;

                if (is_string($rawTitle)) {
                    $decoded = json_decode($rawTitle, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        $enTitle = $decoded['en'] ?? null;
                    } else {
                        $enTitle = $rawTitle;
                    }
                }

                $base = Str::slug($enTitle ?: 'course');
                if ($base === '') $base = 'course';

                $slug = $base;
                $i = 2;
                while (
                    in_array($slug, $used, true) ||
                    DB::table('courses')->where('slug', $slug)->where('id', '!=', $row->id)->exists()
                ) {
                    $slug = $base.'-'.$i++;
                }

                DB::table('courses')->where('id', $row->id)->update(['slug' => $slug]);
                $used[] = $slug;
            }
        });

        // 3) Unique index (and optionally NOT NULL)
        Schema::table('courses', function (Blueprint $table) {
            $table->unique('slug', 'courses_slug_unique');
        });

        // Optional: enforce NOT NULL if you have doctrine/dbal
        // Schema::table('courses', function (Blueprint $table) {
        //     $table->string('slug')->nullable(false)->change();
        // });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropUnique('courses_slug_unique');
            $table->dropColumn('slug');
        });
    }
};
