import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { useLocalStorage } from './hooks/use-local-storage';
import { useHistory } from './hooks/use-history';
import { Document, PreviewStyles, DEFAULT_STYLES } from './types';

const DEFAULT_CONTENT = `# Welcome to Markdown Editor

Start typing on the left, and see the preview on the right.

## Features
- **Live Preview**: See changes instantly
- **Syntax Highlighting**: Code blocks look great
- **Export**: Save as PDF or HTML
- **History**: Undo/Redo support
- **Local Storage**: Your documents are saved automatically

\`\`\`javascript
// Example code block
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet('World');
\`\`\`

### Tables
| Feature | Supported |
|---------|-----------|
| Markdown | Yes |
| GFM | Yes |
`;

export default function App() {
  const [documents, setDocuments] = useLocalStorage<Document[]>('md-documents', []);
  const [currentDocId, setCurrentDocId] = useLocalStorage<string>('md-current-doc', '');
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('md-theme', 'light');
  const [styles, setStyles] = useLocalStorage<PreviewStyles>('md-styles', DEFAULT_STYLES);
  const [isExporting, setIsExporting] = useState(false);

  const currentDoc = documents.find((d) => d.id === currentDocId);

  const { state: content, set: setContent, undo, redo, canUndo, canRedo, reset: resetHistory } = useHistory<string>(
    currentDoc?.content || DEFAULT_CONTENT
  );

  // Initialize first document if empty
  useEffect(() => {
    if (documents.length === 0) {
      const newDoc: Document = {
        id: uuidv4(),
        title: 'Untitled Document',
        content: DEFAULT_CONTENT,
        lastModified: Date.now(),
      };
      setDocuments([newDoc]);
      setCurrentDocId(newDoc.id);
      resetHistory(DEFAULT_CONTENT);
    } else if (!currentDocId) {
      setCurrentDocId(documents[0].id);
      resetHistory(documents[0].content);
    }
  }, []);

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === currentDocId
          ? { ...doc, content: newContent, lastModified: Date.now() }
          : doc
      )
    );
  }, [currentDocId, setContent, setDocuments]);

  const handleNewDocument = () => {
    const newDoc: Document = {
      id: uuidv4(),
      title: 'Untitled Document',
      content: '',
      lastModified: Date.now(),
    };
    setDocuments((docs) => [newDoc, ...docs]);
    setCurrentDocId(newDoc.id);
    resetHistory('');
  };

  const handleSelectDocument = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (doc) {
      setCurrentDocId(id);
      resetHistory(doc.content);
    }
  };

  const handleDeleteDocument = (id: string) => {
    const newDocs = documents.filter((d) => d.id !== id);
    setDocuments(newDocs);
    if (currentDocId === id) {
      if (newDocs.length > 0) {
        setCurrentDocId(newDocs[0].id);
        resetHistory(newDocs[0].content);
      } else {
        handleNewDocument();
      }
    }
  };

  const handleTitleChange = (title: string) => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === currentDocId ? { ...doc, title, lastModified: Date.now() } : doc
      )
    );
  };

  // Sanitize HTML for export: fix inline styles from SyntaxHighlighter
  const sanitizeExportHTML = (html: string): string => {
    return html
      .replace(/class="[^"]*"/g, '') // Strip Tailwind classes
      .replace(/overflow\s*:\s*auto/gi, 'overflow: hidden') // Kill scrollbars
      .replace(/overflow-x\s*:\s*auto/gi, 'overflow-x: hidden')
      .replace(/overflow-y\s*:\s*auto/gi, 'overflow-y: hidden')
      .replace(/white-space\s*:\s*pre(?!-)/gi, 'white-space: pre-wrap'); // Force wrapping
  };

  const handleExportPDF = useCallback(async () => {
    const element = document.getElementById('markdown-preview-container');
    if (!element) return;

    setIsExporting(true);
    try {
      const cleanHTML = sanitizeExportHTML(element.innerHTML);

      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: cleanHTML,
          theme,
          styles
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF on server');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentDoc?.title || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [currentDoc?.title, styles, theme]);

  const handleExportHTML = useCallback(() => {
    const element = document.getElementById('markdown-preview-container');
    if (!element) return;

    setIsExporting(true);
    try {
      const isDark = theme === 'dark';
      const bgColor = isDark ? '#0f0f12' : '#ffffff';
      const textColor = isDark ? '#e0e0e6' : '#1a1a1a';
      const codeBg = isDark ? '#282c34' : '#f5f5f5';
      const borderColor = isDark ? '#2d2d35' : '#ddd';

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${currentDoc?.title || 'Document'}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: ${styles.fontFamily};
              font-size: ${styles.baseFontSize}px;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              color: ${textColor};
              background-color: ${bgColor};
            }
            pre { background: ${codeBg}; padding: 16px; border-radius: 8px; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; max-width: 100%; overflow: hidden; }
            code { font-family: monospace; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; }
            table { border-collapse: collapse; width: 100%; max-width: 100%; table-layout: fixed; }
            th, td { border: 1px solid ${borderColor}; padding: 8px; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; }
            blockquote { border-left: 4px solid ${borderColor}; margin: 0; padding-left: 16px; opacity: 0.8; }
            img { max-width: 100%; }
            a { color: #4f46e5; }
          </style>
        </head>
        <body>
          ${sanitizeExportHTML(element.innerHTML)}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentDoc?.title || 'document'}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('HTML export error:', error);
      alert('Failed to export HTML.');
    } finally {
      setIsExporting(false);
    }
  }, [currentDoc?.title, styles, theme]);

  const handleResetStyles = () => {
    setStyles(DEFAULT_STYLES);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background text-foreground font-sans">
      <Topbar
        title={currentDoc?.title || ''}
        onTitleChange={handleTitleChange}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onExportPDF={handleExportPDF}
        onExportHTML={handleExportHTML}
        isExporting={isExporting}
        styles={styles}
        onStylesChange={setStyles}
        onResetStyles={handleResetStyles}
      />
      
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        <div className="w-full md:w-[240px] h-[30vh] md:h-full shrink-0 border-b md:border-b-0 md:border-r border-border">
          <Sidebar
            documents={documents}
            currentDocId={currentDocId}
            onSelect={handleSelectDocument}
            onNew={handleNewDocument}
            onDelete={handleDeleteDocument}
          />
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          <div className="flex-1 flex flex-col bg-card border-b md:border-b-0 md:border-r border-border min-h-0">
            <Editor content={content} onChange={handleContentChange} />
          </div>
          <div className="flex-1 flex flex-col bg-background text-foreground min-h-0 overflow-hidden">
            <Preview content={content} styles={styles} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}

