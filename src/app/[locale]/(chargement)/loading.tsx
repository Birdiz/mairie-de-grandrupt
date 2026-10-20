import { PageLoading } from "@/components/layout/PageLoading";

// This route group exists only to scope this loading boundary. A loading.tsx
// wraps every segment below it in <Suspense>, and once its fallback renders
// the response has already started streaming with a 200 status: a later
// notFound() can no longer turn it into a 404. The article route therefore
// lives outside this group, see actualites/[slug]/layout.tsx.
export default PageLoading;
