import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { PreviewStyles } from '../types';

interface PreviewProps {
  content: string;
  styles: PreviewStyles;
  theme: 'light' | 'dark';
}

export function Preview({ content, styles, theme }: PreviewProps) {
  const customStyles = {
    fontFamily: styles.fontFamily,
    fontSize: `${styles.baseFontSize}px`,
  } as React.CSSProperties;

  return (
    <>
      <div className="h-[40px] border-b border-border flex items-center px-4 justify-between bg-muted/30 shrink-0">
        <span className="text-[12px] font-medium text-muted-foreground">PREVIEW</span>
      </div>
      <div 
        id="markdown-preview-container"
        className="markdown-preview flex-1 w-full p-10 overflow-y-auto bg-background text-foreground transition-colors"
        style={customStyles}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 style={{ fontFamily: styles.headingFontFamily, fontSize: `${2 * styles.headingScale}em`, marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }} {...props} />,
            h2: ({ node, ...props }) => <h2 style={{ fontFamily: styles.headingFontFamily, fontSize: `${1.5 * styles.headingScale}em`, margin: '20px 0 12px', borderBottom: '1px solid var(--border)' }} {...props} />,
            h3: ({ node, ...props }) => <h3 style={{ fontFamily: styles.headingFontFamily, fontSize: `${1.17 * styles.headingScale}em` }} {...props} />,
            h4: ({ node, ...props }) => <h4 style={{ fontFamily: styles.headingFontFamily, fontSize: `${1 * styles.headingScale}em` }} {...props} />,
            h5: ({ node, ...props }) => <h5 style={{ fontFamily: styles.headingFontFamily, fontSize: `${0.83 * styles.headingScale}em` }} {...props} />,
            h6: ({ node, ...props }) => <h6 style={{ fontFamily: styles.headingFontFamily, fontSize: `${0.67 * styles.headingScale}em` }} {...props} />,
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div className="code-block-mock p-5 rounded-lg my-5 font-mono text-[13px] shadow-sm" style={{ backgroundColor: '#18181b', color: '#d4d4d8', maxWidth: '100%', overflow: 'hidden' }}>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    wrapLongLines={true}
                    customStyle={{ background: 'transparent', padding: 0, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', overflow: 'hidden', maxWidth: '100%' }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className="px-1.5 py-1 rounded font-mono text-[0.9em]" style={{ backgroundColor: 'rgba(150, 150, 150, 0.2)', color: 'inherit' }} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </>
  );
}
