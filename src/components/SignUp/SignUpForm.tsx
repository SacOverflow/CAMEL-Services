'use client';

import { useState } from 'react';
import InputComponent from '@/components/SharedComponents/InputComponent';

import { useRouter } from 'next/navigation';
import PopUp from './PopUp';
import { signupNewUser } from '@/lib/actions/auth.client';

function SignUpForm() {
	const [emailOrUsername, setEmailOrUsername] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [userName, setUserName] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordMatch, setPasswordMatch] = useState(true);

	const [popup, setPopup] = useState(false);
	const [popupMsg, setPopupMsg] = useState('');

	const PASSWORD_LENGTH = 6;
	const PASSWORD_REGEX_STRING = `^(?=.*[a-zA-Z])(?=.*\\d).{${PASSWORD_LENGTH},}$`;
	const EMAIL_REGEX_STRING = '^[\\w\\-.]+@([\\w\\-]+\\.)+[\\w\\-]{2,4}$';
	const PASSWORD_REGEX = new RegExp(PASSWORD_REGEX_STRING);
	const router = useRouter();

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (!passwordMatch || !PASSWORD_REGEX.test(password)) {
			return;
		}

		// check if email valid using regex
		const EMAIL_REGEX = new RegExp(EMAIL_REGEX_STRING);

		const emailValid = EMAIL_REGEX.test(emailOrUsername);
		if (!emailValid) {
			setPopupMsg('Invalid email address');
			setPopup(true);

			setTimeout(() => {
				setPopupMsg('');
				setPopup(false);
			}, 5000);

			return;
		}

		const name = `${firstName} ${lastName}`;
		const resp: any = await signupNewUser(
			emailOrUsername,
			password,
			name,
			userName,
		);

		if (resp?.error) {
			// username already found
			if (
				resp?.error.message
					.toLowerCase()
					.includes('duplicate key value violates unique constraint')
			) {
				// user name or email already registered
				setPopupMsg('Username is already taken.');

				setTimeout(() => {
					setPopupMsg('');
					setPopup(false);
				}, 5000);
			} else if (
				resp?.error.message
					.toLowerCase()
					.includes('user already registered')
			) {
				setPopupMsg('Email is already taken.');

				setTimeout(() => {
					setPopupMsg('');
					setPopup(false);
				}, 5000);
			}
			// encountered error
			setPopupMsg(resp.error?.message || 'Something went wrong.');
			setPopup(true);

			setTimeout(() => {
				setPopupMsg('');
				setPopup(false);
			}, 5000);

			return;
		}

		// else if no error caught above redirect with new session
		// redirect to signin page
		router.push('/dashboard');
		router.refresh();
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
				id="signup-form"
				onSubmit={handleSubmit}
			>
				<InputComponent
					label="firstName"
					labelText="First Name"
					type="text"
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
					type="text"
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
					pattern={EMAIL_REGEX_STRING}
					placeholder="Enter Email"
					value={emailOrUsername}
					onChange={e => setEmailOrUsername(e.target.value)}
					required={true}
				/>
				<InputComponent
					label="Username"
					labelText="Username"
					type="text"
					id=""
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
					pattern={PASSWORD_REGEX_STRING}
					value={password}
					onChange={e => {
						setPassword(e.target.value);
						setPasswordMatch(e.target.value === confirmPassword);
					}}
					required={true}
				/>
				<InputComponent
					label="password"
					labelText="Confirm Password"
					type="password"
					id="confirmPassword"
					placeholder="Enter Password Again"
					pattern={PASSWORD_REGEX_STRING}
					value={confirmPassword}
					onChange={e => {
						setConfirmPassword(e.target.value);
						setPasswordMatch(e.target.value === password);
					}}
					required={true}
				/>

				<div className="text-red-500">
					{passwordMatch ? '' : 'Passwords do not match'}
				</div>

				{/* <!-- btn for signup --> */}
				<div className="">
					<button
						form="signup-form"
						type="submit"
						id="signup-btn-form"
						className=""
					>
						Sign Up
					</button>
				</div>
			</form>
		</>
	);
}

export default SignUpForm;
