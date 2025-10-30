// components/QuillEditorPro.tsx
import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
// shadcn/ui
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface QuillEditorProProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
  className?: string;
  draftToken?: string;
  blogId?: number;
}

type ToolbarModule = { addHandler: (format: string, handler: (value?: any) => void) => void; };

const QuillEditorPro: React.FC<QuillEditorProProps> = ({
  value,
  onChange,
  placeholder = 'Start writing…',
  height = '500px',
  className = '',
  draftToken,
  blogId,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('upload');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [gallery, setGallery] = useState<Array<{id:number; image_url:string}>>([]);
  const pendingInsertAt = useRef<number | null>(null);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: [
          [{ header: [1,2,3,4,5,6,false] }],
          [{ font: [] }],[{ size: ['small',false,'large','huge'] }],
          ['bold','italic','underline','strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ align: [] }],[{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link','image','video'],
          ['blockquote','code-block'],
          ['clean'],
        ],
        history: { delay: 1500, maxStack: 500, userOnly: true },
        clipboard: { matchVisual: false },
      },
      formats: [
        'bold','italic','underline','strike','color','background',
        'font','size','script','link','code',
        'header','blockquote','code-block','list','bullet',
        'indent','align','direction','image','video',
      ],
    });

    const quill = quillRef.current;
    if (value) quill.clipboard.dangerouslyPasteHTML(value);
    quill.on('text-change', (_delta,_old,source) => {
      if (source === 'user') {
        const html = quill.root.innerHTML || '';
        onChange(html === '<p><br></p>' ? '' : html);
      }
    });

    const toolbar = quill.getModule('toolbar') as unknown as ToolbarModule;

    // Intercept "image" button → open dialog
    toolbar.addHandler('image', () => {
      const sel = quill.getSelection(true);
      pendingInsertAt.current = sel ? sel.index : null;
      setActiveTab('upload');
      setDialogOpen(true);
      loadGallery();
    });

    // Optional: handle paste of images (file paste)
    quill.root.addEventListener('paste', async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items || [];
      for (const it of items) {
        if (it.kind === 'file') {
          e.preventDefault();
          const file = it.getAsFile();
          if (file) await uploadAndInsert(file);
        }
      }
    });

    return () => { quill.off('text-change', () => {}); };
  }, [placeholder]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    const current = quill.root.innerHTML;
    if (value !== current && document.activeElement !== quill.root) {
      const sel = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(value || '');
      if (sel) quill.setSelection(sel);
    }
  }, [value]);

  async function loadGallery() {
    try {
      const params = new URLSearchParams();
      if (blogId) params.set('blog_id', String(blogId));
      if (draftToken) params.set('draft_token', draftToken);
      const res = await fetch(`/admin/uploads/images?${params.toString()}`, { credentials: 'same-origin' });
      const data = await res.json();
      setGallery(data.images || []);
    } catch {}
  }

  async function uploadAndInsert(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    if (blogId) fd.append('blog_id', String(blogId));
    if (draftToken) fd.append('draft_token', draftToken);
    fd.append('is_inline', '1');

    const res = await fetch('/admin/uploads/images', {
      method: 'POST',
      body: fd,
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });
    if (!res.ok) return;
    const { image_url } = await res.json();

    const quill = quillRef.current!;
    const index = pendingInsertAt.current ?? (quill.getSelection(true)?.index ?? quill.getLength());
    quill.insertEmbed(index, 'image', image_url, 'user');
    quill.setSelection(index + 1, 0, 'user');
    setDialogOpen(false);
    setUploadFile(null);
  }

  return (
    <div className={className}>
      <div className="rounded-lg border shadow-sm">
        <div className="ql-toolbar ql-snow rounded-t-lg border-b" />
        <div ref={editorRef} className="ql-container ql-snow rounded-b-lg" style={{ minHeight: height }} />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Insert image</DialogTitle>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={(v:any)=>setActiveTab(v)}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="gallery">From gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div className="space-y-3">
                <Input type="file" accept="image/*" onChange={(e)=>setUploadFile(e.target.files?.[0] ?? null)} />
                <div className="flex justify-end">
                  <Button onClick={()=>uploadFile && uploadAndInsert(uploadFile)} disabled={!uploadFile}>Insert</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gallery">
              <div className="grid grid-cols-3 gap-3 max-h-[50vh] overflow-auto">
                {gallery.map(img => (
                  <button
                    key={img.id}
                    onClick={()=>{
                      const quill = quillRef.current!;
                      const index = pendingInsertAt.current ?? (quill.getSelection(true)?.index ?? quill.getLength());
                      quill.insertEmbed(index, 'image', img.image_url, 'user');
                      quill.setSelection(index + 1, 0, 'user');
                      setDialogOpen(false);
                    }}
                    className="relative aspect-video overflow-hidden rounded border"
                  >
                    <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        .ql-container{border:0;font-family:inherit}
        .ql-toolbar{border:0}
        .ql-editor{min-height:${height};font-size:.95rem;line-height:1.6;padding:1rem 1.25rem}
        .ql-editor img{max-width:100%;height:auto;border-radius:.375rem;margin:.5rem 0}
        .ql-editor pre.ql-syntax{background:#0b1020;color:#e6edf3;border-radius:.375rem;padding:.75rem 1rem;overflow-x:auto}
        .ql-editor blockquote{border-left:4px solid #e5e7eb;color:#334155;margin:.75rem 0;padding-left:.75rem}
      `}</style>
    </div>
  );
};

export default QuillEditorPro;
