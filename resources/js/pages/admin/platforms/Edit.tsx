import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { BreadcrumbItem, Platform } from '@/types';
import { FormEventHandler } from 'react';

interface EditPlatformProps {
  platform: Platform & {
    name: { en: string; ar: string };
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Platforms', href: '/admin/platforms' },
  { title: 'Edit', href: '#' },
];

export default function EditPlatform({ platform }: EditPlatformProps) {
  const { data, setData, put, processing, errors } = useForm<{
    name: { en: string; ar: string };
  }>({
    name: platform.name,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    put(`/admin/platforms/${platform.id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit: ${platform.name.en || 'Platform'}`} />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Edit Platform</h2>
                <p className="text-muted-foreground">Update platform information</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/admin/platforms"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
              </Button>
            </div>

            <form onSubmit={submit} className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Platform Information</CardTitle></CardHeader>
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
                          placeholder="Enter platform name in English"
                        />
                      </TabsContent>
                      <TabsContent value="ar">
                        <Input
                          value={data.name.ar}
                          onChange={(e) => setData('name', { ...data.name, ar: e.target.value })}
                          placeholder="أدخل اسم المنصة بالعربية"
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
                      <strong>Note:</strong> Changes to platform names will be reflected across all associated courses and scholarships.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild><Link href="/admin/platforms">Cancel</Link></Button>
                <Button type="submit" disabled={processing}>{processing ? 'Updating...' : 'Update Platform'}</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
