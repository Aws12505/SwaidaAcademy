<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Scholarship;
use App\Models\Platform;
use App\Models\Category;
use App\Models\ImageGallery;
use App\Enums\Level;

class ScholarshipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $platforms = Platform::all();
        $categories = Category::all();

        $scholarships = [
            [
                'title' => [
                    'en' => 'Fulbright Foreign Student Program',
                    'ar' => 'برنامج فولبرايت للطلاب الأجانب'
                ],
                'description' => [
                    'en' => '<p>The Fulbright Program provides grants for international students to pursue graduate study in the United States.</p><p>Covers tuition, living expenses, airfare, and health insurance.</p>',
                    'ar' => '<p>يوفر برنامج فولبرايت منحًا للطلاب الدوليين لمتابعة الدراسات العليا في الولايات المتحدة.</p><p>يغطي الرسوم الدراسية ونفقات المعيشة وتذاكر الطيران والتأمين الصحي.</p>'
                ],
                'external_url' => 'https://foreign.fulbrightonline.org/',
                'duration' => '1-2 years',
                'level' => Level::EXPERT->value,
                'have_certificate' => true,
            ],
            [
                'title' => [
                    'en' => 'Chevening Scholarships',
                    'ar' => 'منح تشيفنينج'
                ],
                'description' => [
                    'en' => '<p>UK government\'s global scholarship programme for future leaders. Fully funded master\'s degree scholarships.</p><p>Includes airfare, accommodation, and monthly stipend.</p>',
                    'ar' => '<p>برنامج المنح الدراسية العالمي للحكومة البريطانية للقادة المستقبليين. منح دراسية ممولة بالكامل لدرجة الماجستير.</p><p>يشمل تذاكر الطيران والإقامة والراتب الشهري.</p>'
                ],
                'external_url' => 'https://www.chevening.org/',
                'duration' => '1 year',
                'level' => Level::EXPERT->value,
                'have_certificate' => true,
            ],
            [
                'title' => [
                    'en' => 'DAAD Scholarships for Germany',
                    'ar' => 'منح DAAD لألمانيا'
                ],
                'description' => [
                    'en' => '<p>German Academic Exchange Service offers scholarships for international students to study in Germany.</p><p>Various programs for bachelor\'s, master\'s, and PhD studies.</p>',
                    'ar' => '<p>تقدم هيئة التبادل الأكاديمي الألمانية منحًا للطلاب الدوليين للدراسة في ألمانيا.</p><p>برامج متنوعة للبكالوريوس والماجستير والدكتوراه.</p>'
                ],
                'external_url' => 'https://www.daad.de/en/',
                'duration' => 'Varies',
                'level' => Level::INTERMEDIATE->value,
                'have_certificate' => true,
            ],
            [
                'title' => [
                    'en' => 'Erasmus+ Programme',
                    'ar' => 'برنامج إيراسموس+'
                ],
                'description' => [
                    'en' => '<p>EU programme for education, training, youth and sport. Offers opportunities to study abroad in Europe.</p><p>Provides funding for tuition and living expenses.</p>',
                    'ar' => '<p>برنامج الاتحاد الأوروبي للتعليم والتدريب والشباب والرياضة. يقدم فرصًا للدراسة في الخارج في أوروبا.</p><p>يوفر تمويلًا للرسوم الدراسية ونفقات المعيشة.</p>'
                ],
                'external_url' => 'https://erasmus-plus.ec.europa.eu/',
                'duration' => '3-12 months',
                'level' => Level::INTERMEDIATE->value,
                'have_certificate' => false,
            ],
            [
                'title' => [
                    'en' => 'Rhodes Scholarships',
                    'ar' => 'منح رودس'
                ],
                'description' => [
                    'en' => '<p>Prestigious international postgraduate scholarship to study at the University of Oxford.</p><p>Fully funded including tuition, fees, and living stipend.</p>',
                    'ar' => '<p>منحة دراسات عليا دولية مرموقة للدراسة في جامعة أكسفورد.</p><p>ممولة بالكامل بما في ذلك الرسوم الدراسية والنفقات وراتب المعيشة.</p>'
                ],
                'external_url' => 'https://www.rhodeshouse.ox.ac.uk/',
                'duration' => '2-3 years',
                'level' => Level::EXPERT->value,
                'have_certificate' => true,
            ],
            [
                'title' => [
                    'en' => 'Gates Cambridge Scholarship',
                    'ar' => 'منحة غيتس كامبريدج'
                ],
                'description' => [
                    'en' => '<p>Full-cost scholarship for outstanding applicants from outside the UK to pursue postgraduate study at Cambridge.</p><p>Covers all costs including tuition and maintenance.</p>',
                    'ar' => '<p>منحة كاملة التكاليف للمتقدمين المتميزين من خارج المملكة المتحدة لمتابعة الدراسات العليا في كامبريدج.</p><p>تغطي جميع التكاليف بما في ذلك الرسوم الدراسية والصيانة.</p>'
                ],
                'external_url' => 'https://www.gatescambridge.org/',
                'duration' => '1-4 years',
                'level' => Level::EXPERT->value,
                'have_certificate' => true,
            ],
            [
                'title' => [
                    'en' => 'Japanese Government MEXT Scholarship',
                    'ar' => 'منحة الحكومة اليابانية MEXT'
                ],
                'description' => [
                    'en' => '<p>Japanese government scholarship for international students to study at Japanese universities.</p><p>Covers tuition, living allowance, and airfare.</p>',
                    'ar' => '<p>منحة الحكومة اليابانية للطلاب الدوليين للدراسة في الجامعات اليابانية.</p><p>تغطي الرسوم الدراسية وبدل المعيشة وتذاكر الطيران.</p>'
                ],
                'external_url' => 'https://www.studyinjapan.go.jp/en/',
                'duration' => '1-5 years',
                'level' => Level::INTERMEDIATE->value,
                'have_certificate' => true,
            ],
            [
                'title' => [
                    'en' => 'Australia Awards Scholarships',
                    'ar' => 'منح جوائز أستراليا'
                ],
                'description' => [
                    'en' => '<p>Long-term development scholarships for developing country students to undertake full-time undergraduate or postgraduate study in Australia.</p><p>Fully funded including travel and living expenses.</p>',
                    'ar' => '<p>منح تطوير طويلة الأجل لطلاب البلدان النامية للحصول على دراسات جامعية أو عليا بدوام كامل في أستراليا.</p><p>ممولة بالكامل بما في ذلك نفقات السفر والمعيشة.</p>'
                ],
                'external_url' => 'https://www.dfat.gov.au/people-to-people/australia-awards',
                'duration' => '2-4 years',
                'level' => Level::INTERMEDIATE->value,
                'have_certificate' => true,
            ],
        ];

        foreach ($scholarships as $scholarshipData) {
            $scholarship = Scholarship::create([
                'title' => $scholarshipData['title'],
                'description' => $scholarshipData['description'],
                'external_url' => $scholarshipData['external_url'],
                'duration' => $scholarshipData['duration'],
                'platform_id' => $platforms->random()->id,
                'category_id' => $categories->random()->id,
                'level' => $scholarshipData['level'],
                'have_certificate' => $scholarshipData['have_certificate'],
            ]);

            // Create a dummy image entry
            ImageGallery::create([
                'imageable_type' => Scholarship::class,
                'imageable_id' => $scholarship->id,
                'image_path' => 'images/placeholder.jpg',
                'is_cover' => true,
            ]);
        }
    }
}
