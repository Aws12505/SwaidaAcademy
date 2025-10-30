import { useState, FormEventHandler } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { router, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import { useRTL } from '@/hooks/useRTL';

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = 'Search...' }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { locale } = usePage<PageProps>().props;
  const { isRTL } = useRTL();

  const handleSearch: FormEventHandler = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.get(`/${locale}/search`, { search: query });
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 touch-target" aria-label={locale === 'ar' ? 'بحث' : 'Search'}>
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{locale === 'ar' ? 'بحث' : 'Search'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={isRTL ? 'pr-9' : 'pl-9'}
              autoFocus
            />
            {/* {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`absolute top-1/2 -translate-y-1/2 h-7 w-7 ${isRTL ? 'left-1' : 'right-1'}`}
                onClick={() => setQuery('')}
                aria-label={locale === 'ar' ? 'مسح' : 'Clear'}
              >
                <X className="h-4 w-4" />
              </Button>
            )} */}
          </div>
          <Button type="submit" className="w-full touch-target">
            {locale === 'ar' ? 'بحث' : 'Search'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
