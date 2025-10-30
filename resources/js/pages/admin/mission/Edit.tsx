import { Head, useForm, Link } from '@inertiajs/react';
import { Target } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuillEditorPro from '@/components/QuillEditorPro';
import type { BreadcrumbItem, Mission } from '@/types';
import { FormEventHandler } from 'react';

interface EditMissionProps {
  mission: Mission & {
    content: { en: string; ar: string };
  } | null;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Mission', href: '/admin/mission/edit' },
  { title: 'Edit', href: '/admin/mission/edit' },
];

export default function EditMission({ mission }: EditMissionProps) {
  const { data, setData, put, processing, errors } = useForm<{
    content: { en: string; ar: string };
  }>({
    content: mission?.content || { en: '', ar: '' },
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    put('/admin/mission');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Mission" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <Target className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Edit Mission</h2>
                <p className="text-muted-foreground">Update your organization's mission statement</p>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
              {/* Mission Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Mission Statement</CardTitle>
                </CardHeader>
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
                        placeholder="Enter your mission statement in English..."
                        height="400px"
                      />
                    </TabsContent>
                    <TabsContent value="ar">
                      <QuillEditorPro
                        value={data.content.ar}
                        onChange={(content) => setData('content', { ...data.content, ar: content })}
                        placeholder="أدخل مهمة المؤسسة بالعربية..."
                        height="400px"
                      />
                    </TabsContent>
                  </Tabs>
                  {(errors['content.en' as keyof typeof errors] || errors['content.ar' as keyof typeof errors]) && (
                    <p className="text-sm text-destructive">
                      {errors['content.en' as keyof typeof errors] || errors['content.ar' as keyof typeof errors]}
                    </p>
                  )}

                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Tip:</strong> Your mission statement should clearly define your organization's purpose and primary objectives. Focus on what you do and who you serve.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/dashboard">Cancel</Link>
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Updating...' : 'Update Mission'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
