import { notFound } from "next/navigation";
import { getArticleBySlug, type Locale } from "@/lib/actualites";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

// notFound() only sets a 404 status if it runs before the response starts
// streaming, i.e. outside any Suspense boundary. This layout sits above
// loading.tsx (which wraps the page only) and above no other loading boundary,
// so an unknown slug answers 404 instead of a soft 404.
export default async function ArticleLayout({ children, params }: Props) {
  const { locale, slug } = await params;
  // Same arguments as the page, so the cached lookup is shared.
  if (!(await getArticleBySlug(slug, locale as Locale))) notFound();
  return children;
}
