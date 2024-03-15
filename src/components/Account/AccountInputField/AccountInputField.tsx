'use client';
import './AccountInputField.css';
import Avatar from '@/components/Account/Avatar/Avatar';
import { IUsers } from '@/types/database.interface';
import InputField from '@/components/Account/Inputfield/Inputfield';
import '@/components/Account/Inputfield/Inputfield';
import { useState } from 'react';
import { createSupbaseClient } from '@/lib/supabase/client';
import { ReturnComp } from '@/components/ProfileSettings/SettingsComponent/Nav/ClientComponents';
import { PASSWORD_MESSAGE, PASSWORD_REGEX } from '@/types/auth.constants';
import getLang from '@/app/translations/translations';
interface UserProfileProps {
	user: IUsers;
	userrole: string;
	lang?: string;
}

const AccountInputField = ({ user, userrole, lang }: UserProfileProps) => {
	const { name, email, username } = user;

	// limit split of lastname to 1
	const tmpLastName = name.split(' ').slice(1).join(' ');

	const [firstName, setFirstName] = useState<string>(name.split(' ')[0]);
	const [lastName, setLastName] = useState<string>(tmpLastName);
	const [newUsername, setNewUsername] = useState<string>(username);
	const [newEmail, setNewEmail] = useState<string>(email);
	const [emailFlag, setEmailFlag] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState({
		message: '',
		type: '',
	});

	const flagUpdates = () => {
		// Directly assign the comparison result to the flag
		const firstNameFlag = firstName !== name.split(' ')[0];
		const lastNameFlag = lastName !== tmpLastName;
		const usernameFlag = newUsername !== username;
		const emailFlag = newEmail !== email;

		// Update state based on the emailFlag
		setEmailFlag(emailFlag);
		return { firstNameFlag, lastNameFlag, usernameFlag, emailFlag };
	};
	const checkValidEmail = async (): Promise<{
		error: {
			message: string;
		};
		data: {
			email: string;
		};
	}> => {
		const resp = {
			error: {
				message: '',
			},
			data: {
				email: '',
			},
		};
		// function to check if #1 email valid and #2 email not in use
		const supabase = await createSupbaseClient();
		const { data, error } = await supabase
			.from('user')
			.select('email')
			.eq('email', newEmail);

		if (error) {
			resp.error.message = error.message;
			return resp;
		}

		// email is already in use
		if (data && data.length > 0) {
			resp.error.message = 'Email is already in use.';
			return resp;
		}

		// check if email is valid
		resp.data.email = newEmail;
		return resp;
	};

	const updateEmail = async () => {
		const supabase = await createSupbaseClient();

		// check if email is valid
		const validEmail = await checkValidEmail();
		if (validEmail.error.message) {
			setErrorMsg({
				message: validEmail.error.message,
				type: 'error',
			});
			setTimeout(() => {
				setErrorMsg({
					message: '',
					type: '',
				});
			}, 5000);
			return;
		}

		const { data, error } = await supabase.auth.updateUser({
			email: newEmail,
		});

		if (error) {
			console.log(error);
			setErrorMsg({
				message: error.message,
				type: 'error',
			});
			setTimeout(() => {
				setErrorMsg({
					message: '',
					type: '',
				});
			}, 5000);
			return;
		}
		setErrorMsg({
			message:
				'An email verification will be sent to the new email, please confirm the change.',
			type: 'success',
		});

		setTimeout(() => {
			setErrorMsg({
				message: '',
				type: '',
			});
		}, 5000);
		// refresh
	};

	const updateMetadata = async () => {
		const supabase = await createSupbaseClient();

		const { data, error } = await supabase
			.from('user')
			.update({
				username: newUsername,
				name: `${firstName} ${lastName}`,
			})
			.eq('id', user.id)
			.select();

		if (error) {
			setErrorMsg({
				message: error.message,
				type: 'error',
			});
			setTimeout(() => {
				setErrorMsg({
					message: '',
					type: '',
				});
			}, 5000);
		}
		// NOTE: display message that user data's has been updated; here commented for now
		window.location.reload();
	};

	// assure that when submission there is values that have been changed
	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const { firstNameFlag, lastNameFlag, usernameFlag, emailFlag } =
			flagUpdates();
		if (firstNameFlag || lastNameFlag || usernameFlag) {
			// some metadata has been updated
			await updateMetadata();
		}
		if (emailFlag) {
			// email has been updated
			await updateEmail();
		}
	};

	return (
		<>
			<div className="w-full bg-white">
				<div className="return-container">
					<ReturnComp />

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="h-10 w-10 mx-2 text-primary-green-600"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
						/>
					</svg>
					<div className="accounttitle">
						{getLang('Account', lang ? lang : 'english')}
					</div>
				</div>
				<div className="accountcontainer">
					<div className="accountinfo">
						<Avatar
							name={name}
							image={user.image}
						/>
						<div className="user-profile">
							<div className="name">{name}</div>
							<div className="role">{userrole}</div>
						</div>
					</div>

					<form
						className="account-inputs flex flex-col"
						onSubmit={handleSubmit}
					>
						{/* firstname */}
						<InputField
							label={getLang(
								'First Name',
								lang ? lang : 'english',
							)}
							value={firstName}
							setValue={setFirstName}
							placeholder={firstName}
							type="text"
						/>
						{/* last name */}
						<InputField
							label={getLang(
								'Last Name',
								lang ? lang : 'english',
							)}
							placeholder={lastName}
							value={lastName}
							setValue={setLastName}
							type="text"
						/>

						{/* username */}
						<InputField
							label={getLang('Username', lang ? lang : 'english')}
							placeholder={username}
							value={newUsername}
							setValue={setNewUsername}
							type="text"
						/>

						{/* email */}

						<InputField
							label={getLang('Email', lang ? lang : 'english')}
							placeholder={email}
							value={newEmail}
							setValue={setNewEmail}
							type="email"
						/>
						{
							// if email is not valid display span text
							errorMsg && (
								<span
									className={`text-sm text-center ${
										errorMsg.type === 'error'
											? 'text-primary-red-300'
											: 'text-primary-green-300'
									}`}
								>
									{errorMsg.message}
								</span>
							)
						}

						<button
							type="submit"
							className="btn btn-primary btn-medium mx-2 my-2 w-1/6"
						>
							{getLang('Save', lang ? lang : 'english')}
						</button>
					</form>
				</div>
				<AccountPasswordContainer lang={lang} />
			</div>
		</>
	);
};

