'use client';

import { IProjects, Roles, Status } from '@/types/database.interface';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useState } from 'react';
import { EditProjectModal } from '../EditProjectModal';
import getLang from '@/app/translations/translations';

// CSS imports
import './status.css';
import { deleteProject } from '@/lib/actions/client';
function capitalizeFirstLetterOfEachWord(str: string) {
	return str
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}
export const ProjectCard = ({
	project,
	role = Roles.MEMBER,
	lang,
}: {
	project: IProjects;
	role?: Roles;
	lang?: string;
}) => {
	const [editEnabled, setEditEnabled] = useState<IProjects | null>();

	const handleEditCloseModal = () => {
		setEditEnabled(null);
	};

	// method to retrieve timestamp in Month day, Year format
	const formatTimeStamp = (timestamp: Date) => {
		const date = new Date(timestamp);
		const options = { year: 'numeric', month: 'long', day: 'numeric' };

		return date.toLocaleDateString(undefined, options as any);
	};

	const getStatusColor = (status: Status) => {
		let color = '';
		switch (status) {
			case Status.InProgress:
				color = '#FACC14';
				break;
			case Status.Complete:
				color = '#166434';
				break;
			case Status.ActionNeeded:
				color = '#B91C1B';
				break;
			case Status.NeedsApproval:
				color = '#3B81F6';
				break;
			default:
				color = '';
				break;
		}
		return color;
	};

	const deleteProjHandler = async () => {
		const deleteResp = await deleteProject(project.id);

		if (deleteResp) {
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}
	};

	const getStatusClass = (status: Status) => {
		let statusClass = '';
		switch (status) {
			case Status.InProgress:
				statusClass = 'status-in-progress';
				break;
			case Status.Complete:
				statusClass = 'status-complete';
				break;
			case Status.ActionNeeded:
				statusClass = 'status-action-needed';
				break;
			case Status.NeedsApproval:
				statusClass = 'status-needs-approval';
				break;
			default:
				statusClass = '';
				break;
		}
		return statusClass;
	};

	return (
		<>
			<div className="project-cards">
				{/* Edit project button if they have perms */}
				<div>
					{role === Roles.SUPERVISOR ||
						(role === Roles.ADMIN && (
							<div className="edit-container">
								<button onClick={() => setEditEnabled(project)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2.0}
										stroke="currentColor"
										className="project-edit-icon"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
										/>
									</svg>
								</button>
								<button onClick={deleteProjHandler}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="project-delete-icon"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
										/>
									</svg>
								</button>
							</div>
						))}
				</div>

				<Link href={`/projects/${project.id}`}>
					<div className="flex gap-2 items-center justify-center">
						<div className="font-medium flex-1 w-3/4 overflow-x-auto whitespace-nowrap">
							{formatTimeStamp(project.created_at as Date)}
						</div>
						<div
							className={`status-bar ${getStatusClass(
								project.status,
							)} p-1 rounded-full text-gray-100 flex-1 text-start w-1/4 overflow-x-auto whitespace-nowrap `}
							style={{ fontSize: 'clamp(0.7rem, 1vh, 1rem)' }}
						>
							{getLang(
								capitalizeFirstLetterOfEachWord(project.status),
								lang ? lang : 'english',
							)}
						</div>
					</div>
					<div className="font-bold flex justify-center text-lg">
						{project.title}
					</div>
					<div>
						<div className="flex justify-center text-md">
							<FontAwesomeIcon
								icon={faWarehouse}
								size="4x"
								className={`status-${
									project.status
								} ${getStatusColor(project.status)} mt-2 mb-2`}
								color={getStatusColor(project.status)}
							/>
						</div>
						<div className="flex flex-col place-items-center text-md">
							<div>{project.address}</div>
						</div>
					</div>
				</Link>
			</div>
			{editEnabled && (
				<EditProjectModal
					onClose={handleEditCloseModal}
					project={project}
				/>
			)}
		</>
	);
};
