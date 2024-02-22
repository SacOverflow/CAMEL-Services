'use client';

import ProjectActivityModal from '@/components/projects/ProjectActivity';
import { deleteProjectActivity } from '@/lib/actions/client';
import {
	IProject_Activities,
	IUsers,
	Status,
} from '@/types/database.interface';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface MonthlyActivities {
	[key: string]: ActivityElement[];
}
interface ActivityElement {
	status: Status;
	color: string;
	member: string;
	lastUpdated: string;
	notes: string;
	age: string;
}

const Months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

const filterAndOrganizeActivities = (
	activities: IProject_Activities[],
): MonthlyActivities => {
	const monthlyActivities: any = {};

	const getColor = (status: Status) => {
		switch (status) {
			case Status.Complete:
				return 'bg-green-300';
			case Status.InProgress:
			case Status.ToDo:
				return 'bg-blue-500';
			case Status.NeedsApproval:
				return 'bg-orange-500';
			case Status.ActionNeeded:
			case Status.Cancelled:
				return 'bg-red-500';
			default:
				return 'bg-green-500';
		}
	};

	const lastUpdatedFormatting = (date: Date) => {
		const month = date.toLocaleString('default', { month: 'short' });
		const day = date.getDate();
		const hour = date.getHours();
		const minute = date.getMinutes();
		// return `${month} ${day} ${hour}:${minute}`;
		// return hour minute 12 hour format along with the date
		return `${month} ${day} ${
			hour % 12 !== 0 ? hour % 12 : '12'
		}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`;
	};

	const getRecency = (date: Date) => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (days === 0) {
			return 'Today';
		}
		return `${days}d ago`;
	};

	activities.forEach((activity: any) => {
		const date = new Date(activity.created_at);
		const month = date.toLocaleString('default', { month: 'short' });

		const val = {
			status: activity.status,
			color: getColor(activity.status),
			member: activity.user, // TODO: replace with user's name or username?!?!
			lastUpdated: lastUpdatedFormatting(new Date(activity.timestamp)),
			notes: activity.notes,
			age: getRecency(date),
			user_id: activity.user_id,
			project_id: activity.project_id,
			created_at: activity.created_at,
			timestamp: activity.timestamp,
			duration: activity.duration,
			id: activity?.id || (activity as any)?.activity_id,
		};

		if (monthlyActivities[month]) {
			monthlyActivities[month].push(val);
		} else {
			monthlyActivities[month] = [val];
		}
	});

	return monthlyActivities;
};

