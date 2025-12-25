/**
 * Test utilities for mocking Supabase clients.
 *
 * This file provides mock factories that tests can use to override
 * the server-only Supabase clients without importing them directly.
 */

export type MockSupabaseClient = {
  from: (table: string) => {
    select: (...args: unknown[]) => unknown
    insert: (...args: unknown[]) => unknown
  }
}

/**
 * Creates a thenable query builder mock for Supabase client tests.
 * The returned builder supports chaining (.order, .limit, .range)
 * and can be awaited.
 */
export function createThenableMock(result: { data: unknown; error: unknown }) {
  const builder: any = {
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    then: (resolve: any, reject: any) => Promise.resolve(result).then(resolve, reject),
  }
  return builder
}

/**
 * Creates a mock Supabase client for testing.
 */
export function createMockClient(mockImplementation: {
  select?: (result: { data: unknown; error: unknown }) => unknown
  insert?: (payload: unknown) => Promise<{ error: unknown | null }>
}): MockSupabaseClient {
  return {
    from: () => ({
      select: mockImplementation.select || (() => createThenableMock({ data: [], error: null })),
      insert: mockImplementation.insert || (async () => ({ error: null })),
    }),
  } as MockSupabaseClient
}

/**
 * Installs global overrides for Supabase clients in tests.
 * Call this at the start of tests that need to mock Supabase.
 */
export function installSupabaseMocks(mocks: {
  anon?: MockSupabaseClient
  serviceRole?: MockSupabaseClient
  submitAnon?: MockSupabaseClient
  submitServiceRole?: MockSupabaseClient
}) {
  if (mocks.anon) {
    ;(globalThis as any).__supabaseAnonReadOverride = mocks.anon
  }
  if (mocks.serviceRole) {
    ;(globalThis as any).__supabaseServiceRoleReadOverride = mocks.serviceRole
  }
  if (mocks.submitAnon) {
    ;(globalThis as any).__supabaseClientOverride = mocks.submitAnon
  }
  if (mocks.submitServiceRole) {
    ;(globalThis as any).__supabaseServiceRoleClientOverride = mocks.submitServiceRole
  }
}

/**
 * Clears all global Supabase mock overrides.
 * Call this in test cleanup.
 */
export function clearSupabaseMocks() {
  delete (globalThis as any).__supabaseAnonReadOverride
  delete (globalThis as any).__supabaseServiceRoleReadOverride
  delete (globalThis as any).__supabaseClientOverride
  delete (globalThis as any).__supabaseServiceRoleClientOverride
}
