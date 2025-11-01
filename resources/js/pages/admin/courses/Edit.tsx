import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuillEditorPro from '@/components/QuillEditorPro';
import type { BreadcrumbItem } from '@/types';
import type { Course, Platform, Category, LevelOption } from '@/types';
import { useState, FormEventHandler } from 'react';

interface EditCourseProps {
  course: Course & {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
  };
  platforms: Platform[];
  categories: Category[];
  levels: LevelOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Courses', href: '/admin/courses' },
  { title: 'Edit', href: '#' },
];

export default function EditCourse({ course, platforms, categories, levels }: EditCourseProps) {
  const [imageFiles, setImageFiles] = useState<Array<{ file: File; is_cover: boolean; preview: string }>>([]);

  const { data, setData, post, processing, errors } = useForm<{
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    external_url: string;
    duration: string;
    platform_id: string;
    category_id: string;
    have_certificate: boolean;
    level: string;
    images?: Array<{ file: File; is_cover: boolean }>;
  }>({
    title: course.title,
    description: course.description,
    external_url: course.external_url,
    duration: course.duration || '',
    platform_id: course.platform_id.toString(),
    category_id: course.category_id.toString(),
    have_certificate: course.have_certificate,
    level: course.level,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImages = files.map((file, idx) => ({
      file,
      is_cover: imageFiles.length === 0 && idx === 0,
      preview: URL.createObjectURL(file),
    }));
    const combined = [...imageFiles, ...newImages];
    setImageFiles(combined);

    // Only send file + is_cover (no preview)
    setData('images', combined.map(({ file, is_cover }) => ({ file, is_cover })));
  };

  const removeImage = (index: number) => {
    const next = imageFiles.filter((_, i) => i !== index);
    setImageFiles(next);
    if (next.length) {
      setData('images', next.map(({ file, is_cover }) => ({ file, is_cover })));
    } else {
      setData('images', undefined as any);
    }
  };

  const setCoverImage = (index: number) => {
    const next = imageFiles.map((img, i) => ({ ...img, is_cover: i === index }));
    setImageFiles(next);
    if (next.length) {
      setData('images', next.map(({ file, is_cover }) => ({ file, is_cover })));
    }
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    // If no new images picked, don’t send images field at all
    if (imageFiles.length === 0) {
      setData('images', undefined as any);
    }

    // POST to a custom update endpoint that accepts multipart/form-data
    post(`/admin/courses/${course.id}/update`, {
      forceFormData: true,
      preserveScroll: true,
      onError: (errs) => console.error('Update errors:', errs),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit: ${course.title.en || 'Course'}`} />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Edit Course</h2>
                <p className="text-muted-foreground">Update course information</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/admin/courses">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
            </div>

            <form onSubmit={submit} className="space-y-6">
              {/* Current Images */}
              {course.images && course.images.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Current Images</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {course.images.map((img) => (
                        <div key={img.id} className="relative aspect-video overflow-hidden rounded-lg border">
                          <img src={img.image_url} alt="Course" className="h-full w-full object-cover" />
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

              {/* Basic Information */}
              <Card>
                <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Tabs defaultValue="en">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="ar">العربية</TabsTrigger>
                      </TabsList>
                      <TabsContent value="en">
                        <Input
                          value={data.title.en}
                          onChange={(e) => setData('title', { ...data.title, en: e.target.value })}
                          placeholder="Enter course title in English"
                        />
                      </TabsContent>
                      <TabsContent value="ar">
                        <Input
                          value={data.title.ar}
                          onChange={(e) => setData('title', { ...data.title, ar: e.target.value })}
                          placeholder="أدخل عنوان الدورة بالعربية"
                          dir="rtl"
                        />
                      </TabsContent>
                    </Tabs>
                    {(errors['title.en' as keyof typeof errors] || errors['title.ar' as keyof typeof errors]) && (
                      <p className="text-sm text-destructive">
                        {errors['title.en' as keyof typeof errors] || errors['title.ar' as keyof typeof errors]}
                      </p>
                    )}
                  </div>

                  {/* External URL */}
                  <div className="space-y-2">
                    <Label htmlFor="external_url">External URL *</Label>
                    <Input
                      id="external_url"
                      type="url"
                      value={data.external_url}
                      onChange={(e) => setData('external_url', e.target.value)}
                      placeholder="https://example.com/course"
                    />
                    {errors.external_url && <p className="text-sm text-destructive">{errors.external_url}</p>}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Platform */}
                    <div className="space-y-2">
                      <Label htmlFor="platform_id">Platform *</Label>
                      <Select value={data.platform_id} onValueChange={(v) => setData('platform_id', v)}>
                        <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                        <SelectContent>
                          {platforms.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.platform_id && <p className="text-sm text-destructive">{errors.platform_id}</p>}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category_id">Category *</Label>
                      <Select value={data.category_id} onValueChange={(v) => setData('category_id', v)}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {/* Level */}
                    <div className="space-y-2">
                      <Label htmlFor="level">Level *</Label>
                      <Select value={data.level} onValueChange={(v) => setData('level', v)}>
                        <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                        <SelectContent>
                          {levels.map((l) => (
                            <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.level && <p className="text-sm text-destructive">{errors.level}</p>}
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={data.duration}
                        onChange={(e) => setData('duration', e.target.value)}
                        placeholder="e.g., 4 weeks"
                      />
                    </div>

                    {/* Certificate */}
                    <div className="space-y-2">
                      <Label htmlFor="have_certificate">Certificate</Label>
                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          id="have_certificate"
                          type="checkbox"
                          checked={data.have_certificate}
                          onChange={(e) => setData('have_certificate', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="have_certificate" className="font-normal cursor-pointer">
                          Provides certificate
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
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
                        onChange={(html) => setData('description', { ...data.description, en: html })}
                        placeholder="Enter course description in English..."
                        height="400px"
                      />
                    </TabsContent>
                    <TabsContent value="ar">
                      <QuillEditorPro
                        value={data.description.ar}
                        onChange={(html) => setData('description', { ...data.description, ar: html })}
                        placeholder="أدخل وصف الدورة بالعربية..."
                        height="400px"
                      />
                    </TabsContent>
                  </Tabs>
                  {(errors['description.en' as keyof typeof errors] || errors['description.ar' as keyof typeof errors]) && (
                    <p className="text-sm text-destructive">
                      {errors['description.en' as keyof typeof errors] || errors['description.ar' as keyof typeof errors]}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* New Images */}
              <Card>
                <CardHeader><CardTitle>Upload New Images</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="images">Upload Images</Label>
                    <div className="flex items-center gap-4">
                      <Button type="button" variant="outline" onClick={() => document.getElementById('images')?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Files
                      </Button>
                      <input id="images" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <span className="text-sm text-muted-foreground">{imageFiles.length} file(s) selected</span>
                    </div>
                  </div>

                  {imageFiles.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {imageFiles.map((img, i) => (
                        <div key={i} className="relative group aspect-video overflow-hidden rounded-lg border">
                          <img src={img.preview} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button type="button" size="sm" variant={img.is_cover ? 'default' : 'secondary'} onClick={() => setCoverImage(i)}>
                              {img.is_cover ? 'Cover' : 'Set Cover'}
                            </Button>
                            <Button type="button" size="sm" variant="destructive" onClick={() => removeImage(i)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Separator />

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/courses">Cancel</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Updating...' : 'Update Course'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
