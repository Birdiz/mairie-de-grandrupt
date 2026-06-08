import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { cn } from "@/lib/utils";

type Props = {
  content: SerializedEditorState;
  className?: string;
};

/**
 * Renders Payload Lexical rich-text as styled HTML, matching the look the site
 * previously used for markdown articles. Styling is applied to the semantic
 * elements RichText emits via Tailwind arbitrary descendant variants.
 */
export function RichTextContent({ content, className }: Props) {
  return (
    <div
      className={cn(
        "font-sans",
        "[&_h2]:font-heading [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:first:mt-0",
        "[&_h3]:font-heading [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl",
        "[&_p]:text-muted-foreground [&_p]:mb-4 [&_p]:leading-relaxed",
        "[&_ul]:text-muted-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6",
        "[&_ol]:text-muted-foreground [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6",
        "[&_li]:leading-relaxed",
        "[&_strong]:text-foreground [&_strong]:font-semibold",
        "[&_a]:text-primary [&_a]:hover:underline",
        "[&_hr]:border-border [&_hr]:my-8",
        className,
      )}
    >
      <RichText data={content} />
    </div>
  );
}
