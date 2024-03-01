import { createSupbaseClient } from '../supabase/client';

const PASSWORD_LENGTH = 6;
const PASSWORD_REGEX_STRING = `^(?=.*[a-zA-Z])(?=.*\d).{${PASSWORD_LENGTH},}$`;
const PASSWORD_REGEX = new RegExp(PASSWORD_REGEX_STRING);

const EMAIL_REGEX_STRING = '^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,4}$';
const EMAIL_REGEX = new RegExp(EMAIL_REGEX_STRING);

export const signupNewUser = async (
	emailOrUsername: string,
	password: string,
	name: string,
	username: string,
) => {
	// regex test password
	const passwordValid = password.match(PASSWORD_REGEX);
	if (!passwordValid) {
		return {
			error: {
				message: `Password must be at least ${PASSWORD_LENGTH} characters long and contain at least one letter and one number`,
			},
		};
	}

	// create a browser client accessing cookie
	const supabase = await createSupbaseClient();

	// signup user with email, pass and meta data
	const { data, error } = await supabase.auth.signUp({
		email: emailOrUsername,
		password: password,
		options: {
			data: {
				// NOTE: How the Metadata fields are correlated later
				name: name,
				username: username,
			},
		},
	});

	if (error) {
		return { error };
	}

	// double check me
	const { user, session } = data;

	return data;
};

export const signInUser = async (emailOrUsername: string, password: string) => {
	const supabase = await createSupbaseClient();
	// check email regex else check via username
	const emailValid = emailOrUsername.match(EMAIL_REGEX);
	if (!emailValid) {
		const { data: fetchedUser, error } = await supabase
			.from('user')
			.select('email')
			.eq('username', emailOrUsername)
			.single();

		if (error) {
			return {
				error: {
					message: 'Invalid email address or username',
				},
			};
		}

		emailOrUsername = fetchedUser?.email;
		if (!emailOrUsername) {
			return {
				error: {
					message: 'Invalid email address or username',
				},
			};
		}
	}

	const { data, error } = await supabase.auth.signInWithPassword({
		email: emailOrUsername,
		password: password,
	});

	await supabase.auth.refreshSession();

	if (error) {
		return { error };
	}

	return { data, error: null };
};

export const resetPasswordForEmail = async (emailOrUsername: string) => {
	const supabase = await createSupbaseClient();

	// check email regex else check via username
	const emailValid = emailOrUsername.match(EMAIL_REGEX);

	const { data, error } = await supabase.auth.resetPasswordForEmail(
		emailOrUsername,
		{
			redirectTo: `${window.location.origin}`,
		},
	);

	if (error) {
		return { error };
	}

	return { data, error: null };
};

export const updatePassword = async (newPassword: string) => {
	const supabase = await createSupbaseClient();

	// check password regex
	if (!newPassword.match(PASSWORD_REGEX)) {
		return {
			error: {
				message: `Password must be at least ${PASSWORD_LENGTH} characters long and contain at least one letter and one number`,
			},
		};
	}

	const { data, error } = await supabase.auth.updateUser({
		password: newPassword,
	});

	if (error) {
		return { error };
	}

	return { data, error: null };
};
