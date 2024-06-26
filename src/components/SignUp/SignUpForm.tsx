'use client';

import { useState } from 'react';
import InputComponent from '@/components/SharedComponents/InputComponent';

import { useRouter } from 'next/navigation';
import { createSupbaseClient } from '@/lib/supabase/client';
import PopUp from './PopUp';
import { PASSWORD_MESSAGE, PASSWORD_REGEX } from '@/types/auth.constants';
import { signupUser } from '@/lib/actions/auth.client';

function SignUpForm() {
	const [emailOrUsername, setEmailOrUsername] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [userName, setUserName] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordMatch, setPasswordMatch] = useState(true);

	const [passwordValid, setPasswordValid] = useState(true);

	const [popup, setPopup] = useState(false);
	const [popupMsg, setPopupMsg] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (!passwordMatch) {
			return;
		}

		// check if password meets requirements
		if (!PASSWORD_REGEX.test(password)) {
			setPopupMsg(PASSWORD_MESSAGE);
			setPopup(true);

			setTimeout(() => {
				setPopupMsg('');
				setPopup(false);
			}, 5000);

			return;
		}

		// const resp: any = await signupNewUser();
		const resp: any = await signupUser(
			emailOrUsername,
			password,
			firstName,
			lastName,
			userName,
		);

		if (resp?.error) {
			// TODO:  if error message is 'User already registered.' then popup msg populate, redirect to signin as well...
			// encountered error
			console.log('err caught: ', resp);
			setPopupMsg(resp.error?.message || 'Something went wrong.');
			setPopup(true);
			// router.refresh();
			return;
		}

		// redirect to signin page
		router.push('/dashboard');
		router.refresh();
	};

	// const signupNewUser = async () => {
	// 	// create a browser client accessing cookie
	// 	const supabase = await createSupbaseClient();

	// 	// signup user with email, pass and meta data
	// 	const { data, error } = await supabase.auth.signUp({
	// 		email: emailOrUsername,
	// 		password: password,
	// 		options: {
	// 			data: {
	// 				// NOTE: How the Metadata fields are correlated later
	// 				name: `${firstName} ${lastName}`,
	// 				username: userName,
	// 			},
	// 		},
	// 	});

	// 	if (error) {
	// 		return { error };
	// 	}

	// 	// double check me
	// 	const { user, session } = data;

	// 	return data;
	// };

	// function to check password requirements
	const checkPassword = (password: string) => {
		// check if password meets requirements
		if (!PASSWORD_REGEX.test(password)) {
			setPasswordValid(false);
		} else {
			setPasswordValid(true);
		}
	};

	return (
		<>
			<PopUp
				isOpen={popup}
				onClose={() => {
					setPopup(false);
				}}
				type="error"
				msg={`${popupMsg}`}
			/>
			<form
				action=""
				method="post"
				id="signup-form"
				onSubmit={handleSubmit}
			>
				<InputComponent
					label="firstName"
					labelText="First Name"
					type=""
					id="firstName"
					pattern="^[a-zA-ZÀ-ÿ]+$"
					placeholder="First Name"
					value={firstName}
					onChange={e => setFirstName(e.target.value)}
					required={true}
				/>
				<InputComponent
					label="lastName"
					labelText="Last Name"
					type=""
					id="lastName"
					pattern="^[a-zA-ZÀ-ÿ]+$"
					placeholder="Last Name"
					value={lastName}
					onChange={e => setLastName(e.target.value)}
					required={true}
				/>
				<InputComponent
					label="email"
					labelText="Email address"
					type="email"
					id="email"
					placeholder="Enter Email"
					value={emailOrUsername}
					onChange={e => setEmailOrUsername(e.target.value)}
					required={true}
				/>
				<InputComponent
					label="Username"
					labelText="Username"
					type=""
					id="Username"
					pattern="^[a-zA-Z0-9_]+$"
					placeholder="Enter Username"
					value={userName}
					onChange={e => setUserName(e.target.value)}
					required={true}
				/>
				<InputComponent
					label="password"
					labelText="Password"
					type="password"
					id="password"
					placeholder="Enter Password"
					value={password}
					onChange={e => {
						const newValue = e.target.value;
						setPassword(newValue);
						checkPassword(newValue); // Check the password validity immediately
						if (confirmPassword) {
							setPasswordMatch(newValue === confirmPassword);
						}
					}}
					required={true}
				/>

				<InputComponent
					label="password"
					labelText="Confirm Password"
					type="password"
					id="confirmPassword"
					placeholder="Enter Password Again"
					value={confirmPassword}
					onChange={e => {
						setConfirmPassword(e.target.value);
						if (password && e.target.value) {
							setPasswordMatch(e.target.value === password);
						}

						// check if password meets requirements
						checkPassword(e.target.value);
					}}
					required={true}
				/>
				{
					// span for password requirements
					passwordValid ? (
						''
					) : (
						<span
							className={`text-xs ${
								passwordValid
									? 'hidden'
									: 'text-primary-green-500'
							}`}
						>
							Password must contain at least 6 characters,
							including one uppercase letter, & one number.
						</span>
					)
				}

				<div className="text-red-500">
					{passwordMatch ? '' : 'Passwords do not match'}
				</div>

				{/* <!-- btn for signup --> */}
				<div className="">
					<button
						form="signup-form"
						type="submit"
						id="signup-btn-form"
						className={`${
							!passwordValid || !passwordMatch ? 'disabled' : ''
						}`}
						disabled={!passwordValid || !passwordMatch}
					>
						Sign Up
					</button>
				</div>
			</form>
		</>
	);
}

export default SignUpForm;
