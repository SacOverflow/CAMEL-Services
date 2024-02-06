import { IProjects, Status } from '@/types/database.interface';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import './status.css';

export const ProjectCard = ({ ...project }: IProjects) => {
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
		<div className="flex flex-col bg-gray-100 hover:bg-gray-300 rounded-md shadow-lg p-3 m-2 transition-all duration-500 ease-in-out">
			<Link href={`/projects/${project.id}`}>
				<div className="flex justify-between place-items-center space-x-2">
					<div className="font-medium flex-1">
						{formatTimeStamp(project.created_at as Date)}
					</div>
					<div
						className={`status-bar ${getStatusClass(
							project.status,
						)} py-1 px-2 rounded-full text-gray-100 flex-1 text-center`}
					>
						{project.status}
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
	);
};
