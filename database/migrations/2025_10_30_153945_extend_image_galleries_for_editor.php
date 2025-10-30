<?php

// database/migrations/2025_01_01_000002_extend_image_galleries_for_editor.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('image_galleries', function (Blueprint $table) {
            $table->boolean('is_inline')->default(false)->after('is_cover');
            $table->json('meta')->nullable()->after('is_inline'); // e.g. alt, width, height
            $table->string('draft_token')->nullable()->index()->after('meta'); // for pre-create uploads
        });
    }
    public function down(): void {
        Schema::table('image_galleries', function (Blueprint $table) {
            $table->dropColumn(['is_inline','meta','draft_token']);
        });
    }
};
