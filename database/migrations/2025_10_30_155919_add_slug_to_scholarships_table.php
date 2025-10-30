<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('id');
        });

        $used = [];
        DB::table('scholarships')->orderBy('id')->chunkById(500, function ($rows) use (&$used) {
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

                $base = Str::slug($enTitle ?: 'scholarship');
                if ($base === '') $base = 'scholarship';

                $slug = $base;
                $i = 2;
                while (
                    in_array($slug, $used, true) ||
                    DB::table('scholarships')->where('slug', $slug)->where('id', '!=', $row->id)->exists()
                ) {
                    $slug = $base.'-'.$i++;
                }

                DB::table('scholarships')->where('id', $row->id)->update(['slug' => $slug]);
                $used[] = $slug;
            }
        });

        Schema::table('scholarships', function (Blueprint $table) {
            $table->unique('slug', 'scholarships_slug_unique');
        });

        // Optional NOT NULL (requires doctrine/dbal):
        // Schema::table('scholarships', function (Blueprint $table) {
        //     $table->string('slug')->nullable(false)->change();
        // });
    }

    public function down(): void
    {
        Schema::table('scholarships', function (Blueprint $table) {
            $table->dropUnique('scholarships_slug_unique');
            $table->dropColumn('slug');
        });
    }
};
