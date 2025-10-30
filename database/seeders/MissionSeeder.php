<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mission;

class MissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Mission::create([
            'content' => [
                'en' => '<p>Our mission is to democratize education by curating and presenting the best learning opportunities from around the world in one accessible platform.</p><p>We are committed to:</p><ul><li>Providing accurate and up-to-date information about courses and scholarships</li><li>Supporting learners at every stage of their educational journey</li><li>Connecting students with opportunities that match their goals and aspirations</li><li>Breaking down barriers to quality education</li><li>Fostering a global community of lifelong learners</li></ul>',
                'ar' => '<p>مهمتنا هي إضفاء الطابع الديمقراطي على التعليم من خلال تنظيم وتقديم أفضل فرص التعلم من جميع أنحاء العالم في منصة واحدة يسهل الوصول إليها.</p><p>نحن ملتزمون بـ:</p><ul><li>توفير معلومات دقيقة ومحدثة حول الدورات والمنح الدراسية</li><li>دعم المتعلمين في كل مرحلة من رحلتهم التعليمية</li><li>ربط الطلاب بالفرص التي تتناسب مع أهدافهم وتطلعاتهم</li><li>كسر الحواجز أمام التعليم الجيد</li><li>تعزيز مجتمع عالمي من المتعلمين مدى الحياة</li></ul>'
            ]
        ]);
    }
}
