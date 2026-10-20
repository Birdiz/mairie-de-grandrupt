import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { cn } from "@/lib/utils";

type Props = {
  content: SerializedEditorState;
  className?: string;
};

/**
 * Renders Payload Lexical rich-text as styled HTML, following the site's type scale. Styling is applied to the semantic
 * elements RichText emits via Tailwind arbitrary descendant variants.
 */
export function RichTextContent({ content, className }: Props) {
  return (
    <div
      className={cn(
        "text-body max-w-[66ch]",
        "[&_h2]:text-h2 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:first:mt-0",
        "[&_h3]:text-h3 [&_h3]:mt-8 [&_h3]:mb-3",
        "[&_h4]:text-h4 [&_h4]:mt-6 [&_h4]:mb-2",
        "[&_p]:mb-4 [&_p]:text-pretty",
        "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6",
        "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6",
        "[&_strong]:font-bold",
        "[&_a]:text-primary",
        "[&_hr]:border-border [&_hr]:my-8",
        className,
      )}
    >
      <RichText data={content} />
    </div>
  );
}
