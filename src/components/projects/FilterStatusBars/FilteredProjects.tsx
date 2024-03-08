'use client';

import AddCard from '@/components/projects/AddCard';
import { ProjectCard } from '@/components/projects/ProjectCard';
import StatusBar from '@/components/projects/StatusBar/StatusBar';
import { IProjects, Roles, Status } from '@/types/database.interface';
import { useState } from 'react';

export default function FilteredProjects({
	projects,
	role,
	org,
}: {
	projects: IProjects[];
	role: Roles;
	org: string;
}) {
	// use array for storing the users selections of filters
	const [currSelected, setCurrSelected] = useState([
		Status.Complete,
		Status.InProgress,
		Status.NeedsApproval,
		Status.ActionNeeded,
	]);
	// use the currently selected to filter and display projects to user
	const [filteredProjects, setFilteredProjects] =
		useState<IProjects[]>(projects);

	// utilize currSelected array to repopulate based on current slections; utilize such function aftert on clicks.
	// Function for clicking on the status bar; remove and update
	const onStatusClick = (status: Status) => {
		// Update the currSelected state
		setCurrSelected(prevSelected => {
			const updatedSelected = prevSelected.includes(status)
				? prevSelected.filter(s => s !== status)
				: [...prevSelected, status];

			// Retrieve the filtered projects with updated selection
			retrieveFilteredProjects(updatedSelected);

			return updatedSelected;
		});
	};

	// Utilize updatedSelected array to repopulate based on current selections
	const retrieveFilteredProjects = (updatedSelected: Status[]) => {
		// Filter the projects based on the updated selected array
		const filtered = projects.filter(project =>
			updatedSelected.includes(project.status),
		);

		// Update the filtered projects
		setFilteredProjects(filtered);
	};

	return (
		<>
			<div className="flex flex-row grow ">
				<div className="text-primary-green-600 text-4xl mt-1 font-bold px-2 py-1">
					Projects
				</div>
				<div className="flex flex-row justify-start text-white overflow-x-auto">
					{/* this all a component */}

					{/* function for clicking  */}
					<StatusBar
						status={Status.Complete}
						onClick={() => {
							onStatusClick(Status.Complete);
						}}
						active={currSelected.includes(Status.Complete)}
					/>
					<StatusBar
						status={Status.InProgress}
						onClick={() => {
							onStatusClick(Status.InProgress);
						}}
						active={currSelected.includes(Status.InProgress)}
					/>
					<StatusBar
						status={Status.NeedsApproval}
						onClick={() => {
							onStatusClick(Status.NeedsApproval);
						}}
						active={currSelected.includes(Status.NeedsApproval)}
					/>
					<StatusBar
						status={Status.ActionNeeded}
						onClick={() => {
							onStatusClick(Status.ActionNeeded);
						}}
						active={currSelected.includes(Status.ActionNeeded)}
					/>
					{/* this all a single component */}
				</div>
			</div>
			<div className="flex flex-col h-screen overflow-y-auto">
				<div>
					<div className="flex-grow overflow-y-auto text-default-text h-full">
						<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 m-4">
							{/* create new project if they have perms */}
							{role === Roles.SUPERVISOR ||
							role === Roles.ADMIN ? (
								<AddCard org_id={org} />
							) : null}
							{/* all associated or filtered projects */}

							{}
							{filteredProjects.length ? (
								// make use of the filteredProjects
								filteredProjects.map(project => (
									<ProjectCard
										key={project.id}
										project={project}
										role={role}
									/>
								))
							) : (
								<div className="no-projects text-center my-auto text-2xl text-primary-green-300 ">
									No projects found
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
