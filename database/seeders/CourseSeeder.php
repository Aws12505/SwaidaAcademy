<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Platform;
use App\Models\Category;
use App\Models\ImageGallery;
use App\Enums\Level;
use Illuminate\Support\Facades\Storage;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $platforms = Platform::all();
        $categories = Category::all();

        // Make sure images directory exists
        Storage::disk('public')->makeDirectory('images');

        $courses = [
            [
                'title' => [
                    'en' => 'Introduction to Computer Science',
                    'ar' => 'مقدمة في علوم الحاسوب'
                ],
                'description' => [
                    'en' => '<p>This course introduces the fundamental concepts of computer science and programming. Learn the basics of algorithms, data structures, and problem-solving techniques.</p><p>Perfect for beginners looking to start their journey in tech.</p>',
                    'ar' => '<p>تقدم هذه الدورة المفاهيم الأساسية لعلوم الحاسوب والبرمجة. تعلم أساسيات الخوارزميات وهياكل البيانات وتقنيات حل المشكلات.</p><p>مثالية للمبتدئين الذين يتطلعون لبدء رحلتهم في التكنولوجيا.</p>'
                ],
                'external_url' => 'https://www.coursera.org/learn/cs50',
                'duration' => '12 weeks',
                'level' => Level::BEGINNER->value,
                'have_certificate' => true,
            ],
            [
                'title' => [
                    'en' => 'Full Stack Web Development',
                    'ar' => 'تطوير الويب الشامل'
                ],
                'description' => [
                    'en' => '<p>Master both frontend and backend web development. Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB.</p><p>Build real-world applications and deploy them to production.</p>',
                    'ar' => '<p>أتقن تطوير الواجهة الأمامية والخلفية للويب. تعلم HTML و CSS و JavaScript و React و Node.js و MongoDB.</p><p>قم ببناء تطبيقات حقيقية ونشرها على الإنترنت.</p>'
                ],
                'external_url' => 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
                'duration' => '54 hours',
                'level' => Level::INTERMEDIATE->value,
                'have_certificate' => true,
            ],
            [
                'title' => [
                    'en' => 'Machine Learning Specialization',
                    'ar' => 'تخصص التعلم الآلي'
                ],
                'description' => [
                    'en' => '<p>Learn the fundamentals of machine learning from Andrew Ng. Cover supervised learning, unsupervised learning, and best practices in ML.</p><p>Includes hands-on projects using Python and popular ML libraries.</p>',
                    'ar' => '<p>تعلم أساسيات التعلم الآلي من أندرو نج. تغطي التعلم الخاضع للإشراف والتعلم غير الخاضع للإشراف وأفضل الممارسات في ML.</p><p>يتضمن مشاريع عملية باستخدام Python ومكتبات ML الشائعة.</p>'
                ],
                'external_url' => 'https://www.coursera.org/specializations/machine-learning-introduction',
                'duration' => '3 months',
                'level' => Level::INTERMEDIATE->value,
                'have_certificate' => true,
            ],
            [
                'title' => [
                    'en' => 'Advanced React Patterns',
                    'ar' => 'أنماط React المتقدمة'
                ],
                'description' => [
                    'en' => '<p>Deep dive into advanced React concepts and patterns. Learn hooks, context, performance optimization, and modern state management.</p><p>Build scalable and maintainable React applications.</p>',
                    'ar' => '<p>غوص عميق في مفاهيم وأنماط React المتقدمة. تعلم الخطافات والسياق وتحسين الأداء وإدارة الحالة الحديثة.</p><p>قم ببناء تطبيقات React قابلة للتطوير وسهلة الصيانة.</p>'
                ],
                'external_url' => 'https://www.udemy.com/course/react-the-complete-guide/',
                'duration' => '40 hours',
                'level' => Level::EXPERT->value,
                'have_certificate' => true,
            ],
            [
                'title' => [
                    'en' => 'Digital Marketing Fundamentals',
                    'ar' => 'أساسيات التسويق الرقمي'
                ],
                'description' => [
                    'en' => '<p>Learn the core concepts of digital marketing including SEO, social media marketing, email marketing, and analytics.</p><p>Create effective marketing strategies for online businesses.</p>',
                    'ar' => '<p>تعلم المفاهيم الأساسية للتسويق الرقمي بما في ذلك SEO والتسويق عبر وسائل التواصل الاجتماعي والتسويق عبر البريد الإلكتروني والتحليلات.</p><p>أنشئ استراتيجيات تسويقية فعالة للأعمال التجارية عبر الإنترنت.</p>'
                ],
                'external_url' => 'https://www.coursera.org/specializations/digital-marketing',
                'duration' => '6 months',
                'level' => Level::BEGINNER->value,
                'have_certificate' => true,
            ],
            [
                'title' => [
                    'en' => 'Python for Data Science',
                    'ar' => 'بايثون لعلم البيانات'
                ],
                'description' => [
                    'en' => '<p>Master Python programming for data analysis and visualization. Learn pandas, NumPy, matplotlib, and scikit-learn.</p><p>Work with real datasets and build predictive models.</p>',
                    'ar' => '<p>أتقن برمجة Python لتحليل البيانات والتصور. تعلم pandas و NumPy و matplotlib و scikit-learn.</p><p>اعمل مع مجموعات البيانات الحقيقية وقم ببناء نماذج تنبؤية.</p>'
                ],
                'external_url' => 'https://www.edx.org/professional-certificate/python-data-science',
                'duration' => '5 months',
                'level' => Level::INTERMEDIATE->value,
                'have_certificate' => true,
            ],
            [
                'title' => [
                    'en' => 'UI/UX Design Bootcamp',
                    'ar' => 'معسكر تصميم واجهة وتجربة المستخدم'
                ],
                'description' => [
                    'en' => '<p>Learn user interface and user experience design from scratch. Master Figma, design thinking, wireframing, and prototyping.</p><p>Build a professional design portfolio.</p>',
                    'ar' => '<p>تعلم تصميم واجهة المستخدم وتجربة المستخدم من الصفر. أتقن Figma والتفكير التصميمي والإطارات السلكية والنماذج الأولية.</p><p>قم ببناء محفظة تصميم احترافية.</p>'
                ],
                'external_url' => 'https://www.udemy.com/course/ui-ux-design-bootcamp/',
                'duration' => '32 hours',
                'level' => Level::BEGINNER->value,
                'have_certificate' => false,
            ],
            [
                'title' => [
                    'en' => 'Cybersecurity Essentials',
                    'ar' => 'أساسيات الأمن السيبراني'
                ],
                'description' => [
                    'en' => '<p>Understand the fundamentals of cybersecurity, including network security, cryptography, and ethical hacking.</p><p>Learn to protect systems and data from cyber threats.</p>',
                    'ar' => '<p>افهم أساسيات الأمن السيبراني، بما في ذلك أمن الشبكات والتشفير والقرصنة الأخلاقية.</p><p>تعلم كيفية حماية الأنظمة والبيانات من التهديدات السيبرانية.</p>'
                ],
                'external_url' => 'https://www.coursera.org/specializations/cyber-security',
                'duration' => '8 months',
                'level' => Level::INTERMEDIATE->value,
                'have_certificate' => true,
            ],
            [
                'title' => [
                    'en' => 'Mobile App Development with Flutter',
                    'ar' => 'تطوير تطبيقات الموبايل باستخدام Flutter'
                ],
                'description' => [
                    'en' => '<p>Build beautiful native mobile apps for iOS and Android using Flutter and Dart.</p><p>Learn state management, navigation, and API integration.</p>',
                    'ar' => '<p>قم ببناء تطبيقات موبايل أصلية جميلة لنظامي iOS و Android باستخدام Flutter و Dart.</p><p>تعلم إدارة الحالة والتنقل وتكامل API.</p>'
                ],
                'external_url' => 'https://www.udemy.com/course/flutter-bootcamp-with-dart/',
                'duration' => '28 hours',
                'level' => Level::BEGINNER->value,
                'have_certificate' => true,
            ],
            [
                'title' => [
                    'en' => 'Cloud Computing with AWS',
                    'ar' => 'الحوسبة السحابية مع AWS'
                ],
                'description' => [
                    'en' => '<p>Master Amazon Web Services (AWS) cloud platform. Learn EC2, S3, Lambda, RDS, and more.</p><p>Prepare for AWS certification exams.</p>',
                    'ar' => '<p>أتقن منصة الحوسبة السحابية Amazon Web Services (AWS). تعلم EC2 و S3 و Lambda و RDS والمزيد.</p><p>استعد لامتحانات شهادة AWS.</p>'
                ],
                'external_url' => 'https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect',
                'duration' => '6 months',
                'level' => Level::EXPERT->value,
                'have_certificate' => true,
            ],
        ];

        foreach ($courses as $courseData) {
            $course = Course::create([
                'title' => $courseData['title'],
                'description' => $courseData['description'],
                'external_url' => $courseData['external_url'],
                'duration' => $courseData['duration'],
                'platform_id' => $platforms->random()->id,
                'category_id' => $categories->random()->id,
                'level' => $courseData['level'],
                'have_certificate' => $courseData['have_certificate'],
            ]);

            // Create a dummy image entry (you can replace with actual images)
            ImageGallery::create([
                'imageable_type' => Course::class,
                'imageable_id' => $course->id,
                'image_path' => 'images/placeholder.jpg',
                'is_cover' => true,
            ]);
        }
    }
}
