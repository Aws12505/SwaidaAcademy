<?php

// database/migrations/2025_01_01_000001_create_course_user_accesses_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('course_user_accesses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['course_id', 'user_id']); // prevent duplicates
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_user_accesses');
    }
};
