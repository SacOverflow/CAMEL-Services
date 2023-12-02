'use client';

import { useState } from 'react';
import InputComponent from '@/components/SharedComponents/InputComponent';
import { createSupbaseClient } from '@/lib/supabase/client';
import './RecoverPasswordForm.css';

function RecoverPasswordForm() {
	const [emailOrUsername, setEmailOrUsername] = useState('');
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [popupMessage, setPopupMessage] = useState<string>(
		'Reset link sent! Please check your email.',
	);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const supabase = await createSupbaseClient();

		const { data, error } = await supabase.auth.resetPasswordForEmail(
			emailOrUsername,
			{
				redirectTo: `${window.location.origin}`,
			},
		);

		setSubmitted(true);
		if (error) {
			setPopupMessage('Error occured, please try again.');

			setTimeout(() => {
				setSubmitted(false);
				window.location.reload();
			}, 5000);
		}

		if (data) {
			setSubmitted(true);
			setPopupMessage('Reset link sent! Please check your email.');

			setTimeout(() => {
				setSubmitted(false);
			}, 5000);
		}
	};

	return (
		<form
			id="recover-password-form"
			onSubmit={handleSubmit}
		>
			<InputComponent
				label="email"
				labelText="Email address"
				type="email"
				id="email"
				// pattern="^(?=.{3,50}$)([a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}|[a-zA-Z][a-zA-Z0-9_\.]{2,19})$"
				placeholder="Enter Email"
				value={emailOrUsername}
				onChange={e => setEmailOrUsername(e.target.value)}
				required={true}
			/>

			{submitted && (
				<span className="reset-link-span">{popupMessage}</span>
			)}

			{/* <!-- btn for sending password reset link --> */}
			<div className="">
				<button
					type="submit"
					id="recover-password-btn"
					className=""
					form="recover-password-form"
				>
					Send Password Reset Link
				</button>
			</div>
		</form>
	);
}

export default RecoverPasswordForm;
