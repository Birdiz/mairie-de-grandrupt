import type { Access, FieldAccess, PayloadRequest } from "payload";

/**
 * Role-based access helpers for the Mairie admin.
 *
 * Roles (see the `users` collection):
 *  - writer    : create & edit drafts, but cannot publish
 *  - publisher : everything a writer can do + publish/unpublish & delete
 *  - admin     : full control, including managing user accounts & roles
 */

export type Role = "writer" | "publisher" | "admin";

/** Safely read the role off an authenticated user (works with or without
 *  the generated payload-types augmentation). */
export const roleOf = (user: unknown): Role | undefined =>
  (user as { role?: Role } | null | undefined)?.role;

export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user);

/** Whether a user can open the admin panel. The `admin` access slot must
 *  return a strict boolean (it cannot return a `Where` query like `Access`). */
export const canAccessAdminPanel = ({ req: { user } }: { req: PayloadRequest }): boolean =>
  Boolean(user);

export const isAdmin: Access = ({ req: { user } }) => roleOf(user) === "admin";

export const isPublisherOrAdmin: Access = ({ req: { user } }) => {
  const role = roleOf(user);
  return role === "admin" || role === "publisher";
};

/** Field-level: only admins may set/change the value. */
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => roleOf(user) === "admin";

/** Users may read/update their own record; admins may act on anyone. */
export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (roleOf(user) === "admin") return true;
  if (user && id) return (user as { id?: string | number }).id === id;
  return false;
};
