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
import type { BreadcrumbItem, Platform, Category, LevelOption } from '@/types';
import { useState, FormEventHandler } from 'react';

interface CreateScholarshipProps {
  platforms: Platform[];
  categories: Category[];
  levels: LevelOption[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Scholarships', href: '/admin/scholarships' },
  { title: 'Create', href: '/admin/scholarships/create' },
];

export default function CreateScholarship({ platforms, categories, levels }: CreateScholarshipProps) {
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
    images: Array<{ file: File; is_cover: boolean }>;
  }>({
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    external_url: '',
    duration: '',
    platform_id: '',
    category_id: '',
    have_certificate: false,
    level: '',
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
    post('/admin/scholarships');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Scholarship" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Create New Scholarship</h2>
                <p className="text-muted-foreground">Add a new scholarship to the platform</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/admin/scholarships">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
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
                          placeholder="Enter scholarship title in English"
                        />
                      </TabsContent>
                      <TabsContent value="ar">
                        <Input
                          value={data.title.ar}
                          onChange={(e) => setData('title', { ...data.title, ar: e.target.value })}
                          placeholder="أدخل عنوان المنحة بالعربية"
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

                  <div className="space-y-2">
                    <Label htmlFor="external_url">External URL *</Label>
                    <Input
                      id="external_url"
                      type="url"
                      value={data.external_url}
                      onChange={(e) => setData('external_url', e.target.value)}
                      placeholder="https://example.com/scholarship"
                    />
                    {errors.external_url && <p className="text-sm text-destructive">{errors.external_url}</p>}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Institution *</Label>
                      <Select value={data.platform_id} onValueChange={(value) => setData('platform_id', value)}>
                        <SelectTrigger><SelectValue placeholder="Select institution" /></SelectTrigger>
                        <SelectContent>
                          {platforms.map((platform) => (
                            <SelectItem key={platform.id} value={platform.id.toString()}>{platform.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.platform_id && <p className="text-sm text-destructive">{errors.platform_id}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Level *</Label>
                      <Select value={data.level} onValueChange={(value) => setData('level', value)}>
                        <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                        <SelectContent>
                          {levels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.level && <p className="text-sm text-destructive">{errors.level}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={data.duration}
                        onChange={(e) => setData('duration', e.target.value)}
                        placeholder="e.g., 1 year"
                      />
                    </div>

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
                        <Label htmlFor="have_certificate" className="font-normal cursor-pointer">Provides certificate</Label>
                      </div>
                    </div>
                  </div>
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
                  {(errors['description.en' as keyof typeof errors] || errors['description.ar' as keyof typeof errors]) && (
                    <p className="text-sm text-destructive">
                      {errors['description.en' as keyof typeof errors] || errors['description.ar' as keyof typeof errors]}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Images</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upload Images</Label>
                    <div className="flex items-center gap-4">
                      <Button type="button" variant="outline" onClick={() => document.getElementById('images')?.click()}>
                        <Upload className="mr-2 h-4 w-4" />Choose Files
                      </Button>
                      <input id="images" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <span className="text-sm text-muted-foreground">{imageFiles.length} file(s) selected</span>
                    </div>
                  </div>

                  {imageFiles.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {imageFiles.map((img, index) => (
                        <div key={index} className="relative group aspect-video overflow-hidden rounded-lg border">
                          <img src={img.preview} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button type="button" size="sm" variant={img.is_cover ? 'default' : 'secondary'} onClick={() => setCoverImage(index)}>
                              {img.is_cover ? 'Cover' : 'Set Cover'}
                            </Button>
                            <Button type="button" size="sm" variant="destructive" onClick={() => removeImage(index)}>
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

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild><Link href="/admin/scholarships">Cancel</Link></Button>
                <Button type="submit" disabled={processing}>{processing ? 'Creating...' : 'Create Scholarship'}</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
