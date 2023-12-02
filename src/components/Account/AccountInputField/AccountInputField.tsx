import './AccountInputField.css';
import Avatar from '@/components/Account/Avatar/Avatar';
import Buttons from '@/components/SharedComponents/Buttons';
import { IUsers_table } from '@/types/database.interface';
import InputField from '@/components/Account/Inputfield/Inputfield';
import '@/components/Account/Inputfield/Inputfield';

interface UserProfileProps {
	user: IUsers_table;
	userrole: string;
}

const AccountInputField = ({ user, userrole }: UserProfileProps) => {
	const { name, email, username } = user;

	// const handleSubmit = async (event: React.FormEvent) => {
	// 	const { data, error } = await supabase.auth.updateUser({email: 'new@email.com'});
	// };

	return (
		<>
			<div className="w-full">
				<div className="flex items-center ">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						className="h-10 w-10 mx-2 text-primary-green-600"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
						/>
					</svg>
					<div className="accounttitle">Account</div>
				</div>
				<div className="accountcontainer">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						className="w-10 h-10 text-primary-green-600"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
						/>
					</svg>

					<div className="accountinfo">
						<Avatar name={name} />
						<div className="user-profile">
							<div className="name">{name}</div>
							<div className="role">{userrole}</div>
						</div>
					</div>

					{/* firstname */}
					<InputField
						label="First Name"
						placeholder={name.split(' ')[0]}
						type="text"
						//onSubmit={handleSubmit('firstname')}
					/>
					{/* last name */}
					<InputField
						label="Last Name"
						placeholder={name.split(' ')[1]}
						type="text"
						//onSubmit={handleSubmit('lastname')}
					/>

					{/* username */}
					<InputField
						label="Username"
						placeholder={username}
						type="text"
						//onSubmit={handleSubmit('username')}
					/>

					{/* email */}
					<InputField
						label="Email"
						placeholder={email}
						type="email"
						//onSubmit={handleSubmit('email')}
					/>

					<Buttons
						variant="primary"
						content="Save"
						size="medium"
						className="mx-2 my-2"
					/>
					{/* <Buttons
						variant="primary"
						content="Reset Password"
						size="medium"
						className="mx-2 my-2"
					/> */}
				</div>
			</div>
		</>
	);
};

export { AccountInputField };
