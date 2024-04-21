'use client';

import React, { useState, useEffect } from 'react';
import { default as AddNewProjectCard } from '@/components/projects/AddCard';
import { ProjectCard } from '@/components/projects/ProjectCard';
import StatusBar from '@/components/projects/StatusBar/StatusBar';
import { IProjects, Roles, Status } from '@/types/database.interface';
import getLang from '@/app/translations/translations';
import '@/components/SharedComponents/InputComponent.css';
import { getLangPrefOfUser } from '@/lib/actions/client';

// Define the type for the component props
interface FilteredProjectsProps {
	projects: IProjects[];
	role: Roles;
	org: string;
	setSearchQuery?: (query: string) => void;
	retrieveFilteredProjects?: (
		selectedStatuses: Status[],
		query: string,
	) => void;
}

const FilteredProjects: React.FC<FilteredProjectsProps> = ({
	projects,
	role,
	org,
	setSearchQuery,
	retrieveFilteredProjects,
}) => {
	const [currSelected, setCurrSelected] = useState<Status[]>([
		Status.Complete,
		Status.InProgress,
		Status.NeedsApproval,
		Status.ActionNeeded,
	]);
	const [lang, setLang] = useState('eng');
	const [filteredProjects, setFilteredProjects] =
		useState<IProjects[]>(projects);
	const [searchQuery, setSearchQueryInternal] = useState('');

	useEffect(() => {
		const getLanguage = async () => {
			const langPref = await getLangPrefOfUser();
			setLang(langPref);
		};
		getLanguage();
	}, []);

	const onStatusClick = (status: Status) => {
		setCurrSelected(prevSelected => {
			const updatedSelected = prevSelected.includes(status)
				? prevSelected.filter(s => s !== status)
				: [...prevSelected, status];
			retrieveFilteredProjects &&
				retrieveFilteredProjects(updatedSelected, searchQuery);

			const filteredProjects = projects.filter(project => {
				return (
					updatedSelected.includes(project.status) &&
					(project.title.toLowerCase().includes(searchQuery) ||
						project.address.toLowerCase().includes(searchQuery))
				);
			});
			setFilteredProjects(filteredProjects);
			return updatedSelected;
		});
	};

	const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			const query = (event.target as HTMLInputElement).value;
			setSearchQuery
				? setSearchQuery(query)
				: setSearchQueryInternal(query);
			retrieveFilteredProjects &&
				retrieveFilteredProjects(currSelected, query);

			// if search query is empty, reset filtered projects to all projects
			if (!query) {
				setFilteredProjects(projects);
			}

			const searchQuery = query.toLowerCase();
			const filteredProjects = projects.filter(project => {
				return (
					project.title.toLowerCase().includes(searchQuery) ||
					project.address.toLowerCase().includes(searchQuery)
				);
			});
			setFilteredProjects(filteredProjects);
		}
	};

	return (
		<>
			<div className="flex flex-row grow">
				<div className="text-primary-green-600 text-4xl mt-1 font-bold px-2 py-1">
					{getLang('Projects', lang)}
				</div>
				<div className="md:flex flex-row flex-wrap justify-start text-white overflow-x-auto hidden">
					{/* this all a component */}

					{/* function for clicking  */}
					<StatusBar
						status={getLang(Status.Complete, lang)}
						onClick={() => {
							onStatusClick(Status.Complete);
						}}
						lang={lang}
						active={currSelected.includes(Status.Complete)}
					/>
					<StatusBar
						status={getLang(Status.InProgress, lang)}
						onClick={() => {
							onStatusClick(Status.InProgress);
						}}
						active={currSelected.includes(Status.InProgress)}
						lang={lang}
					/>
					<StatusBar
						status={getLang(Status.NeedsApproval, lang)}
						onClick={() => {
							onStatusClick(Status.NeedsApproval);
						}}
						active={currSelected.includes(Status.NeedsApproval)}
						lang={lang}
					/>
					{/**FIX ME WOOHOOO, HERE ~Hashem Jaber*/}
					<StatusBar
						lang={lang}
						status={Status.ActionNeeded}
						onClick={() => {
							onStatusClick(Status.ActionNeeded);
						}}
						active={currSelected.includes(Status.ActionNeeded)}
					/>
					{/* this all a single component */}
				</div>
				<input
					type="search"
					placeholder="Search"
					className="input-forms max-w-40 outline-4"
					onKeyDown={onSearchKeyDown}
					onChange={e => {
						if (e.target.value === '') {
							setSearchQueryInternal('');
							setFilteredProjects(projects);
						}
					}}
				/>
			</div>
			<div className="flex flex-row flex-wrap justify-start text-white overflow-x-auto md:hidden">
				{/* this all a component */}

				{/* function for clicking  */}
				<StatusBar
					status={getLang(Status.Complete, lang)}
					onClick={() => {
						onStatusClick(Status.Complete);
					}}
					lang={lang}
					active={currSelected.includes(Status.Complete)}
				/>
				<StatusBar
					status={getLang(Status.InProgress, lang)}
					onClick={() => {
						onStatusClick(Status.InProgress);
					}}
					active={currSelected.includes(Status.InProgress)}
					lang={lang}
				/>
				<StatusBar
					status={getLang(Status.NeedsApproval, lang)}
					onClick={() => {
						onStatusClick(Status.NeedsApproval);
					}}
					active={currSelected.includes(Status.NeedsApproval)}
					lang={lang}
				/>
				<StatusBar
					lang={lang}
					status={Status.ActionNeeded}
					onClick={() => {
						onStatusClick(Status.ActionNeeded);
					}}
					active={currSelected.includes(Status.ActionNeeded)}
				/>
			</div>
			<div className="flex flex-col h-screen overflow-y-auto">
				<div className="flex-grow overflow-y-auto text-default-text h-full">
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 m-8">
						{role === Roles.SUPERVISOR || role === Roles.ADMIN ? (
							<AddNewProjectCard org_id={org} />
						) : null}
						{filteredProjects.length ? (
							filteredProjects.map(project => (
								<ProjectCard
									key={project.id}
									project={project}
									role={role}
									lang={lang}
								/>
							))
						) : (
							<div className="no-projects text-center my-auto text-2xl text-primary-green-300">
								{getLang('No projects found', lang)}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default FilteredProjects;
