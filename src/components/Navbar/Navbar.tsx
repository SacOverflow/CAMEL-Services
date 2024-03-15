'use client';

import Image from 'next/image';
import Link from 'next/link';
import Buttons from '@/components/SharedComponents/Buttons';

// CSS imports
import './Navbar.css';
import { createSupbaseClient } from '@/lib/supabase/client';
import { getLangPrefOfUser } from '@/lib/actions/client';
import { useEffect, useState } from 'react';
import translations from '../../app/translations/language.json';
import getLang from '@/app/translations/translations';
import { Menu, Transition } from '@headlessui/react';
import SearchBar from '@/components/Navbar/Searchbar';
import NotificationButton from './Notifications';

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

/**
 *  Component for the navbar, which includes a logo, sign up button, and login button
 *
 * @returns a navbar component with a logo, sign up button, and login button
 */

function Navbar({ session }: { session: any }) {
	// not sure if appropriate right now how im passing in the values... since I pass in the users entire information....
	const loggedIn = session !== undefined;

	const [image, setImage] = useState('/images/hashemtmp.jpeg');
	const [lang, setLang] = useState('eng');

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

			const getLanguage = async () => {
				const langPref = await getLangPrefOfUser();
				setLang(langPref);
			};

			fetchInfo();
			getLanguage();
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
						<NotificationButton />
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
	const [lang, setLang] = useState('eng');
	const translation: any = translations;

	useEffect(() => {
		// COMMENT: ahahaha ha, this is ummm ahahaha ha

		const getLanguage = async () => {
			const langPref = await getLangPrefOfUser();
			setLang(langPref);
		};

		getLanguage();
	}, []);

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
											{getLang(option.name, lang)}
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
export default Navbar;
