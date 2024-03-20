'use client';

import Image from 'next/image';
import Link from 'next/link';
import Buttons from '@/components/SharedComponents/Buttons';

// CSS imports
import './Navbar.css';
import { createSupbaseClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

import { Menu, Transition } from '@headlessui/react';

const profileDropdownOptions = [
	{
		name: 'Account',
		href: '/account',
	},
	{
		name: 'Organization',
		href: '/organization',
	},
	{
		name: 'Dashboard',
		href: '/dashboard',
	},
	{
		name: 'Projects',
		href: '/projects',
	},
	{
		name: 'Settings',
		href: '/settings',
	},
	{
		name: 'Sign Out',
		href: '/signout',
	},
];

const SearchBar = (props: { className?: string }) => {
	const { className } = props;
	return (
		<div className={`search-bar-container ${className}`}>
			{/* Search Bar*/}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth="1.5"
				stroke="currentColor"
				className="search-icon"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
				/>
			</svg>

			<input
				type="text"
				placeholder="Search something here..."
				className="search-bar"
			/>
		</div>
	);
};
/**
 *  Component for the navbar, which includes a logo, sign up button, and login button
 *
 * @returns a navbar component with a logo, sign up button, and login button
 */
function Navbar({ session }: { session: any }) {
	// not sure if appropriate right now how im passing in the values... since I pass in the users entire information....
	const loggedIn = session !== undefined;

	const [image, setImage] = useState('/images/hashemtmp.jpeg');

	// implement client-side data fetching
	useEffect(() => {
		// COMMENT: ahahaha ha, this is ummm ahahaha ha
		if (loggedIn) {
			const fetchInfo = async () => {
				const supabase = await createSupbaseClient();
				const { error, data } = await supabase
					.from('user')
					.select('*')
					.eq('id', session?.id)
					.single();

				// assure data info is some array
				if (data) {
					setImage(data?.image);
				}
			};

			fetchInfo();
		}
	}, []);
	const { email, username, name } = session || {};

	if (loggedIn) {
		return (
			<nav className="bg-primary-green-600 ">
				<div className="navbar-container">
					<Link
						href="/"
						className="flex items-center justify-center text-white font-bold tracking-widest"
					>
						{/* TODO: Retrieve proper sized svg file */}
						<Image
							src="/images/camel.svg"
							className="h-8"
							alt="CAMEL Logo"
							height={100}
							width={100}
						/>
						{'CAMEL'}
					</Link>

					{/* Search Bar*/}
					<SearchBar className="" />

					<div className="profile-container">
						{/* company image */}
						<Image
							src="/images/wyncoservices.svg"
							alt="company logo"
							height={25}
							width={25}
							className="profile-company-logo"
						/>

						<NotificationDropdown />

						{/* profile avatar */}
						<ProfileDropdown image={image} />
					</div>
				</div>
			</nav>
		);
	}

	return (
		<nav className="bg-primary-green-600 ">
			<div className="navbar-container">
				<Buttons
					variant="secondary"
					size="small"
					href="/signup"
					content="Sign Up"
					className="md:hidden"
				/>

				{/* Icon SVG */}
				<Link
					href="/"
					className="flex items-center justify-center"
				>
					{/* TODO: Retrieve proper sized svg file */}
					<Image
						src="/images/camel.svg"
						className="h-8 mr-3"
						alt="CAMEL Logo"
						height={100}
						width={100}
					/>
				</Link>
				<div className="btns-container">
					<Buttons
						variant="secondary"
						size="small"
						content="Sign Up"
						href="/signup"
						className="hidden md:block"
					/>
					<Buttons
						variant="primary"
						size="small"
						content="Login"
						href="/login"
					/>
				</div>
				<div id="navbar-sticky">
					<Link
						href="/"
						className="navbar-sticky-text"
						aria-current="page"
					>
						CAMEL
					</Link>
				</div>
			</div>
		</nav>
	);
}

const ProfileDropdown = ({ image }: { image: string }) => {
	const [imageSrc, setImageSrc] = useState('/images/hashemtmp.jpeg');
	const SignOut = async () => {
		const supabase = await createSupbaseClient();
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
		window.location.reload();
	};

	const getProfileImage = async () => {
		const supabase = await createSupbaseClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		const { data, error } = await supabase
			.from('user')
			.select('*')
			.eq('id', user?.id)
			.single();

		if (error) {
			console.error(error);
		}

		setImageSrc(data?.image);

		return data?.image;
	};
	return (
		<div className="relative z-50">
			<Menu>
				<Menu.Button className="profile-avatar">
					<Image
						src={imageSrc}
						onLoad={getProfileImage}
						alt="profile avatar"
						height={25}
						width={25}
						className="rounded-full h-8 w-8"
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="profile-avatar-arrow"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M19.5 8.25l-7.5 7.5-7.5-7.5"
						/>
					</svg>
				</Menu.Button>

				<Transition
					// as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="profile-avatar-items">
						<div className="px-1 py-1 ">
							{profileDropdownOptions.map((option, idx) => (
								<Menu.Item key={idx}>
									{({ active }) => (
										<Link
											href={option.href}
											// If href is signout call signout function
											onClick={
												option.href === '/signout'
													? SignOut
													: () => {}
											}
											className={`${
												active
													? 'bg-primary-green-300 text-white'
													: 'text-gray-900'
											} flex w-full items-center rounded-md px-2 py-2 text-sm`}
										>
											{option.name}
										</Link>
									)}
								</Menu.Item>
							))}
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
};

const NotificationDropdown = () => {
	const [lang, setLang] = useState('eng');
	const [notifications, setNotifications] = useState([]);
	//const translation: any = translations;

	useEffect(() => {
		/* Commendted out due to dependencies existing in different branch
		const getLanguage = async () => {
			const langPref = await getLangPrefOfUser();
			setLang(langPref);
		};*/
		const fetchNotifications = async () => {
			// Assume getUserNotification is an async function that fetches notifications
			const userNotifications: any = await fetchUserNotifications2();
			setNotifications(userNotifications);
		};

		//getLanguage();
		fetchNotifications();
	}, []);

	const getNotificationIcon = (tableName: string) => {
		if (tableName.includes('receipts')) {
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
					/>
				</svg>
			);
		} else if (tableName.includes('tasks')) {
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
					/>
				</svg>
			);
		} else {
			return (
				<img
					width="50"
					height="50"
					src="https://img.icons8.com/ios/50/jingle-bell.png"
					alt="jingle-bell"
				/>
			);
		}
	};

	const getNotificationTheme = (actionDesc: string) => {
		if (actionDesc.includes('added')) {
			return 'bg-green-500';
		} else if (actionDesc.includes('removed')) {
			return 'bg-red-500';
		} else {
			return 'bg-blue-500';
		}
	};

	return (
		<div className="relative z-50  ">
			<Menu as="div">
				<Menu.Button className="profile-avatar">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="notification-bell"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
						/>
					</svg>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="profile-avatar-arrow"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M19.5 8.25l-7.5 7.5-7.5-7.5"
						/>
					</svg>
				</Menu.Button>

				<Transition
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="max-h-[50vh] overflow-y-auto profile-avatar-items">
						{notifications.map((notification: any, idx) => (
							<Menu.Item key={idx}>
								{({ active }) => (
									<div
										className={`notification-item flex w-full h-15 items-center rounded-md px-2 py-2 text-sm ${getNotificationTheme(
											notification.action_desc,
										)} ${
											active ? 'active-notification' : ''
										}`}
									>
										{getNotificationIcon(
											notification.table_name,
										)}
										{notification.action_desc}
									</div>
								)}
							</Menu.Item>
						))}
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
};
export default Navbar;
/*

{profileDropdownOptions.map((option, idx) => (
	<Menu.Item key={idx}>
		{({ active }) => (
			<Link
				href={option.href}
				// If href is signout call signout function
				onClick={
					option.href === '/signout'
						? SignOut
						: () => {}
				}
				className={`${
					active
						? 'bg-primary-green-300 text-white'
						: 'text-gray-900'
				} flex w-full items-center rounded-md px-2 py-2 text-sm`}
			>
				{getLang(option.name)}
			</Link>
		)}
*/

/**
 *
 * @returns a notification object with the logic of changes
 */
export async function getUserNotification() {
	const supabase = await createSupbaseClient();
	const { data: userData, error: userError } = await supabase.auth.getUser();
	// from the table user_lang_pref select the pref lang based on the user_id
	const { data: resp, error } = await supabase
		.from('notifications')
		.select('item_id,table_name, item_id, action_desc, old_val, new_val')
		.eq('old_val', userData.user?.id);

	if (error) {
		console.error('getting user notification faild', error);
		return 'eng';
	} else {
		console.info('user notification is');
		console.info(resp);
		console.info(userData.user?.id);

		//console.warn('second fetch\n');
		//fetchUserNotifications2();
	}

	return resp[0];
}

async function fetchUserNotifications() {
	const supabase = await createSupbaseClient(); // Assume this function correctly initializes your Supabase client
	const { data: userData, error: userError } = await supabase.auth.getUser();
	const { data, error } = await supabase.rpc('get_notifications_for_user', {
		user_id: userData.user?.id,
	});

	if (error) {
		console.error('Error fetching notifications:', error);
		return [];
	}

	return data;
}
async function fetchUserNotifications2(): Promise<any[]> {
	const supabase = await createSupbaseClient(); // Ensure this function correctly initializes your Supabase client
	const { data: userData, error: userError } = await supabase.auth.getUser();
	const { data, error }: { data: any; error: any } = await supabase
		.from('notifications')
		.select('*');

	if (error) {
	} else {
		console.info('notifcation', data);
	}

	return data;
}