export { AccountInputField };

function AccountPasswordContainer({ lang }: { lang?: string }) {
	const [newPassword, setNewPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');

	const [passwordValid, setPasswordValid] = useState<boolean>(true);

	const [flag, setFlag] = useState<any>({
		message: '',
		check: false,
	});

	const checkPassword = (password: string) => {
		// check if password meets requirements
		if (!PASSWORD_REGEX.test(password)) {
			setPasswordValid(false);
		} else {
			setPasswordValid(true);
		}
	};

	const resetFlag = () => {
		setTimeout(() => {
			setFlag({
				message: '',
				check: false,
			});
		}, 5000);
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			setFlag({
				message: 'Passwords do not match',
				check: true,
			});
			resetFlag();
			return;
		}

		// verify password meets requirements
		if (!PASSWORD_REGEX.test(newPassword)) {
			setFlag({
				message: PASSWORD_MESSAGE,
				check: true,
			});
			resetFlag();
			return;
		}

		const supabase = await createSupbaseClient();

		// update pasword
		const { data, error } = await supabase.auth.updateUser({
			password: newPassword,
		});

		if (error) {
			setFlag({
				message: error.message,
				check: true,
			});
			console.error(error);
			resetFlag();
			return;
		}

		setFlag({
			message: 'Password successfully updated',
			check: true,
		});
		resetFlag();
	};

	return (
		<div className="accountcontainer">
			<form
				className="account-inputs flex flex-col gap-2"
				onSubmit={handleSubmit}
			>
				<InputField
					label={getLang('New Password', lang ? lang : 'english')}
					placeholder="********"
					value={newPassword}
					// setValue={setNewPassword}
					setValue={value => {
						setNewPassword(value);
						checkPassword(value);
					}}
					type="password"
				/>

				<InputField
					label={getLang(
						'Confirm New Password',
						lang ? lang : 'english',
					)}
					placeholder="********"
					value={confirmPassword}
					// setValue={setConfirmPassword}
					setValue={value => {
						setConfirmPassword(value);
						checkPassword(value);
					}}
					type="password"
				/>
				{
					// span for password requirements
					!passwordValid && (
						<span className="text-sm text-primary-red-300 text-center">
							{PASSWORD_MESSAGE}
						</span>
					)
				}
				{
					// if password updated display span text
					flag.check && (
						<span className="text-sm text-primary-green-300 text-center">
							{flag.message}
						</span>
					)
				}

				<button
					type="submit"
					className="btn btn-primary btn-medium mx-2 my-2 w-1/6"
				>
					{getLang('Save', lang ? lang : 'english')}
				</button>
			</form>
		</div>
	);
}
