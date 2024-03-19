import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupbaseServerClientReadOnly() {
	const cookieStore = cookies();

	// if test env
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const supabaseKey =
		process.env.NODE_ENV === 'test'
			? process.env.SUPABASE_SERVICE_KEY!
			: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

	const client = createServerClient(supabaseUrl, supabaseKey, {
		cookies: {
			get(name) {
				return cookieStore.get(name)?.value;
			},
		},
	});
	return client;
}

export async function createSupbaseServerClient() {
	const cookieStore = cookies();

	if (process.env.NODE_ENV === 'test') {
		// if we are in a test env, use the service key client
		return await createSupabaseServerClientWithServiceKey();
	}

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					cookieStore.set({ name, value, ...options });
				},
				remove(name: string, options: CookieOptions) {
					cookieStore.set({ name, value: '', ...options });
				},
			},
		},
	);
}

/**
 * Function to create a SERVER Supabase client with service key, and allow us to access the database bypassing RLS policies.
 * Such function should only be used for testing integrations.
 *
 * @returns Supabase client with service key (for server-side usage, and bypassing of RLS policies)
 */
export async function createSupabaseServerClientWithServiceKey() {
	const cookieStore = cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_KEY!,

		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					cookieStore.set({ name, value, ...options });
				},
				remove(name: string, options: CookieOptions) {
					cookieStore.set({ name, value: '', ...options });
				},
			},
		},
	);
}
