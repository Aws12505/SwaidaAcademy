import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuillEditorPro from '@/components/QuillEditorPro';
import type { BreadcrumbItem, Blog } from '@/types';
import { useState, FormEventHandler, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

interface EditBlogProps {
  blog: Blog & {
    title: { en: string; ar: string };
    content: { en: string; ar: string };
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Blogs', href: '/admin/blogs' },
  { title: 'Edit', href: '#' },
];

export default function EditBlog({ blog }: EditBlogProps) {
  const [imageFiles, setImageFiles] = useState<Array<{ file: File; is_cover: boolean; preview: string }>>([]);

  const { data, setData, put, processing, errors } = useForm<{
    title: { en: string; ar: string };
    content: { en: string; ar: string };
    images: Array<{ file: File; is_cover: boolean }>;
    draft_token?: string;
  }>({
    title: blog.title,
    content: blog.content,
    images: [],
    draft_token: undefined,
  });
useEffect(() => {
  if (!(data as any).draft_token) setData('draft_token', uuid());
}, []);
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
    put(`/admin/blogs/${blog.id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit: ${blog.title.en || 'Blog'}`} />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Edit Blog Post</h2>
                <p className="text-muted-foreground">Update blog post information</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/admin/blogs"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
              </Button>
            </div>

            <form onSubmit={submit} className="space-y-6">
              {blog.images && blog.images.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Current Images</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {blog.images.map((img) => (
                        <div key={img.id} className="relative aspect-video overflow-hidden rounded-lg border">
                          <img src={img.image_url} alt="Blog" className="h-full w-full object-cover" />
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
                          placeholder="Enter blog title in English"
                        />
                      </TabsContent>
                      <TabsContent value="ar">
                        <Input
                          value={data.title.ar}
                          onChange={(e) => setData('title', { ...data.title, ar: e.target.value })}
                          placeholder="أدخل عنوان المقال بالعربية"
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Content *</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="en">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ar">العربية</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en">
                      <QuillEditorPro
                        value={data.content.en}
                        onChange={(content) => setData('content', { ...data.content, en: content })}
                        placeholder="Write your blog content in English..."
                        height="500px"
                      />
                    </TabsContent>
                    <TabsContent value="ar">
                      <QuillEditorPro
                        value={data.content.ar}
                        onChange={(content) => setData('content', { ...data.content, ar: content })}
                        placeholder="اكتب محتوى المقال بالعربية..."
                        height="500px"
                      />
                    </TabsContent>
                  </Tabs>
                  {(errors['content.en' as keyof typeof errors] || errors['content.ar' as keyof typeof errors]) && (
                    <p className="text-sm text-destructive">
                      {errors['content.en' as keyof typeof errors] || errors['content.ar' as keyof typeof errors]}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Upload New Images</CardTitle></CardHeader>
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
                <Button type="button" variant="outline" asChild><Link href="/admin/blogs">Cancel</Link></Button>
                <Button type="submit" disabled={processing}>{processing ? 'Updating...' : 'Update Blog Post'}</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
