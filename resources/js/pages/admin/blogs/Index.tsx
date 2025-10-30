import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types';
import type { Blog, PaginatedData } from '@/types';
import { useState } from 'react';
import { formatDate, stripHtml, truncateText } from '@/lib/utils';

interface BlogsIndexProps {
  blogs: PaginatedData<Blog>;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    title: 'Blogs',
    href: '/admin/blogs',
  },
];

export default function BlogsIndex({ blogs }: BlogsIndexProps) {
  const [search, setSearch] = useState('');

  const handleDelete = (id: number) => {
    router.delete(`/admin/blogs/${id}`, {
      preserveScroll: true,
    });
  };

  const filteredBlogs = blogs.data.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Blogs Management" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        {/* Stats Cards */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogs.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {blogs.data.filter((b) => b.cover_image).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {blogs.data.filter((b) => {
                  const blogDate = new Date(b.created_at);
                  const now = new Date();
                  return blogDate.getMonth() === now.getMonth() && 
                         blogDate.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="relative min-h-[100vh] flex-1 rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Blogs Management</h2>
                <p className="text-muted-foreground">Manage all blog posts</p>
              </div>
              <Button asChild>
                <Link href="/admin/blogs/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Blog Post
                </Link>
              </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search blogs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead>Cover</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell className="font-medium max-w-xs">
                          <div className="line-clamp-2">{blog.title}</div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {truncateText(stripHtml(blog.content), 100)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {blog.cover_image ? (
                            <div className="h-12 w-20 rounded overflow-hidden">
                              <img
                                src={blog.cover_image.image_url}
                                alt={blog.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">No image</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(blog.created_at, 'en')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button asChild variant="ghost" size="icon">
                              <Link href={`/admin/blogs/${blog.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon">
                              <Link href={`/admin/blogs/${blog.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the blog post.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(blog.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No blogs found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {blogs.last_page > 1 && (
              <div className="flex justify-center gap-2">
                {blogs.links.map((link, index) => (
                  <Button
                    key={index}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    asChild={!!link.url}
                  >
                    {link.url ? (
                      <a href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
