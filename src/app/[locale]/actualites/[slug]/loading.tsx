import { PageLoading } from "@/components/layout/PageLoading";

// Wraps only page.tsx: the sibling layout.tsx checks the article exists
// before this boundary, so an unknown slug still gets a real 404.
export default PageLoading;
