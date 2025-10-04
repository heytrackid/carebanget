'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);

    onChange(newText);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mb-4 mt-6">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mb-3 mt-5">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mb-2 mt-4">{line.substring(4)}</h3>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-1">{line.substring(2)}</li>;
      } else if (line.startsWith('> ')) {
        return <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-2">{line.substring(2)}</blockquote>;
      } else if (line.startsWith('`') && line.endsWith('`')) {
        return <code key={index} className="bg-gray-100 px-1 rounded text-sm">{line.slice(1, -1)}</code>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="mb-3 leading-relaxed">{line}</p>;
      }
    });
  };

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('**', '**')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('*', '*')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('# ')}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('## ')}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('### ')}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('- ')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('1. ')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('> ')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('`', '`')}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          title="Preview"
        >
          👁️
        </Button>
      </div>

      {/* Editor/Preview */}
      <div className="p-4">
        {isPreview ? (
          <div className="prose prose-gray max-w-none">
            {formatContent(content)}
          </div>
        ) : (
          <Textarea
            id="content-editor"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Tulis konten artikel di sini..."}
            className="min-h-[400px] border-0 focus-visible:ring-0 resize-none"
          />
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-2 flex justify-between items-center text-sm text-gray-500">
        <span>Markdown supported</span>
        <span>{content.length} characters</span>
      </div>
    </div>
  );
}
