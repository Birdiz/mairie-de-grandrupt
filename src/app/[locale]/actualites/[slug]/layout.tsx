import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/actualites";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

// notFound() only sets a 404 status if it runs before the response starts
// streaming, i.e. outside any Suspense boundary. This layout sits above
// loading.tsx (which wraps the page only) and above no other loading boundary,
// so an unknown slug answers 404 instead of a soft 404.
export default async function ArticleLayout({ children, params }: Props) {
  const { slug } = await params;
  if (!(await getArticleBySlug(slug))) notFound();
  return children;
}