const ProjectActivity = ({
	className,
	activites,
	currUser,
}: {
	className?: string;
	activites?: IProject_Activities[];
	currUser?: IUsers;
}) => {
	const monthlyActivities: any = {
		Jan: [
			{
				status: 'Completed',
				color: 'bg-green-300',
				member: 'Jane Doe',
				lastUpdated: '01-15 10:30',
				notes: 'Lorem ipsum dolor sit amet...',
				age: '15d ago',
			},
			{
				status: 'Delayed',
				color: 'bg-red-500',
				member: 'Jim Beam',
				lastUpdated: '01-20 11:00',
				notes: 'Consectetur adipiscing elit...',
				age: '10d ago',
			},
			{
				status: 'Delayed',
				color: 'bg-red-500',
				member: 'Jim Beam',
				lastUpdated: '01-20 11:00',
				notes: 'Consectetur adipiscing elit...',
				age: '10d ago',
			},
		],
		Feb: [
			{
				status: 'Completed',
				color: 'bg-green-300',
				member: 'Jane Doe',
				lastUpdated: '01-15 10:30',
				notes: 'Lorem ipsum dolor sit amet...',
				age: '15d ago',
			},
			{
				status: 'Delayed',
				color: 'bg-red-500',
				member: 'Jim Beam',
				lastUpdated: '01-20 11:00',
				notes: 'Consectetur adipiscing elit...',
				age: '10d ago',
			},
			{
				status: 'In Review',
				color: 'bg-orange-500',
				member: 'Jack Daniels',
				lastUpdated: '02-05 09:20',
				notes: 'Sed do eiusmod tempor...',
				age: '28d ago',
			},
			{
				status: 'Delayed',
				color: 'bg-red-500',
				member: 'Jim Beam',
				lastUpdated: '01-20 11:00',
				notes: 'Consectetur adipiscing elit...',
				age: '10d ago',
			},
		],
		Mar: [
			{
				status: 'Completed',
				color: 'bg-green-300',
				member: 'Jane Doe',
				lastUpdated: '01-15 10:30',
				notes: 'Lorem ipsum dolor sit amet...',
				age: '15d ago',
			},
			{
				status: 'Delayed',
				color: 'bg-red-500',
				member: 'Jim Beam',
				lastUpdated: '01-20 11:00',
				notes: 'Consectetur adipiscing elit...',
				age: '10d ago',
			},
			{
				status: 'Delayed',
				color: 'bg-red-500',
				member: 'Jim Beam',
				lastUpdated: '01-20 11:00',
				notes: 'Consectetur adipiscing elit...',
				age: '10d ago',
			},
			{
				status: 'Completed',
				color: 'bg-green-300',
				member: 'Jane Doe',
				lastUpdated: '01-15 10:30',
				notes: 'Lorem ipsum dolor sit amet...',
				age: '15d ago',
			},
			{
				status: 'Delayed',
				color: 'bg-red-500',
				member: 'Jim Beam',
				lastUpdated: '01-20 11:00',
				notes: 'Consectetur adipiscing elit...',
				age: '10d ago',
			},
			{
				status: 'Delayed',
				color: 'bg-red-500',
				member: 'Jim Beam',
				lastUpdated: '01-20 11:00',
				notes: 'Consectetur adipiscing elit...',
				age: '10d ago',
			},
		],
		Apr: [
			{
				status: 'Deployed',
				color: 'bg-purple-600',
				member: 'Chita Rivera',
				lastUpdated: '04-12 14:30',
				notes: 'Ut enim ad minim veniam...',
				age: '22d ago',
			},
			{
				status: 'In Progress',
				color: 'bg-blue-500',
				member: 'Dewars White',
				lastUpdated: '04-18 16:00',
				notes: 'Quis nostrud exercitation...',
				age: '16d ago',
			},
			{
				status: 'Completed',
				color: 'bg-green-300',
				member: 'Jane Doe',
				lastUpdated: '01-15 10:30',
				notes: 'Lorem ipsum dolor sit amet...',
				age: '15d ago',
			},
			{
				status: 'Delayed',
				color: 'bg-red-500',
				member: 'Jim Beam',
				lastUpdated: '01-20 11:00',
				notes: 'Consectetur adipiscing elit...',
				age: '10d ago',
			},
			{
				status: 'Delayed',
				color: 'bg-red-500',
				member: 'Jim Beam',
				lastUpdated: '01-20 11:00',
				notes: 'Consectetur adipiscing elit...',
				age: '10d ago',
			},
		],
		May: [
			{
				status: 'On Hold',
				color: 'bg-yellow-500',
				member: 'Glen Fiddich',
				lastUpdated: '05-01 12:15',
				notes: 'Ullamco laboris nisi...',
				age: '3d ago',
			},
			{
				status: 'New',
				color: 'bg-green-500',
				member: 'Balvenie Scotch',
				lastUpdated: '05-03 10:50',
				notes: 'Ut aliquip ex ea commodo...',
				age: '1d ago',
			},
			{
				status: 'Completed',
				color: 'bg-green-300',
				member: 'Jane Doe',
				lastUpdated: '01-15 10:30',
				notes: 'Lorem ipsum dolor sit amet...',
				age: '15d ago',
			},
			{
				status: 'Delayed',
				color: 'bg-red-500',
				member: 'Jim Beam',
				lastUpdated: '01-20 11:00',
				notes: 'Consectetur adipiscing elit...',
				age: '10d ago',
			},
			{
				status: 'Delayed',
				color: 'bg-red-500',
				member: 'Jim Beam',
				lastUpdated: '01-20 11:00',
				notes: 'Consectetur adipiscing elit...',
				age: '10d ago',
			},
		],
	};
	const [currentMonth, setCurrentMonth] = useState('Mar'); // Default month
	const [timestamps, setTimestamps] =
		useState<MonthlyActivities>(monthlyActivities);

	const [viewModal, setViewModal] = useState(false);
	const [selectedActivity, setSelectedActivity] = useState<any>(null);

	useEffect(() => {
		if (activites) {
			const organizedActivities = filterAndOrganizeActivities(activites);
			// monthlyActivities = organizedActivities;
			setTimestamps(organizedActivities);

			// set the default month to the first month in the organizedActivities
			const firstMonth = Object.keys(organizedActivities)[0];
			setCurrentMonth(firstMonth);
		} else {
			setTimestamps(monthlyActivities);
			// set the default month to the first month in the organizedActivities
			const firstMonth = Object.keys(monthlyActivities)[0];
			setCurrentMonth(firstMonth);
		}
	}, [activites]);

	const handleMonthClick = (month: string) => {
		setCurrentMonth(month);
	};

	return (
		<>
			<div
				className={`max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg ${
					className ? ` ${className}` : ''
				}`}
			>
				<div className="overflow-x-auto">
					<table className="min-w-full table-auto rounded-lg">
						<thead className="bg-gray-200 rounded-t-lg">
							<tr>
								<th className="px-4 py-2 text-left rounded-tl-lg">
									Status
								</th>
								<th className="px-4 py-2 text-left">Member</th>
								<th className="px-4 py-2 text-left">
									Last Updated
								</th>
								<th className="px-4 py-2 text-left">Notes</th>
								<th className="px-4 py-2 text-left rounded-tr-lg">
									Duration
								</th>
								<th className="px-4 py-2 text-left rounded-tr-lg">
									Options
								</th>
							</tr>
						</thead>
						<tbody>
							{Object.keys(timestamps).length ? (
								timestamps[currentMonth as any].map(
									(activity: any, index: any) => (
										<tr
											key={index}
											className={`cursor-zoom-in border-b hover:bg-gray-200 transition-color duration-200 ease-in-out ${
												index ===
												monthlyActivities[
													currentMonth as keyof typeof Months
												].length -
													1
													? 'rounded-bl-lg rounded-br-lg'
													: ''
											}`}
											onClick={() => {
												setSelectedActivity(activity);
												setViewModal(true);
											}}
										>
											<ProjectActivityTimestamp
												activity={activity}
												currUserId={currUser?.id}
											/>
										</tr>
									),
								)
							) : (
								<tr>
									<td
										colSpan={5}
										className="px-4 py-2 text-center"
									>
										No activities found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<div className="flex justify-between text-sm mt-4">
					{Object.keys(timestamps).map(month => (
						<span
							key={month}
							onClick={() => handleMonthClick(month)}
							className={`cursor-pointer py-1 px-3 rounded-full ${
								currentMonth === month
									? 'bg-blue-500 text-white'
									: 'hover:bg-gray-100'
							}`}
						>
							{month}
						</span>
					))}
				</div>
			</div>
			{viewModal && (
				<ProjectActivityModal
					project_id={selectedActivity.project_id}
					project={selectedActivity}
					readMode={currUser?.id !== selectedActivity.user_id}
					closeModal={() => setViewModal(false)}
				/>
			)}
		</>
	);
};

const ProjectActivityTimestamp = ({
	activity,
	currUserId,
}: {
	activity: any;
	currUserId?: string;
}): JSX.Element => {
	const handleDelete = async (id: string) => {
		const resp = await deleteProjectActivity(id);
		if (resp) {
			window.location.reload();
		}

		// TODO: handle error
	};

	const displayDate = (date: string) => {
		const d = new Date(date);

		// get ISO date and time
		// return date as Feb 15, 2024 10:30 AM
		const month = d.toLocaleString('default', { month: 'short' });
		const day = d.getDate();
		const year = d.getFullYear();
		// return the hour in 12 hour format || if 0 then 12
		const formattedHour = d.getHours() % 12 || 12;
		const minute = d.getMinutes().toString().padStart(2, '0');
		const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
		return `${month} ${day} ${formattedHour}:${minute} ${ampm}`;
	};

	// convert number to H, MM format
	const convertDuration = (duration: number) => {
		const hours = Math.floor(duration / 60);
		const minutes = duration % 60;

		if (hours === 0 && minutes === 0) {
			return '0m';
		}

		if (hours === 0) {
			return `${minutes}m`;
		}

		if (minutes === 0) {
			return `${hours}h`;
		}

		return `${hours}h ${minutes}m`;
	};

	const getSinceTime = (date: string) => {
		const d = new Date(date);
		const now = new Date();
		const diff = now.getTime() - d.getTime();

		// get diff in minutes
		const minutes = Math.floor(diff / (1000 * 60)); // 1000ms * 60s
		// get diff in hours
		const hours = Math.floor(diff / (1000 * 60 * 60)); // 1000ms * 60s * 60m
		// get diff in days
		const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // 1000ms * 60s * 60m * 24h

		if (minutes < 60) {
			return `${minutes}m ago`;
		}

		if (hours < 24) {
			return `${hours}h ago`;
		}

		if (days === 0) {
			return 'Today';
		}

		return `${days}d ago`;
	};

	return (
		<>
			<td className="px-4 py-2 flex items-center">
				<span
					className={`inline-block w-3 h-3 mr-2 rounded-full ${activity.color}`}
				></span>
				{activity.status}
			</td>
			<td className="px-4 py-2">
				<Link
					href={`/projects/${activity.project_id}/member/${activity.user_id}`}
					className="text-black hover:text-gray-500 underline"
					onClick={e => e.stopPropagation()}
				>
					@{activity.member}
				</Link>
			</td>
			{/* <td className="px-4 py-2">{displayDate(activity.lastUpdated)}</td> */}
			<td className="px-4 py-2 flex flex-col">
				<span className="date-time">
					{displayDate(activity.lastUpdated)}
				</span>
				<span className="since-time text-gray-400 font-light">
					{/* {activity.age === 'Today' ? '' : `(${activity.age})`} */}
					{getSinceTime(activity.timestamp)}
				</span>
			</td>
			<td className="px-4 py-2 truncate max-w-xs">
				<div className="max-h-20 overflow-y-auto">{activity.notes}</div>
			</td>
			<td className="px-4 py-2">{convertDuration(activity.duration)}</td>
			<td className="px-4 py-2">
				{currUserId === activity.user_id && (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6 stroke-red-300 hover:stroke-red-500 cursor-pointer transition-all duration-300 ease-in-out z-10"
						onClick={e => {
							e.stopPropagation();
							handleDelete(activity.id);
						}}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				)}
			</td>
		</>
	);
};

export default ProjectActivity;
