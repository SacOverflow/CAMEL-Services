'use client';

import { useState } from 'react';
import { EditTaskForm } from '../NewTask';
// CSS import
import './AddNewTaskButton.css';

export function SearchBar({ proj_id, org }: { proj_id: string; org: string }) {
	const [isActive, setIsActive] = useState(false);

	const handleToggle = () => {
		setIsActive(!isActive);
	};

	return (
		<div className={`add-member-task-bar ${isActive ? 'active' : ''}`}>
			{isActive ? (
				<EditTaskForm
					// reasoning for setRefresh()??
					setRefresh={() => {}}
					project_id={proj_id}
					org_id={org}
					dismiss={() => {
						setIsActive(!isActive);
					}}
					newTask={true}
				/>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					className="add-icon"
					onClick={handleToggle}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 4.5v15m7.5-7.5h-15"
					/>
				</svg>
			)}
		</div>
	);
}
