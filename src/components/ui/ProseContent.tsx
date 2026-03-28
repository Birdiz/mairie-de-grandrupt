import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type Props = {
  content: string;
  className?: string;
};

export function ProseContent({ content, className }: Props) {
  return (
    <div className={cn("font-sans", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="font-heading text-foreground mt-10 mb-4 text-2xl first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-heading text-foreground mt-8 mb-3 text-xl">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="text-muted-foreground mb-4 list-disc space-y-1 pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="text-muted-foreground mb-4 list-decimal space-y-1 pl-6">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="text-foreground font-semibold">{children}</strong>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary focus-visible:ring-ring hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="border-border my-8" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
