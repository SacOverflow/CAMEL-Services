'use client';

// CSS imports
import './Notifications.css';
import { Database } from '@/types/database.types';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getCookie, setCookie } from '@/lib/actions/client';
import { createSupbaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// get_unread_notifications;
interface Notification {
	notification_id: string;
	title: string;
	message: string;
	org_id: string;
	project_id: string;
	notification_created_at: Date;
	notification_status: Database['public']['Enums']['notification_status'];
	notification_read_at: Date;
	user_notification_created_at: Date;
	type: Database['public']['Enums']['notification_type'];
	reference_type: Database['public']['Enums']['notification_reference'];
	user_id: string;
}

export default function NotificationButton() {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const [currUser, setCurrUser] = useState<any>(null);
	const [showNotifications, setShowNotifications] = useState(false);
	const ref = useRef<HTMLButtonElement>(null);

	const getNotifications = async () => {
		const supabase = await createSupbaseClient();
		const { data: notification_user_view, error } = await supabase
			.from('notification_user_view')
			.select('*')
			.eq('notification_status', 'unread')
			.eq('org_id', getCookie('org'))
			.eq('user_id', currUser?.id)
			.order('notification_created_at', { ascending: false })
			.limit(40);

		if (error) {
			console.error(error);

			// set the notifications to an empty array
			setNotifications([]);
		} else {
			setNotifications(notification_user_view);
		}
	};

	// const updateNotifications = (notification_id: string) => {
	// 	// get the notification
	// 	const notificationRef = notifications.find(
	// 		n => n.notification_id === notification_id,
	// 	);
	// 	console.log('notification being updated, ', notificationRef);
	// 	const newNotifications = notifications.filter(
	// 		n => n.notification_id !== notification_id,
	// 	);

	// 	setNotifications(newNotifications);

	// 	// .from('user_notifications')
	// 	// .update({
	// 	// 	status: 'read',
	// 	// 	read_at: new Date(),
	// 	// })
	// 	// .eq('notification_id', notification_id)
	// 	// .eq('user_id', notifications[0].user_id)
	// 	// .select();
	// };

	useEffect(() => {
		// add event listener to close the notifications
		const handleClickOutside = (event: any) => {
			if (ref.current && !ref.current.contains(event.target)) {
				setShowNotifications(false);
			}
		};

		const getUser = async () => {
			const supabase = await createSupbaseClient();
			const { data, error } = await supabase.auth.getUser();

			if (error) {
				console.error(error);
			} else {
				setCurrUser(data?.user);
			}
		};

		getUser();

		document.addEventListener('mousedown', handleClickOutside);
		// getNotifications();

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};

		// get the notifications
	}, []);

	useEffect(() => {
		if (!currUser) {
			return;
		}
		getNotifications();
	}, [currUser]);

	return (
		<button
			ref={ref}
			id="notification-button"
			onClick={() => setShowNotifications(!showNotifications)}
		>
			<Image
				src="/images/wyncoservices.svg"
				alt="company logo"
				height={25}
				width={25}
				className="profile-company-logo"
			/>
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

			{showNotifications && notifications.length > 0 && (
				<NotificationsContainer
					notifications={notifications}
					// updateNotifications={updateNotifications}
				/>
			)}
		</button>
	);
}

const NotificationsContainer = ({
	notifications, // updateNotifications,
}: {
	notifications: Notification[];
	// updateNotifications: (notification_id: string) => void;
}) => {
	const [currentNotifications, setCurrentNotifications] =
		useState<Notification[]>(notifications);

	const removeNotificationAlert = async (notification: Notification) => {
		// updateNotifications(notification.notification_id);
		const newNotifications = currentNotifications.filter(
			n => n.notification_id !== notification.notification_id,
		);

		setCurrentNotifications(newNotifications);
	};

	return (
		<div className="notification-container">
			{currentNotifications.map((notification, idx) => (
				<NotificationCard
					notification={notification}
					markAsRead={() => removeNotificationAlert(notification)}
					key={idx}
				/>
			))}
		</div>
	);
};

const NotificationCard = ({
	notification,
	markAsRead,
}: {
	notification: Notification;
	markAsRead: () => void;
}) => {
	const router = useRouter();

	const createLink = () => {
		switch (notification.reference_type) {
			case 'project':
			case 'task':
				return `/projects/${notification.project_id}`;

			// redirect to project page
			case 'organization':
			default:
				// set the cookie and redirect
				setCookie('org', notification.org_id, 1);
				return '/dashboard';
		}
	};

	const markAsReadAction = async () => {
		// mark the notification as read
		const supabase = await createSupbaseClient();

		console.log('updating notification ref: ', notification);
		const { data, error } = await supabase
			.from('user_notifications')
			.update({
				status: 'read',
				read_at: new Date(),
			})
			.eq('notification_id', notification.notification_id)
			.eq('user_id', notification.user_id)
			.select();
		// const { data, error } = await supabase.rpc('update_user_notification', {
		// 	notification_id_p: notification.notification_id,
		// 	user_id_p: notification.user_id,
		// });

		console.log('updating notification', data, error);
		if (error) {
			console.error(error);
		} else {
			if (!data) {
				// update reference did not work...
				console.error('no data returned');
				return;
			}
			// remove the notification from the list
			markAsRead();
		}
	};

	const getCardColor = () => {
		switch (notification.type) {
			case 'updated':
				return 'bg-blue-100';
			case 'deleted':
				return 'bg-red-100';
			case 'created':
			default:
				return 'bg-green-100';
		}
	};

	const getIcon = () => {
		switch (notification.type) {
			case 'updated':
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="notification-icon updated"
					>
						<path
							fillRule="evenodd"
							d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
							clipRule="evenodd"
						/>
					</svg>
				);
			case 'deleted':
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="notification-icon deleted"
					>
						<path
							fillRule="evenodd"
							d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
							clipRule="evenodd"
						/>
					</svg>
				);
			case 'created':
			default:
				return (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="notification-icon created"
					>
						<path
							fillRule="evenodd"
							d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
							clipRule="evenodd"
						/>
					</svg>
				);
		}
	};

	return (
		<div
			className={`notification-card ${getCardColor()}`}
			onClick={() => {
				markAsReadAction();
				router.push(createLink());
			}}
		>
			{getIcon()}
			{/* </div> */}

			<div className="notification-content">
				<h3 className="notification-title">{notification.title}</h3>
				<p className="notification-message">
					<span>{notification.message}</span>
				</p>
			</div>

			{/* notification cancel / delete */}
			<div
				className="notification-cancel"
				onClick={(e: any) => {
					e.stopPropagation();
					e.preventDefault();
					markAsReadAction();
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="w-4 h-4"
				>
					<path
						fillRule="evenodd"
						d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
						clipRule="evenodd"
					/>
				</svg>
			</div>
		</div>
	);
};
