<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Platform;

class PlatformSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $platforms = [
            [
                'name' => [
                    'en' => 'Coursera',
                    'ar' => 'كورسيرا'
                ]
            ],
            [
                'name' => [
                    'en' => 'edX',
                    'ar' => 'إيدكس'
                ]
            ],
            [
                'name' => [
                    'en' => 'Udemy',
                    'ar' => 'يوديمي'
                ]
            ],
            [
                'name' => [
                    'en' => 'LinkedIn Learning',
                    'ar' => 'لينكد إن للتعلم'
                ]
            ],
            [
                'name' => [
                    'en' => 'Khan Academy',
                    'ar' => 'أكاديمية خان'
                ]
            ],
            [
                'name' => [
                    'en' => 'FutureLearn',
                    'ar' => 'فيوتشر ليرن'
                ]
            ],
            [
                'name' => [
                    'en' => 'Udacity',
                    'ar' => 'يوداسيتي'
                ]
            ],
            [
                'name' => [
                    'en' => 'Harvard University',
                    'ar' => 'جامعة هارفارد'
                ]
            ],
            [
                'name' => [
                    'en' => 'MIT',
                    'ar' => 'معهد ماساتشوستس للتكنولوجيا'
                ]
            ],
            [
                'name' => [
                    'en' => 'Stanford University',
                    'ar' => 'جامعة ستانفورد'
                ]
            ],
            [
                'name' => [
                    'en' => 'British Council',
                    'ar' => 'المجلس الثقافي البريطاني'
                ]
            ],
            [
                'name' => [
                    'en' => 'Fulbright Program',
                    'ar' => 'برنامج فولبرايت'
                ]
            ],
        ];

        foreach ($platforms as $platform) {
            Platform::create($platform);
        }
    }
}
