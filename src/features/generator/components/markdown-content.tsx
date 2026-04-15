import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { cn } from "@/shared/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn("text-sm leading-relaxed break-words", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        skipHtml
        components={{
          h1: ({ ...props }) => <h1 className="mb-3 text-xl font-semibold" {...props} />,
          h2: ({ ...props }) => <h2 className="mb-3 text-lg font-semibold" {...props} />,
          h3: ({ ...props }) => <h3 className="mb-2 text-base font-semibold" {...props} />,
          p: ({ ...props }) => <p className="mb-3 last:mb-0" {...props} />,
          ul: ({ ...props }) => <ul className="mb-3 list-disc space-y-1 pl-5" {...props} />,
          ol: ({ ...props }) => <ol className="mb-3 list-decimal space-y-1 pl-5" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote className="mb-3 border-l-2 border-border pl-3 text-muted-foreground italic" {...props} />
          ),
          a: ({ ...props }) => (
            <a className="text-primary underline underline-offset-2" target="_blank" rel="noreferrer" {...props} />
          ),
          code: ({ className: codeClassName, ...props }) => (
            <code
              className={cn(
                "rounded bg-muted px-1 py-0.5 font-mono text-xs",
                codeClassName
              )}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}