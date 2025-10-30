<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vision;

class VisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Vision::create([
            'content' => [
                'en' => '<p>To become the leading global platform that empowers individuals to achieve their educational dreams by providing comprehensive access to quality courses and scholarship opportunities worldwide.</p><p>We envision a world where geographical and financial barriers no longer limit access to education, and where every learner has the tools and opportunities to reach their full potential.</p>',
                'ar' => '<p>أن نصبح المنصة العالمية الرائدة التي تمكّن الأفراد من تحقيق أحلامهم التعليمية من خلال توفير وصول شامل إلى دورات عالية الجودة وفرص المنح الدراسية في جميع أنحاء العالم.</p><p>نتصور عالمًا لا تحد فيه الحواجز الجغرافية والمالية من الوصول إلى التعليم، وحيث يمتلك كل متعلم الأدوات والفرص للوصول إلى إمكاناته الكاملة.</p>'
            ]
        ]);
    }
}
