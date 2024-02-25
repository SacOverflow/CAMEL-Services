'use client';

import { ITasks, Status } from '@/types/database.interface';
import { Poppins } from 'next/font/google';
import { DeleteTask, SelectTask } from '../client';
import { useEffect, useState } from 'react';
import { createSupbaseClient } from '@/lib/supabase/client';

const PoppinsLight = Poppins({
	subsets: ['latin-ext'],
	weight: ['300'],
});

const PoppinsSemiBold = Poppins({
	subsets: ['latin-ext'],
	weight: ['600'],
});

export function ProjectTask({ task, role }: { task: ITasks; role: string }) {
	const { id, project_id, title, due_date, completed_date, status } = task;

	const [members, setMembers] = useState<string[]>();

	useEffect(() => {
		const fetchMembers = async () => {
			const supabase = await createSupbaseClient();
			const { data, error } = await supabase
				.from('tasks_view')
				.select('*')
				.eq('task_id', id);
			if (error) {
				console.log('error', error);
			}

			if (data && data.length > 0) {
				setMembers(data[0].members);
			} else {
				setMembers([]);
			}
		};

		fetchMembers();
	}, [task]);

	const getStatus = (status: Status) => {
		switch (status) {
			case Status.ToDo:
				return 'todo';
			case Status.InProgress:
				return 'inprogress';
			case Status.Complete:
				return 'complete';
			case Status.ActionNeeded:
			default:
				return 'actionneeded';
		}
	};

	return (
		<div className={`project-task ${PoppinsSemiBold.className}`}>
			<div
				className={`header status ${getStatus(
					status,
				)} flex justify-between w-full`}
			>
				<span className={``}>{status}</span>

				<div className="btn-container flex gap-2 items-center justify-center">
					<SelectTask task={task} />
					{(role === 'admin' || role === 'supervisor') && (
						<DeleteTask task={task} />
					)}
				</div>
			</div>

			<div
				className={`task-content ${getStatus(status)} ${
					PoppinsLight.className
				}`}
			>
				<div className="title">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						className="icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
						/>
					</svg>

					<span className="text">{title}</span>
				</div>

				<div className="date">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						className="icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
						/>
					</svg>

					<span className="text">
						{new Date(due_date).toLocaleDateString()}
					</span>
				</div>

				<div className="members">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						className="icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
						/>
					</svg>

					<span className="text text-ellipsis w-[20rem] max-w-[30rem]">
						{members?.map((member, idx) => {
							if (idx === members.length - 1) {
								return member;
							}

							return `${member}, `;
						})}
					</span>
				</div>
			</div>
		</div>
	);
}
