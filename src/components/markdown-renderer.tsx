"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="mt-8 text-3xl font-bold">{children}</h1>,
          h2: ({ children }) => <h2 className="mt-6 text-2xl font-bold">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-4 text-xl font-semibold">{children}</h3>,
          p: ({ children }) => <p className="text-foreground/90 mt-4 leading-7">{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="mt-4 list-disc space-y-1 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="mt-4 list-decimal space-y-1 pl-6">{children}</ol>,
          li: ({ children }) => <li className="leading-7">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-border text-muted-foreground mt-4 border-l-4 pl-4 italic">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            const isBlock = className?.startsWith("language-");
            if (isBlock) {
              return (
                <pre className="bg-secondary mt-4 overflow-x-auto rounded-lg p-4">
                  <code className="text-sm">{children}</code>
                </pre>
              );
            }
            return (
              <code className="bg-secondary rounded px-1.5 py-0.5 font-mono text-sm">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt ?? ""} className="mt-4 rounded-lg" />
          ),
          hr: () => <hr className="border-border my-8" />,
          table: ({ children }) => (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-border bg-secondary border px-3 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="border-border border px-3 py-2">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
