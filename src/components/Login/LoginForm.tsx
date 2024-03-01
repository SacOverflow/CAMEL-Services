'use client';

import { useState } from 'react';
import InputComponent from '@/components/SharedComponents/InputComponent';
import Link from 'next/link';
import PopUp from '@/components/SignUp/PopUp';
import { useRouter } from 'next/navigation';
import { signInUser } from '@/lib/actions/auth.client';

// supabase import

function LoginForm() {
	const [emailOrUsername, setEmailOrUsername] = useState('');
	const [password, setPassword] = useState('');

	const [popup, setPopup] = useState(false);
	const [popupMsg, setPopupMsg] = useState('');

	const router = useRouter();

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		const response = await signInUser(emailOrUsername, password);

		if (response?.error) {
			setPopupMsg(response?.error?.message);
			setPopup(true);

			// close popup after 5 seconds
			setTimeout(() => {
				setPopupMsg('');
				setPopup(false);
			}, 5000);
			return;
		}

		// redirect to dashboard
		// assure client components get refreshed
		router.refresh();
		router.push('/dashboard');
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
				onSubmit={handleSubmit}
				method="post"
				id="login-form"
			>
				<InputComponent
					label="email"
					labelText="Email address / Username"
					type="text"
					id="email"
					placeholder="Enter Email / Username"
					value={emailOrUsername}
					onChange={e => setEmailOrUsername(e.target.value)}
					required={true}
				/>
				<InputComponent
					label="password"
					labelText="Password"
					type="password"
					id="password"
					placeholder="Enter Password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					required={true}
				/>

				<div className="flex justify-end md:justify-center">
					{/* <!-- forgot password right side --> */}
					<Link
						href="/recoverpassword"
						id="forgot-password"
					>
						Recover Password
					</Link>
				</div>

				{/* <!-- btn for login --> */}
				<div className="">
					<button
						type="submit"
						id="login-btn"
						className=""
						form="login-form"
					>
						Login
					</button>
				</div>
			</form>
		</>
	);
}

export default LoginForm;
