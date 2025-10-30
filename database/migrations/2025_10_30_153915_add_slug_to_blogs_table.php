<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration {
    public function up(): void
    {
        // 1) Add column (nullable for now so we can backfill)
        Schema::table('blogs', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('id');
        });

        // 2) Backfill slugs for existing rows
        //    - Use English title when available (title stored as JSON)
        //    - Ensure uniqueness by appending -2, -3, ...
        $used = [];

        DB::table('blogs')->orderBy('id')->chunkById(500, function ($rows) use (&$used) {
            foreach ($rows as $row) {
                // Title can be a JSON string (Spatie translatable). Safely parse:
                $enTitle = null;
                $rawTitle = $row->title;

                if (is_string($rawTitle)) {
                    $decoded = json_decode($rawTitle, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        $enTitle = $decoded['en'] ?? null;
                    } else {
                        // If not JSON (edge case), treat as plain string
                        $enTitle = $rawTitle;
                    }
                }

                $base = Str::slug($enTitle ?: 'blog');
                if ($base === '') {
                    $base = 'blog';
                }

                $slug = $base;
                $i = 2;

                // Avoid duplicates across this run + DB (in case of partial backfills)
                while (
                    in_array($slug, $used, true) ||
                    DB::table('blogs')->where('slug', $slug)->where('id', '!=', $row->id)->exists()
                ) {
                    $slug = $base.'-'.$i++;
                }

                DB::table('blogs')->where('id', $row->id)->update(['slug' => $slug]);
                $used[] = $slug;
            }
        });

        // 3) Add unique index
        Schema::table('blogs', function (Blueprint $table) {
            $table->unique('slug', 'blogs_slug_unique');
        });

        // 4) (Optional) Make NOT NULL.
        //     Requires doctrine/dbal for ->change(). If you have it installed, uncomment:
        // Schema::table('blogs', function (Blueprint $table) {
        //     $table->string('slug')->nullable(false)->change();
        // });
    }

    public function down(): void
    {
        // Drop unique + column
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropUnique('blogs_slug_unique');
            $table->dropColumn('slug');
        });
    }
};
