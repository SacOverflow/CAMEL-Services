// importing from index.ts since we're in app and not in Components
// need to make sure to import the name of function from index.ts after Hashem pushes
// after importing, to then grab the data like line 67, use the import
import {
	checkProjectMember,
	getMemberInformation,
	getOrganizationInformation,
	getOrganizationMemberRole,
	getProjectInformation,
	getMemberTasks,
	getMembersProjectActivities,
} from '@/lib/actions';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Poppins } from 'next/font/google';
import ProjectActivity from '@/components/Dashboard/project_activity/project_activity';
import { TasksSectionContainer } from '@/components/projects/ProjectTasks/server';
// CSS import
import './MemberProjects.css';
import { IOrganization, IProjects, ITasks } from '@/types/database.interface';
import Link from 'next/link';

// font design
const PoppinsSemiBold = Poppins({
	subsets: ['latin-ext'],
	weight: ['600'],
});
const PoppinsBold = Poppins({
	subsets: ['latin-ext'],
	weight: ['700'],
});

// exporting the function MemberProjects
export default async function MemberProjects({
	params,
}: {
	params: { member: string; id: string };
}) {
	const { member: userId, id: projectId } = params;
	// verify user has a cookie for org
	const cookieStore = cookies();
	const org = cookieStore.get('org')?.value as string;
	const projectTasks: ITasks[] | any = await getMemberTasks(
		userId,
		projectId,
	);
	// if there is no cookie association with the user for the org, redirect to the organization page
	if (!org) {
		redirect('/organization');
	}
	// Check if user has associaton to this current organization
	const roleResponse = await getOrganizationMemberRole(org);
	const role: string = roleResponse?.role || '';
	if (!role) {
		redirect('/organization');
	}

	// check if user has association with this project under this organization
	const orgAndProjectAssociation = await checkProjectMember(org, projectId);

	// if user has no association to this current project, redirect to the projects page
	if (!orgAndProjectAssociation) {
		redirect('/projects');
	}

	// fetch user information
	const userInfo = await getMemberInformation(userId);

	// get current project name
	const project: IProjects = await getProjectInformation(org, projectId);

	// get organization information
	const orgInfo: IOrganization = await getOrganizationInformation(org);

	// get members timestamps
	const timestamps = await getMembersProjectActivities(userId, projectId);

	// get project member's tasks, waiting for Hashem's commit on his branch to them implement here

	// TODO: get all activity for project for user
	return (
		<div className="members-project-page">
			<div className="profile-bg-layer">
				<span className={`organization-title`}>
					Organization: {` `}{' '}
					<b className={`${PoppinsSemiBold.className}`}>
						{orgInfo.name}
					</b>
				</span>
				<span className={`project-title`}>
					Project: {` `}
					<Link href={`/projects/${projectId}`}>
						<b className={`${PoppinsSemiBold.className}`}>
							{project.title}
						</b>
					</Link>
				</span>
				<Image
					src={userInfo.image}
					alt="profile background"
					width={50}
					height={50}
					className="user-img"
				/>
			</div>

			<div className={`profile-content`}>
				<div className="details">
					<div className={`name ${PoppinsBold.className}`}>
						{userInfo.name}
					</div>
					<div className={`role ${PoppinsSemiBold.className}`}>
						{'SUPERVISOR {DEMO}'}
					</div>
					{/* <div className="description">{userInfo.description}</div> */}
				</div>

				<TasksSectionContainer
					project_id={projectId}
					tasks={projectTasks}
					// role acts as check for delete ability; maybe use created_by
					role={role}
				/>

				<ProjectActivity
					className="member-projects-activity"
					activites={timestamps}
				/>
			</div>
		</div>
	);
}
