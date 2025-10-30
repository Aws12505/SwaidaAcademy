<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PlatformSeeder::class,
            CategorySeeder::class,
            CourseSeeder::class,
            ScholarshipSeeder::class,
            BlogSeeder::class,
            VisionSeeder::class,
            MissionSeeder::class,
            UserSeeder::class,
        ]);
    }
}
