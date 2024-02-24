import {
	IProject_Activities,
	IProjects,
	IUsers,
} from '@/types/database.interface';
import { createSupbaseServerClientReadOnly } from '../supabase/server';

export async function readUserSession() {
	const supabase = await createSupbaseServerClientReadOnly();

	return supabase.auth.getSession();
}

export async function readUser() {
	const supabase = await createSupbaseServerClientReadOnly();

	return supabase.auth.getUser();
}

export async function getUserInformation() {
	const supabase = await createSupbaseServerClientReadOnly();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// get database information
	const { data: resp, error } = await supabase
		.from('user')
		.select('id, username, email, name, image')
		.eq('id', user?.id)
		.single();
	return resp;
}

export async function getOrganizationInformation(id: string) {
	const supabase = await createSupbaseServerClientReadOnly();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// get database information
	const { data: resp, error } = await supabase
		.from('organization')
		.select('*')
		.eq('id', id)
		.single();
	return resp;
}

export async function getOrganizationMemberRole(org_id: string) {
	const supabase = await createSupbaseServerClientReadOnly();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// get database information
	const { data: resp, error } = await supabase
		.from('organization_member')
		.select('role')
		.eq('org_id', org_id)
		.eq('member_id', user?.id)
		.single();
	return resp;
}

export async function getAllProjects(
	org_id: string,
	user_id?: string,
): Promise<IProjects[]> {
	const supabase = await createSupbaseServerClientReadOnly();

	const { data: projects, error: err } = await supabase
		.from('projects')
		.select('*')
		.eq('org_id', org_id)
		.order('start_date', { ascending: false });

	if (err) {
		console.error('Error getting projects', err);
		return [];
	}

	return projects;
}

export async function checkProjectMember(
	org_id: string,
	project_id: string,
): Promise<boolean> {
	const supabase = await createSupbaseServerClientReadOnly();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// check if the user is the adminstrator of the organization
	const { role } = (await getOrganizationMemberRole(org_id)) || {};

	// if this role is an admin of the current org, they have access to this project
	if (role === 'admin') {
		const { data: resp, error } = await supabase
			.from('projects')
			.select('*')
			.eq('id', project_id)
			.eq('org_id', org_id)
			.single();

		if (error) {
			console.error('Error getting project', error);
			return false;
		}

		// retrun the values of the project; for admin
		return resp;
	}

	// if here, then this user is not admin of org, so check association with project and org
	// check if this user has assocation with this project
	const { data: resp1, error: error1 } = await supabase
		.from('projects_member')
		.select('user_id')
		.eq('project_id', project_id)
		.eq('user_id', user?.id)
		.single();

	if (error1) {
		console.error('Error getting project member', error1);
		return false;
	}

	if (!resp1) {
		console.log('You are not a member of this project');
		return false;
	}

	// if this user isnt caught with no assocation above return true
	return true;
}

export async function getProjectInformation(org_id: string, proj_id: string) {
	const supabase = await createSupbaseServerClientReadOnly();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// get database information
	const { data: resp, error } = await supabase
		.from('projects')
		.select('*')
		.eq('id', proj_id)
		.eq('org_id', org_id)
		.single();

	// TODO: Handle error
	return resp;
}

export async function getProjectMembers(org_id: string, proj_id: string) {
	const supabase = await createSupbaseServerClientReadOnly();

	// retrieve user ids from projects_member table associated with this project
	const { data: resp, error } = await supabase
		.from('projects_member')
		.select('user_id')
		.eq('project_id', proj_id);

	if (error) {
		// TODO: handle errors
		console.error('Error getting project members', error);
		return [];
	}

	// if have response, utilize array from returned data to fetch user profile
	const usersData = await Promise.all(
		resp?.map(userID => {
			return supabase
				.from('user')
				.select('email, username, name, image, id')
				.eq('id', userID.user_id)
				.single()
				.then(({ data }) => data);
		}),
	);

	// append the user role to usersData
	// TODO: add interface types & store in types file
	const usersDataWithRole = await Promise.all(
		usersData?.map(async (user: any) => {
			const { data, error } = await supabase
				.from('organization_member')
				.select('role')
				.eq('org_id', org_id)
				.eq('member_id', user?.id)
				.single();

			const role = data?.role;

			return {
				...user,
				role,
			};
		}),
	);

	return usersDataWithRole;
}

