import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, ExternalLink, Calendar } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { BreadcrumbItem } from '@/types';
import type { Scholarship } from '@/types';
import { getLevelBadgeColor, formatDate } from '@/lib/utils';

interface ShowScholarshipProps {
  scholarship: Scholarship;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    title: 'Scholarships',
    href: '/admin/scholarships',
  },
  {
    title: 'View',
    href: '#',
  },
];

export default function ShowScholarship({ scholarship }: ShowScholarshipProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={scholarship.title} />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon">
                  <Link href="/admin/scholarships">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h2 className="text-2xl font-bold">Scholarship Details</h2>
                  <p className="text-muted-foreground">View scholarship information</p>
                </div>
              </div>
              <Button asChild>
                <Link href={`/admin/scholarships/${scholarship.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cover Image */}
                {scholarship.cover_image && (
                  <Card>
                    <CardContent className="p-0">
                      <div className="aspect-video w-full overflow-hidden rounded-lg">
                        <img
                          src={scholarship.cover_image.image_url}
                          alt={scholarship.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Title & Description */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-2xl">{scholarship.title}</CardTitle>
                      <Badge className={getLevelBadgeColor(scholarship.level)}>
                        {scholarship.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <div 
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: scholarship.description }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Image Gallery */}
                {scholarship.images && scholarship.images.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Image Gallery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {scholarship.images
                          .filter((img) => !img.is_cover)
                          .map((image) => (
                            <div key={image.id} className="aspect-video w-full overflow-hidden rounded-lg">
                              <img
                                src={image.image_url}
                                alt={scholarship.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Details Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Scholarship Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Institution</p>
                      <p className="text-sm font-semibold">{scholarship.platform.name}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Category</p>
                      <p className="text-sm font-semibold">{scholarship.category.name}</p>
                    </div>
                    
                    <Separator />
                    
                    {scholarship.duration && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Duration</p>
                          <p className="text-sm font-semibold">{scholarship.duration}</p>
                        </div>
                        <Separator />
                      </>
                    )}
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Certificate</p>
                      <Badge variant="outline" className={scholarship.have_certificate ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300'}>
                        {scholarship.have_certificate ? 'Available' : 'Not Available'}
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">External Link</p>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <a href={scholarship.external_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Scholarship
                        </a>
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(scholarship.created_at, 'en')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
