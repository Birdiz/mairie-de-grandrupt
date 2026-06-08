import { describe, it, expect } from "vitest";
import {
  roleOf,
  isLoggedIn,
  isAdmin,
  isPublisherOrAdmin,
  isAdminFieldLevel,
  isAdminOrSelf,
  canAccessAdminPanel,
} from "@/access";

// Minimal arg builders — the access fns only read user.role / user.id / id.
const args = (user: unknown, id?: unknown) => ({ req: { user }, id }) as any;
const u = (role?: string, id: number = 1) => (role ? { id, role } : null);

describe("roleOf", () => {
  it("reads the role off a user", () => {
    expect(roleOf({ role: "publisher" })).toBe("publisher");
  });
  it("returns undefined for null/undefined", () => {
    expect(roleOf(null)).toBeUndefined();
    expect(roleOf(undefined)).toBeUndefined();
  });
});

describe("isLoggedIn", () => {
  it("true when a user is present", () => {
    expect(isLoggedIn(args(u("writer")))).toBe(true);
  });
  it("false when anonymous", () => {
    expect(isLoggedIn(args(null))).toBe(false);
  });
});

describe("isAdmin", () => {
  it("only admins pass", () => {
    expect(isAdmin(args(u("admin")))).toBe(true);
    expect(isAdmin(args(u("publisher")))).toBe(false);
    expect(isAdmin(args(u("writer")))).toBe(false);
    expect(isAdmin(args(null))).toBe(false);
  });
});

describe("isPublisherOrAdmin", () => {
  it("admins and publishers pass, writers do not", () => {
    expect(isPublisherOrAdmin(args(u("admin")))).toBe(true);
    expect(isPublisherOrAdmin(args(u("publisher")))).toBe(true);
    expect(isPublisherOrAdmin(args(u("writer")))).toBe(false);
    expect(isPublisherOrAdmin(args(null))).toBe(false);
  });
});

describe("isAdminFieldLevel", () => {
  it("only admins may edit the field", () => {
    expect(isAdminFieldLevel(args(u("admin")))).toBe(true);
    expect(isAdminFieldLevel(args(u("writer")))).toBe(false);
  });
});

describe("canAccessAdminPanel", () => {
  it("any logged-in user can open the panel", () => {
    expect(canAccessAdminPanel(args(u("writer")))).toBe(true);
    expect(canAccessAdminPanel(args(null))).toBe(false);
  });
});

describe("isAdminOrSelf", () => {
  it("admins can act on anyone", () => {
    expect(isAdminOrSelf(args(u("admin", 1), 999))).toBe(true);
  });
  it("a user can act on their own record only", () => {
    expect(isAdminOrSelf(args(u("writer", 5), 5))).toBe(true);
    expect(isAdminOrSelf(args(u("writer", 5), 6))).toBe(false);
  });
  it("anonymous cannot", () => {
    expect(isAdminOrSelf(args(null, 1))).toBe(false);
  });
});
