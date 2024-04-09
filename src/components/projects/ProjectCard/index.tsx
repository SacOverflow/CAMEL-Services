'use client';

import { IProjects, Roles, Status } from '@/types/database.interface';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faPenToSquare, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useState } from 'react';
import { EditProjectModal } from '../EditProjectModal';
import getLang from '@/app/translations/translations';

import './status.css';
function capitalizeFirstLetterOfEachWord(str: string) {
	return str
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}
export const ProjectCard = async ({
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
			<div className="flex flex-col bg-gray-100 hover:bg-gray-300 rounded-md shadow-lg p-3 m-2 transition-all duration-500 ease-in-out">
				{/* Edit project button if they have perms */}
				<div>
					{role === Roles.SUPERVISOR || role === Roles.ADMIN ? (
						<div className="flex justify-end">
							<button onClick={() => setEditEnabled(project)}>
								<FontAwesomeIcon
									icon={faPenToSquare}
									size="2x"
								/>
							</button>
						</div>
					) : null}
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
