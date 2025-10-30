import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export interface QuillEditorProProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: string;
  className?: string;
}

type ToolbarModule = {
  addHandler: (format: string, handler: (value?: any) => void) => void;
};

const QuillEditorPro: React.FC<QuillEditorProProps> = ({
  value,
  onChange,
  placeholder = 'Start writing…',
  height = '450px',
  className = '',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ align: [] }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image', 'video'],
          ['blockquote', 'code-block'],
          ['clean'],
        ],
        history: {
          delay: 1500,
          maxStack: 500,
          userOnly: true,
        },
        clipboard: {
          matchVisual: false,
        },
      },
      formats: [
        'bold', 'italic', 'underline', 'strike', 'color', 'background',
        'font', 'size', 'script', 'link', 'code',
        'header', 'blockquote', 'code-block', 'list', 'bullet',
        'indent', 'align', 'direction', 'image', 'video',
      ],
    });

    const quill = quillRef.current;

    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }

    quill.on('text-change', (_delta, _old, source) => {
      if (source === 'user') {
        const html = quill.root.innerHTML || '';
        onChange(html === '<p><br></p>' ? '' : html);
      }
    });

    const toolbar = quill.getModule('toolbar') as unknown as ToolbarModule;

    toolbar.addHandler('image', () => {
      const imageChoice = window.prompt(
        'Choose an option:\n1. Type "upload" to upload an image file\n2. Type "url" to insert an image URL\n3. Or paste/type the image URL directly'
      );
      if (!imageChoice) return;
      const choice = imageChoice.toLowerCase().trim();

      if (choice === 'upload') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = () => {
          const file = input.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (e) => {
            const range = quill.getSelection(true);
            if (range) quill.insertEmbed(range.index, 'image', e.target?.result);
          };
          reader.readAsDataURL(file);
        };
        input.click();
        return;
      }

      const url = choice === 'url' ? window.prompt('Enter the image URL:') : imageChoice;
      if (!url) return;

      if (isValidImageUrl(url)) {
        const range = quill.getSelection(true);
        if (range) quill.insertEmbed(range.index, 'image', url);
      } else {
        window.alert('Please enter a valid image URL');
      }
    });

    toolbar.addHandler('video', () => {
      const url = window.prompt('Enter video URL (YouTube/Vimeo/etc.):');
      if (!url) return;
      const range = quill.getSelection(true);
      if (range) quill.insertEmbed(range.index, 'video', url);
    });

    toolbar.addHandler('link', (value?: any) => {
      if (value) {
        const href = window.prompt('Enter the URL:');
        if (href) quill.format('link', href);
      } else {
        quill.format('link', false);
      }
    });

    return () => {
      quill.off('text-change', () => {});
    };
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

  const isValidImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      return (
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(pathname) ||
        url.startsWith('data:image/') ||
        url.startsWith('blob:') ||
        /\.(githubusercontent|imgur|cloudinary|unsplash|pexels)\./i.test(urlObj.hostname)
      );
    } catch {
      return false;
    }
  };

  return (
    <div className={className}>
      <div className="rounded-lg border shadow-sm">
        <div className="ql-toolbar ql-snow rounded-t-lg border-b" />
        <div
          ref={editorRef}
          className="ql-container ql-snow rounded-b-lg"
          style={{ minHeight: height }}
        />
      </div>

      <style>{`
        .ql-container {
          border: 0;
          font-family: inherit;
        }
        .ql-toolbar {
          border: 0;
        }
        .ql-editor {
          min-height: ${height};
          font-size: 0.95rem;
          line-height: 1.6;
          padding: 1rem 1.25rem;
        }
        .ql-editor:focus { outline: none; }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 0.5rem 0;
        }
        .ql-editor pre.ql-syntax {
          background: #0b1020;
          color: #e6edf3;
          border-radius: 0.375rem;
          padding: 0.75rem 1rem;
          overflow-x: auto;
        }
        .ql-editor blockquote {
          border-left: 4px solid #e5e7eb;
          color: #334155;
          margin: 0.75rem 0;
          padding-left: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default QuillEditorPro;
