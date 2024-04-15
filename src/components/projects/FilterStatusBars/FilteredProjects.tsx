'use client';

import React, { useState, useEffect } from 'react';
import AddCard from '@/components/projects/AddCard';
import { ProjectCard } from '@/components/projects/ProjectCard';
import StatusBar from '@/components/projects/StatusBar/StatusBar';
import { IProjects, Roles, Status } from '@/types/database.interface';
import getLang from '@/app/translations/translations';
import '@/components/SharedComponents/InputComponent.css';
import { getLangPrefOfUser } from '@/lib/actions/client';
import translations from '../../../app/translations/language.json';

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
		}
	};

	return (
		<>
			<div className="flex flex-row grow">
				<div className="text-primary-green-600 text-4xl mt-1 font-bold px-2 py-1">
					{getLang('Projects', lang)}
				</div>
				<div className="flex flex-row flex-wrap justify-start text-white overflow-x-auto">
					{Object.values(Status).map(status => (
						<StatusBar
							key={status}
							status={getLang(status, lang)}
							onClick={() => onStatusClick(status)}
							active={currSelected.includes(status)}
							lang={lang}
						/>
					))}
				</div>
				<input
					type="search"
					placeholder="Search"
					className="input-forms max-w-40 outline-4"
					onKeyDown={onSearchKeyDown}
				/>
			</div>
			<div className="flex flex-col h-screen overflow-y-auto">
				<div className="flex-grow overflow-y-auto text-default-text h-full">
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 m-8">
						{role === Roles.SUPERVISOR || role === Roles.ADMIN ? (
							<AddCard org_id={org} />
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