/**
 * Remove a member from a project
 *
 * @param proj_id The project id associated with the member
 * @param user_id The user id to be removed from the project
 * @returns boolean value indicating success or failure
 */
export async function removeProjectMember(proj_id: string, user_id: string) {
	const supabase = await createSupbaseServerClientReadOnly();

	// remove user from projects_member table
	const { data: resp, error } = await supabase
		.from('projects_member')
		.delete()
		.eq('project_id', proj_id)
		.eq('user_id', user_id);

	if (error) {
		console.error('Error removing project member', error);
		return false;
	}

	return true;
}

/**
 * Get all tasks associated with a specific project id
 *
 * @param proj_id The project id to get all tasks from
 * @returns Array of tasks associated with the project
 */
export async function getAllTasks(proj_id: string) {
	const supabase = await createSupbaseServerClientReadOnly();

	const { data: tasks, error } = await supabase
		.from('tasks')
		.select('*')
		.eq('project_id', proj_id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error getting tasks', error);
		return [];
	}

	return tasks;
}

/**
 * Get the information of a specific user or member with the user id
 * provided; Null object if no user is found
 *
 * @param user_id The user id to get information from
 * @returns IUser object with user information
 */
export async function getMemberInformation(user_id: string) {
	const supabase = await createSupbaseServerClientReadOnly();

	// get database information
	const { data: resp, error } = await supabase
		.from('user')
		.select('id, username, email, name, image')
		.eq('id', user_id)
		.single();

	if (error) {
		console.error('Error getting user information', error);
		return {} as IUsers;
	}

	return resp;
}

/**
 * Get all activities associated with a specific project id and user id
 *
 * @param member_id The user id to get information from
 * @param project_id The project id to get information from
 * @returns Array of project activities
 */
export async function getMembersProjectActivities(
	member_id: string,
	project_id: string,
): Promise<IProject_Activities[]> {
	const supabase = await createSupbaseServerClientReadOnly();
	// get database information
	const { data, error } = await supabase
		.from('activity_view')
		.select('*')
		// filter by user id
		.eq('user_id', member_id)
		// filter by project id
		.eq('project_id', project_id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error getting project activities', error);
		return [];
	}

	return data as IProject_Activities[];
}

/**
 * Get all activities associated with a specific organization id; using view
 *
 * @param org_id The organization id to get information from
 * @returns Array of organization activities
 */
export async function getOrganizationProjectActivities(org_id: string) {
	const supabase = await createSupbaseServerClientReadOnly();

	// get database information
	const { data, error } = await supabase
		.from('activity_view')
		.select('*')
		.eq('organization_id', org_id)
		.order('created_at', { ascending: false });

	return data;
}

/**
 * Get all activities associated with a specific project id
 *
 * @param org_id The organization id to get information from
 * @param project_id The project id to get information from
 * @returns Array of project activities
 */
export async function getProjectActivities(
	org_id: string,
	project_id: string,
): Promise<IProject_Activities[]> {
	const supabase = await createSupbaseServerClientReadOnly();

	// get database information
	const { data, error } = await supabase
		.from('activity_view')
		.select('*')
		.eq('project_id', project_id)
		.order('created_at', { ascending: false });

	return data as IProject_Activities[];
}
export async function getMemberTasks(member_id: string, proj_id: string) {
	const supabase = await createSupbaseServerClientReadOnly();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// get database information
	const { data: tasks_id, error } = await supabase
		.from('tasks_member')
		.select('task_id')
		.eq('project_id', proj_id)
		.eq('user_id', member_id);
	error
		? console.error(
				'getMemberTasks phase 1 failed line 271, index.ts :\n',
				error,
		  )
		: console.info('getMemberTakss part 1 worked', tasks_id);

	if (error) {
		return [];
	} else {
		// console.log('tasks_id: ', tasks_id);
		// console.info(tasks_id[0].task_id);
		const { data: resp, error: respError } = await supabase
			.from('tasks')
			.select('*')
			.in(
				'id',
				tasks_id.map(obj => obj.task_id),
			);

		respError
			? console.error(
					'getMemberTasks failed phase 2, index.ts, detils:\n',
					respError,
			  )
			: console.info('getMemberTakss part 2 worked');

		// TODO: Handle error
		return resp;
	}
}
