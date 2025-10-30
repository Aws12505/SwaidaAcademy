import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Categories', href: '/admin/categories' },
  { title: 'Create', href: '/admin/categories/create' },
];

export default function CreateCategory() {
  const { data, setData, post, processing, errors } = useForm<{
    name: { en: string; ar: string };
  }>({
    name: { en: '', ar: '' },
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/admin/categories');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Category" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Create New Category</h2>
                <p className="text-muted-foreground">Add a new category to the system</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/admin/categories"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
              </Button>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Category Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Tabs defaultValue="en">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="ar">العربية</TabsTrigger>
                      </TabsList>
                      <TabsContent value="en">
                        <Input
                          value={data.name.en}
                          onChange={(e) => setData('name', { ...data.name, en: e.target.value })}
                          placeholder="Enter category name in English"
                        />
                      </TabsContent>
                      <TabsContent value="ar">
                        <Input
                          value={data.name.ar}
                          onChange={(e) => setData('name', { ...data.name, ar: e.target.value })}
                          placeholder="أدخل اسم الفئة بالعربية"
                          dir="rtl"
                        />
                      </TabsContent>
                    </Tabs>
                    {(errors['name.en' as keyof typeof errors] || errors['name.ar' as keyof typeof errors]) && (
                      <p className="text-sm text-destructive">
                        {errors['name.en' as keyof typeof errors] || errors['name.ar' as keyof typeof errors]}
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Category names will be used to organize courses and scholarships throughout the system.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild><Link href="/admin/categories">Cancel</Link></Button>
                <Button type="submit" disabled={processing}>{processing ? 'Creating...' : 'Create Category'}</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
