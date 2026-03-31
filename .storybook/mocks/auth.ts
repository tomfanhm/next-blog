// Stub for @/lib/auth — prevents next-auth server imports in Storybook browser bundle
export async function signIn(_provider: string, _options?: Record<string, unknown>) {
  // no-op in Storybook
}

export async function signOut(_options?: Record<string, unknown>) {
  // no-op in Storybook
}

export async function auth() {
  return null;
}
