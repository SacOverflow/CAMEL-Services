import { createBrowserClient } from '@supabase/ssr';

/**
 * Method to return a supabase client (browser) based server for connection to our backend.
 *
 * @returns Supabase Browser Client
 */
export async function createSupbaseClient() {
	if (process.env.NODE_ENV === 'test') {
		// if we are in a test env, use the service key client
		return await createSupabaseServiceClientWithServiceKey();
	}
	// return instance of browser client
	return await createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);
}

/**
 * Function to create a (CLIENT) supabase client with service key, and allow us to access the database bypassing RLS policies.
 * Such function should only be used for testing integrations.
 *
 * @returns Supabase client with service key (for server-side usage, and bypassing of RLS policies)
 */
export async function createSupabaseServiceClientWithServiceKey() {
	const supabase = await createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		// EHHH might not function here... shall see
		process.env.SUPABASE_SERVICE_KEY!,
	);

	return supabase;
}

/**
 * Method to retrieve if a user is currently authenticated (session) or not.
 * May be of some use.
 *
 * @returns session object or null
 */
export async function checkSession() {
	// get client
	const supabase = await createSupbaseClient();

	// return session
	return supabase.auth.getSession();
	// return await supabase.auth.getUser();
}
