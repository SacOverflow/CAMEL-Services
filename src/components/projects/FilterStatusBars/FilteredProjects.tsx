'use client';

import AddCard from '@/components/projects/AddCard';
import { ProjectCard } from '@/components/projects/ProjectCard';
import StatusBar from '@/components/projects/StatusBar/StatusBar';
import { IProjects, Roles, Status } from '@/types/database.interface';
import { useEffect, useState } from 'react';
// CSS imports
import getLang from '@/app/translations/translations';
import '@/components/SharedComponents/InputComponent.css';
import { getLangPrefOfUser } from '@/lib/actions/client';
import translations from '../../../app/translations/language.json';
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
	const [lang, setLang] = useState('eng');
	useEffect(() => {
		const getLanguage = async () => {
			const langPref = await getLangPrefOfUser();
			setLang(langPref);
		};
		getLanguage();
	}, []);
	// use the currently selected to filter and display projects to user
	const [filteredProjects, setFilteredProjects] =
		useState<IProjects[]>(projects);
	const translation: any = translations;

	const [searchQuery, setSearchQuery] = useState('');

	// utilize currSelected array to repopulate based on current slections; utilize such function aftert on clicks.
	// Function for clicking on the status bar; remove and update
	const onStatusClick = (status: Status) => {
		// Update the currSelected state
		setCurrSelected(prevSelected => {
			const updatedSelected = prevSelected.includes(status)
				? prevSelected.filter(s => s !== status)
				: [...prevSelected, status];

			// Retrieve the filtered projects with updated selection
			retrieveFilteredProjects(updatedSelected, searchQuery);

			return updatedSelected;
		});
	};

	// Utilize updatedSelected array to repopulate based on current selections
	const retrieveFilteredProjects = (
		updatedSelected: Status[],
		query: string,
	) => {
		// Filter the projects based on the updated selected array and the search query
		const filtered = projects.filter(
			project =>
				updatedSelected.includes(project.status) &&
				project.title.toLowerCase().includes(query.toLowerCase()),
		);

		// Update the filtered projects
		setFilteredProjects(filtered);
	};
	const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			const query = (event.target as HTMLInputElement).value;
			setSearchQuery(query);
			retrieveFilteredProjects(currSelected, query);
		}
	};

	return (
		<>
			<div className="flex flex-row grow ">
				<div className="text-primary-green-600 text-4xl mt-1 font-bold px-2 py-1">
					{getLang('Projects', lang)}
				</div>
				<div className="flex flex-row flex-wrap justify-start text-white overflow-x-auto">
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
					{/* <input
                	type="search"
                	placeholder="Search"
                	className='input-forms max-w-40 border-4 outline-4'
					onKeyDown={onSearchKeyDown}
            		/> */}
					{/* this all a single component */}
				</div>
				<input
					type="search"
					placeholder="Search"
					className="input-forms max-w-40 outline-4"
					onKeyDown={onSearchKeyDown}
				/>
			</div>
			<div className="flex flex-col h-screen overflow-y-auto">
				<div>
					<div className="flex-grow overflow-y-auto text-default-text h-full">
						<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 m-8">
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
										lang={lang}
									/>
								))
							) : (
								<div className="no-projects text-center my-auto text-2xl text-primary-green-300 ">
									{getLang('No projects found', lang)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
