import React, { useEffect, useRef } from 'react';
import { Textarea } from './ui/textarea';

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
}

export function Editor({ content, onChange }: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;

      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // We need to wait for the next render to update the cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <>
      <div className="h-[40px] border-b border-border flex items-center px-4 justify-between bg-muted/30 shrink-0">
        <span className="text-[12px] font-medium text-muted-foreground">EDITOR</span>
        <span className="text-[10px] opacity-50 text-muted-foreground">Markdown Enabled</span>
      </div>
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1 w-full p-6 font-mono text-[14px] leading-[1.6] resize-none border-none focus-visible:ring-0 rounded-none bg-transparent text-foreground placeholder:text-muted-foreground overflow-y-auto"
        placeholder="Type your markdown here..."
        style={{ fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace" }}
      />
    </>
  );
}
