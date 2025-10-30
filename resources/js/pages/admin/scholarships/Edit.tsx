import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuillEditorPro from '@/components/QuillEditorPro';
import type { BreadcrumbItem, Scholarship, Platform, Category, LevelOption } from '@/types';
import { useState, FormEventHandler } from 'react';

interface EditScholarshipProps {
  scholarship: Scholarship & {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
  };
  platforms: Platform[];
  categories: Category[];
  levels: LevelOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Scholarships', href: '/admin/scholarships' },
  { title: 'Edit', href: '#' },
];

export default function EditScholarship({ scholarship, platforms, categories, levels }: EditScholarshipProps) {
  const [imageFiles, setImageFiles] = useState<Array<{ file: File; is_cover: boolean; preview: string }>>([]);

  const { data, setData, put, processing, errors } = useForm<{
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    external_url: string;
    duration: string;
    platform_id: string;
    category_id: string;
    have_certificate: boolean;
    level: string;
    images: Array<{ file: File; is_cover: boolean }>;
  }>({
    title: scholarship.title,
    description: scholarship.description,
    external_url: scholarship.external_url,
    duration: scholarship.duration || '',
    platform_id: scholarship.platform_id.toString(),
    category_id: scholarship.category_id.toString(),
    have_certificate: scholarship.have_certificate,
    level: scholarship.level,
    images: [],
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file, index) => ({
      file,
      is_cover: imageFiles.length === 0 && index === 0,
      preview: URL.createObjectURL(file),
    }));
    setImageFiles([...imageFiles, ...newImages]);
    setData('images', [...imageFiles, ...newImages]);
  };

  const removeImage = (index: number) => {
    const newImages = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newImages);
    setData('images', newImages);
  };

  const setCoverImage = (index: number) => {
    const newImages = imageFiles.map((img, i) => ({ ...img, is_cover: i === index }));
    setImageFiles(newImages);
    setData('images', newImages);
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    put(`/admin/scholarships/${scholarship.id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit: ${scholarship.title.en || 'Scholarship'}`} />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Edit Scholarship</h2>
                <p className="text-muted-foreground">Update scholarship information</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/admin/scholarships"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
              </Button>
            </div>

            <form onSubmit={submit} className="space-y-6">
              {scholarship.images && scholarship.images.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Current Images</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {scholarship.images.map((img) => (
                        <div key={img.id} className="relative aspect-video overflow-hidden rounded-lg border">
                          <img src={img.image_url} alt="Scholarship" className="h-full w-full object-cover" />
                          {img.is_cover && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                              Cover
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Same form fields as Create, but with data pre-filled */}
              <Card>
                <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {/* Copy all form fields from Create page */}
                  {/* Title, External URL, Platform, Category, Level, Duration, Certificate */}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Description *</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="en">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ar">العربية</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en">
                      <QuillEditorPro
                        value={data.description.en}
                        onChange={(content) => setData('description', { ...data.description, en: content })}
                        placeholder="Enter scholarship description in English..."
                        height="400px"
                      />
                    </TabsContent>
                    <TabsContent value="ar">
                      <QuillEditorPro
                        value={data.description.ar}
                        onChange={(content) => setData('description', { ...data.description, ar: content })}
                        placeholder="أدخل وصف المنحة بالعربية..."
                        height="400px"
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* New Images section same as Create */}

              <Separator />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild><Link href="/admin/scholarships">Cancel</Link></Button>
                <Button type="submit" disabled={processing}>{processing ? 'Updating...' : 'Update Scholarship'}</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
