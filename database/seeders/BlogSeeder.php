<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Blog;
use App\Models\ImageGallery;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $blogs = [
            [
                'title' => [
                    'en' => 'Top 10 Online Learning Platforms in 2025',
                    'ar' => 'أفضل 10 منصات تعليم إلكتروني في 2025'
                ],
                'content' => [
                    'en' => '<h2>Introduction</h2><p>Online learning has revolutionized education, making quality courses accessible to everyone worldwide. Here are the top 10 platforms that are leading the way in 2025.</p><h3>1. Coursera</h3><p>Coursera partners with top universities to offer world-class courses and degrees.</p><h3>2. edX</h3><p>Founded by Harvard and MIT, edX provides high-quality courses from leading institutions.</p><p>Continue reading to discover more platforms...</p>',
                    'ar' => '<h2>المقدمة</h2><p>أحدث التعليم عبر الإنترنت ثورة في التعليم، مما جعل الدورات عالية الجودة متاحة للجميع في جميع أنحاء العالم. إليك أفضل 10 منصات تقود الطريق في 2025.</p><h3>1. كورسيرا</h3><p>تتعاون كورسيرا مع أفضل الجامعات لتقديم دورات ودرجات علمية عالمية المستوى.</p><h3>2. إيدكس</h3><p>تأسست من قبل هارفارد و MIT، توفر edX دورات عالية الجودة من المؤسسات الرائدة.</p><p>تابع القراءة لاكتشاف المزيد من المنصات...</p>'
                ],
            ],
            [
                'title' => [
                    'en' => 'How to Choose the Right Scholarship',
                    'ar' => 'كيفية اختيار المنحة الدراسية المناسبة'
                ],
                'content' => [
                    'en' => '<h2>Finding Your Perfect Match</h2><p>Choosing the right scholarship can be overwhelming. Here are key factors to consider when applying for scholarships.</p><h3>1. Eligibility Requirements</h3><p>Make sure you meet all the criteria before applying.</p><h3>2. Financial Coverage</h3><p>Understand what expenses the scholarship covers.</p><h3>3. Application Deadlines</h3><p>Keep track of important dates and submit early.</p>',
                    'ar' => '<h2>العثور على المطابقة المثالية</h2><p>يمكن أن يكون اختيار المنحة الدراسية المناسبة أمرًا محيرًا. إليك العوامل الرئيسية التي يجب مراعاتها عند التقدم للمنح الدراسية.</p><h3>1. متطلبات الأهلية</h3><p>تأكد من استيفاء جميع المعايير قبل التقديم.</p><h3>2. التغطية المالية</h3><p>افهم ما هي النفقات التي تغطيها المنحة.</p><h3>3. مواعيد التقديم</h3><p>تتبع التواريخ المهمة وقدم مبكرًا.</p>'
                ],
            ],
            [
                'title' => [
                    'en' => 'Career Paths in Data Science',
                    'ar' => 'المسارات المهنية في علم البيانات'
                ],
                'content' => [
                    'en' => '<h2>Exploring Data Science Careers</h2><p>Data science is one of the fastest-growing fields. Let\'s explore the various career paths available.</p><h3>Data Analyst</h3><p>Entry-level position focusing on data interpretation and visualization.</p><h3>Data Scientist</h3><p>Advanced role involving machine learning and predictive modeling.</p><h3>ML Engineer</h3><p>Specializes in deploying machine learning models at scale.</p>',
                    'ar' => '<h2>استكشاف وظائف علم البيانات</h2><p>علم البيانات هو أحد أسرع المجالات نموًا. دعنا نستكشف المسارات المهنية المختلفة المتاحة.</p><h3>محلل بيانات</h3><p>منصب مبتدئ يركز على تفسير البيانات والتصور.</p><h3>عالم بيانات</h3><p>دور متقدم يتضمن التعلم الآلي والنمذجة التنبؤية.</p><h3>مهندس ML</h3><p>متخصص في نشر نماذج التعلم الآلي على نطاق واسع.</p>'
                ],
            ],
            [
                'title' => [
                    'en' => 'The Future of Remote Learning',
                    'ar' => 'مستقبل التعلم عن بعد'
                ],
                'content' => [
                    'en' => '<h2>Education Beyond Borders</h2><p>Remote learning has transformed how we acquire knowledge. Here\'s what the future holds.</p><h3>Virtual Reality Classrooms</h3><p>Immersive learning experiences through VR technology.</p><h3>AI-Powered Personalization</h3><p>Adaptive learning paths tailored to individual needs.</p><h3>Global Collaboration</h3><p>Students connecting and learning together across continents.</p>',
                    'ar' => '<h2>التعليم بلا حدود</h2><p>غيّر التعلم عن بعد الطريقة التي نكتسب بها المعرفة. إليك ما يخبئه المستقبل.</p><h3>فصول الواقع الافتراضي</h3><p>تجارب تعليمية غامرة من خلال تقنية الواقع الافتراضي.</p><h3>التخصيص المدعوم بالذكاء الاصطناعي</h3><p>مسارات تعليمية تكيفية مصممة حسب الاحتياجات الفردية.</p><h3>التعاون العالمي</h3><p>الطلاب يتواصلون ويتعلمون معًا عبر القارات.</p>'
                ],
            ],
            [
                'title' => [
                    'en' => 'Tips for Successful Online Learning',
                    'ar' => 'نصائح للتعلم الناجح عبر الإنترنت'
                ],
                'content' => [
                    'en' => '<h2>Maximizing Your Online Education</h2><p>Online learning requires discipline and strategy. Here are proven tips for success.</p><h3>Create a Dedicated Study Space</h3><p>Set up a comfortable, distraction-free environment.</p><h3>Establish a Routine</h3><p>Maintain consistent study hours to build momentum.</p><h3>Engage with the Community</h3><p>Participate in forums and discussions to enhance learning.</p>',
                    'ar' => '<h2>تعظيم تعليمك عبر الإنترنت</h2><p>يتطلب التعلم عبر الإنترنت الانضباط والاستراتيجية. إليك نصائح مثبتة للنجاح.</p><h3>إنشاء مساحة دراسية مخصصة</h3><p>قم بإعداد بيئة مريحة خالية من المشتتات.</p><h3>وضع روتين</h3><p>حافظ على ساعات دراسة ثابتة لبناء الزخم.</p><h3>التفاعل مع المجتمع</h3><p>شارك في المنتديات والمناقشات لتعزيز التعلم.</p>'
                ],
            ],
        ];

        foreach ($blogs as $blogData) {
            $blog = Blog::create($blogData);

            // Create a dummy image entry
            ImageGallery::create([
                'imageable_type' => Blog::class,
                'imageable_id' => $blog->id,
                'image_path' => 'images/placeholder.jpg',
                'is_cover' => true,
            ]);
        }
    }
}
