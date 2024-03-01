'use client';

// CSS imports
import './UpdatePasswordForm.css';

import { useState, useEffect } from 'react';
import InputComponent from '@/components/SharedComponents/InputComponent';
import { createSupbaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/lib/actions/auth.client';

const PASSWORD_LENGTH = 6;
const PASSWORD_REGEX_STRING = `^(?=.*[a-zA-Z])(?=.*\d).{${PASSWORD_LENGTH},}$`;

function UpdatePasswordForm() {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordMatch, setPasswordMatch] = useState(true);
	const [accessToken, setAccessToken] = useState('');
	const [refreshToken, setRefreshToken] = useState('');
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [popupMessage, setPopupMessage] = useState<string>(
		'Password reset successful!',
	);
	const router = useRouter();

	//Used to parse the access_token and refresh_token from password recover email URL
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const hashParams = new URLSearchParams(
				window.location.hash.substring(1),
			);
			setAccessToken(hashParams.get('access_token') || '');
			setRefreshToken(hashParams.get('refresh_token') || '');
		}
	}, []);

	//Used to authenticate user with access_token and refresh_token to create session
	useEffect(() => {
		const getSessionWithTokens = async () => {
			const supabase = await createSupbaseClient();
			if (accessToken && refreshToken) {
				const { data, error } = await supabase.auth.setSession({
					access_token: accessToken,
					refresh_token: refreshToken,
				});

				if (error) {
					setPopupMessage(
						'Error updating password. Please try again later.',
					);
				}
			}
		};

		if (accessToken && refreshToken) {
			getSessionWithTokens();
		}
	}, [accessToken, refreshToken]);

	//Handles update password through updateUser method form Supabase
	const handlePasswordUpdate = async (newPassword: string) => {
		try {
			const { data, error } = await updatePassword(newPassword);

			setSubmitted(true);

			if (error) {
				setPopupMessage(
					'Error updating password. Please try again later.',
				);
				setTimeout(() => {
					setSubmitted(false);
					router.push('/recoverpassword');
				}, 3000);
			}

			if (data?.user) {
				setPopupMessage('Password reset successful!');
				setTimeout(() => {
					setSubmitted(false);
					router.push('/organization');
				}, 3000);
			} else {
				setPopupMessage(
					'Error updating password. Please try again later.',
				);
				setTimeout(() => {
					setSubmitted(false);
					router.push('/recoverpassword');
				}, 3000);
			}
		} catch (error) {
			setPopupMessage('Error updating password. Please try again later.');
			setTimeout(() => {
				setSubmitted(false);
				router.push('/recoverpassword');
			}, 3000);
		}
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		handlePasswordUpdate(password);
	};

	return (
		<form
			id="recover-password-form"
			onSubmit={handleSubmit}
		>
			<InputComponent
				label="password"
				labelText="Password"
				type="password"
				id="password"
				placeholder="Enter Password"
				pattern={PASSWORD_REGEX_STRING}
				value={password}
				onChange={e => setPassword(e.target.value)}
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

			{submitted && (
				<span className="reset-link-span">{popupMessage}</span>
			)}

			{/* <!-- btn for confirming password --> */}
			<div className="">
				<button
					type="submit"
					id="confirm-password-btn"
					className=""
				>
					Confirm
				</button>
			</div>
		</form>
	);
}

export default UpdatePasswordForm;
