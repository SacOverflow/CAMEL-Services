import {
	getAllProjects,
	getOrganizationMemberRole,
	getUserInformation,
} from '@/lib/actions';
import { IProjects, Roles } from '@/types/database.interface';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// this is the new interactive client component that is being added to filter the status bars in Projects
import FilteredProjects from '@/components/projects/FilterStatusBars/FilteredProjects';

const page = async () => {
	// retrieve client info
	const userInfo = await getUserInformation();

	// check if the user has a valid organization stored in their cookies
	const cookieStore = cookies();
	const org = cookieStore.get('org')?.value as string;

	// if there is no cookie association with the use or the org, redirect to the organization page
	if (!org) {
		redirect('/organization');
	}
	const roleResponse = await getOrganizationMemberRole(org);
	const role: Roles = roleResponse?.role || '';

	// if role is supervisor or admin then retrieve all projects
	const projects: IProjects[] = await getAllProjects(org, userInfo?.id);

	return (
		<div className="w-full">
			<div className="flex flex-col justify-between m-1">
				<FilteredProjects
					projects={projects}
					role={role}
					org={org}
				/>
			</div>
		</div>
	);
};

export default page;
