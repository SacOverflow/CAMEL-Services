import AddCard from '@/components/projects/AddCard';
import { ProjectCard } from '@/components/projects/ProjectCard';
import StatusBar from '@/components/projects/StatusBar/StatusBar';
import {
	getAllProjects,
	getOrganizationMemberRole,
	getUserInformation,
} from '@/lib/actions';
import { IProjects, Roles } from '@/types/database.interface';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const page = async () => {
	// retrieve client info
	const userInfo = await getUserInformation();

	// check if the user has a valid organization stored in their cookies
	const cookieStore = cookies();
	const org = cookieStore.get('org')?.value as string;

	// if there is no cookie association with the use ror the org, redirect to the organization page
	if (!org) {
		redirect('/organization');
	}
	const roleResponse = await getOrganizationMemberRole(org);
	const role: Roles = roleResponse?.role || '';

	// if role supervisor or admin retrieve all projects
	const projects: IProjects[] = await getAllProjects(org, userInfo?.id);

	return (
		<div className="w-full">
			<div className="flex flex-col justify-between m-1">
				<div className="flex flex-row grow ">
					<div className="text-primary-green-600 text-4xl mt-1 font-bold px-2 py-1">
						Projects
					</div>
					<div className="flex flex-row justify-start text-white overflow-x-auto">
						<StatusBar status="Completed" />
						<StatusBar status="In-Progress" />
						<StatusBar status="Needs-Approval" />
						<StatusBar status="Action-Needed" />
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
								{projects.length ? (
									projects.map(project => (
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
			</div>
		</div>
	);
};

export default page;
