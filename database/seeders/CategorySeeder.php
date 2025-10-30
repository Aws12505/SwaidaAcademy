<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => [
                    'en' => 'Computer Science',
                    'ar' => 'علوم الحاسوب'
                ]
            ],
            [
                'name' => [
                    'en' => 'Business',
                    'ar' => 'الأعمال'
                ]
            ],
            [
                'name' => [
                    'en' => 'Data Science',
                    'ar' => 'علم البيانات'
                ]
            ],
            [
                'name' => [
                    'en' => 'Web Development',
                    'ar' => 'تطوير الويب'
                ]
            ],
            [
                'name' => [
                    'en' => 'Mobile Development',
                    'ar' => 'تطوير تطبيقات الموبايل'
                ]
            ],
            [
                'name' => [
                    'en' => 'Marketing',
                    'ar' => 'التسويق'
                ]
            ],
            [
                'name' => [
                    'en' => 'Design',
                    'ar' => 'التصميم'
                ]
            ],
            [
                'name' => [
                    'en' => 'Artificial Intelligence',
                    'ar' => 'الذكاء الاصطناعي'
                ]
            ],
            [
                'name' => [
                    'en' => 'Cybersecurity',
                    'ar' => 'الأمن السيبراني'
                ]
            ],
            [
                'name' => [
                    'en' => 'Project Management',
                    'ar' => 'إدارة المشاريع'
                ]
            ],
            [
                'name' => [
                    'en' => 'Languages',
                    'ar' => 'اللغات'
                ]
            ],
            [
                'name' => [
                    'en' => 'Engineering',
                    'ar' => 'الهندسة'
                ]
            ],
            [
                'name' => [
                    'en' => 'Health & Medicine',
                    'ar' => 'الصحة والطب'
                ]
            ],
            [
                'name' => [
                    'en' => 'Mathematics',
                    'ar' => 'الرياضيات'
                ]
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
