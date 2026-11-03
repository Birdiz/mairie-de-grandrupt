type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] };

/**
 * Whether a Lexical value holds anything to show. An editor emptied by hand
 * leaves a single empty paragraph behind, which does not count.
 */
export function hasRichText(value: unknown): boolean {
  const nodes = (value as { root?: { children?: LexicalNode[] } } | null | undefined)?.root
    ?.children;
  if (!nodes?.length) return false;
  if (nodes.length > 1 || nodes[0].type !== "paragraph") return true;
  return (nodes[0].children ?? []).some((node) => node.type !== "text" || Boolean(node.text));
}
