import { describe, it, expect, vi, afterEach } from "vitest";

/**
 * The Payload session cookie must carry the Secure flag in production, so it
 * is never sent over plain HTTP. Users.ts reads NODE_ENV when it is loaded,
 * hence the module reset before each import.
 */
async function loadUsers(nodeEnv: string) {
  vi.stubEnv("NODE_ENV", nodeEnv);
  vi.resetModules();
  const { Users } = await import("@/collections/Users");
  return Users;
}

describe("Users auth cookie", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is Secure in production", async () => {
    const Users = await loadUsers("production");
    expect(Users.auth).toMatchObject({ cookies: { secure: true } });
  });

  it("is not Secure in development, which runs on http://localhost", async () => {
    const Users = await loadUsers("development");
    expect(Users.auth).toMatchObject({ cookies: { secure: false } });
  });
});
