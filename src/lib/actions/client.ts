'use client';
import { ITasks, IUsers } from '@/types/database.interface';
import { createSupbaseClient } from '../supabase/client';

export const getCookie = (name: string): string => {
	const value = `; ${window.document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return parts.pop()?.split(';').shift() as string;
	}
	return '';
};

export const getOrganizationMembers = async (
	organization_id: string,
): Promise<IUsers[] | []> => {
	let resp: IUsers[] = [];

	const client = await createSupbaseClient();

	const { data, error: err } = await client
		.from('organization_member_view')
		.select('member_id, org_id, email, username, name, image, created_at')
		.eq('org_id', organization_id);

	// err return empty array
	if (err) {
		console.log(err);
		return resp;
	}

	// Map data to IUsers array and rename 'member_id' to 'id'
	const users: IUsers[] =
		data?.map(member => ({
			id: member.member_id,
			email: member.email,
			username: member.username,
			name: member.name,
			image: member.image,
			created_at: new Date(member.created_at),
		})) || [];

	resp = users;

	return resp;
};

export const getProjectMembers = async (
	org_id: string,
	project_id: string,
): Promise<IUsers[]> => {
	let resp: IUsers[] = [];

	const client = await createSupbaseClient();

	const { data, error: err } = await client
		.from('user_projects_view')
		.select('member_id, role')
		.eq('project_id', project_id)
		.eq('org_id', org_id);

	// err return empty array
	if (err) {
		console.log(err);
		return resp;
	}

	// utilize the member id to get user data now
	const member_ids = data?.map(member => member.member_id) || [];

	const users = await Promise.all(
		member_ids.map(async member_id => {
			const { data, error } = await client
				.from('user')
				.select('id, email, username, name, image, created_at')
				.eq('id', member_id);

			if (error) {
				console.log(error);
				return {} as IUsers;
			}

			return data?.length ? data[0] : ({} as IUsers); // Assuming {} is acceptable as IUsers
		}),
	);

	// Filter out any empty or error states
	resp = users.filter(user => Object.keys(user).length > 0);

	return resp;
};

export const inviteProjectMember = async (
	org_id: string,
	project_id: string,
	member_id: string,
): Promise<boolean> => {
	let resp = false;

	const client = await createSupbaseClient();

	const { data, error: err } = await client.from('projects_member').insert([
		{
			project_id: project_id,
			user_id: member_id,
		},
	]);

	if (err) {
		console.log(err);
		return resp;
	}

	resp = true;

	return resp;
};

export async function removeProjectMember(proj_id: string, user_id: string) {
	const supabase = await createSupbaseClient();

	// remove user from projects_member table
	const { error } = await supabase
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

export async function updateTask(task: ITasks) {
	const supabase = await createSupbaseClient();

	const { data, error } = await supabase
		.from('tasktmp')
		.update([{ ...task }])
		.select();
	if (error) {
		console.error(error.message);
		return false;
	} else {
		return true;
	}
}

export async function getMembersinTask(task: ITasks) {
	const supabase = await createSupbaseClient();

	const { data, error } = await supabase
		.from('tasks_member')
		.select('*')
		.eq('id', task.id);

	if (error) {
		console.error(error.message);
		return false;
	} else {
		return true;
	}
}

export async function addMembertoTask(task: ITasks, member_id: string) {
	const supabase = await createSupbaseClient();

	const { data, error } = await supabase
		.from('tasks_member')
		.select('*')
		.eq('id', task.id);

	if (error) {
		console.error(error.message);
		return false;
	} else {
		return true;
	}
}

export async function removeMemberFromTask(task: ITasks, member_id: string) {
	const supabase = await createSupbaseClient();

	const { error } = await supabase
		.from('tasks_member')
		.delete()
		.eq('user_id', member_id)
		.eq('task_id', task.id);

	if (error) {
		alert(JSON.stringify(error));
		return false;
	} else {
		return true;
	}
}

export async function getTasks(proj_id: string) {
	const supabase = await createSupbaseClient();

	const { data, error } = await supabase
		.from('tasks')
		.select('*')
		.eq('proj_id', proj_id);

	if (error) {
		return false;
	} else {
		return data;
	}
}
export async function getAllTasks(proj_id: string) {
	const supabase = await createSupbaseClient();

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

export async function getAllTaskMembers(task_id: string) {
	const supabase = await createSupbaseClient();

	const { data, error } = await supabase
		.from('tasks_member')
		.select('*')
		.eq('task_id', task_id);

	if (error) {
		console.error('Error getting task members', error);
		return [];
	}

	// retrieve users profiles
	const member_ids = data?.map(member => member.user_id) || [];
	const users = await Promise.all(
		member_ids.map(async member_id => {
			const { data, error } = await supabase
				.from('user')
				.select('id, email, username, name, image, created_at')
				.eq('id', member_id);

			if (error) {
				console.error('Error getting user', error);
				return {} as IUsers;
			}

			return data?.length ? data[0] : ({} as IUsers); // Assuming {} is acceptable as IUsers
		}),
	);

	// Filter out any empty or error states
	const resp = users.filter(user => Object.keys(user).length > 0);

	return resp;
}

export async function getAllNonTaskMembers(task_id: string) {
	const supabase = await createSupbaseClient();

	// retrieve the projects associated members
	const { data: orgMembers, error: orgMembersError } = await supabase
		.from('organization_member')
		.select('*')
		.eq('org_id', getCookie('org'));

	if (orgMembersError) {
		console.error('Error getting org members', orgMembersError);
		return [];
	}

	// retrieve the tasks associated members
	const { data: taskMembers, error: taskMembersError } = await supabase
		.from('tasks_member')
		.select('*')
		.eq('task_id', task_id);

	if (taskMembersError) {
		console.error('Error getting task members ', taskMembersError);
		return [];
	}

	// filter out the members that are not associated with the task
	const nonTaskMembers = orgMembers?.filter(
		orgMember =>
			!taskMembers?.some(
				taskMember => taskMember.user_id === orgMember.user_id,
			),
	);

	// retrieve user profiles for non task members
	const nonTaskMemberIds =
		nonTaskMembers?.map(member => member.member_id) || [];

	const { data: users, error: usersError } = await supabase
		.from('user')
		.select('*')
		.in('id', nonTaskMemberIds);

	if (usersError) {
		console.error('Error getting non task members', usersError);
		return [];
	}

	return users;
}

export async function deleteTask(task: ITasks) {
	const supabase = await createSupbaseClient();

	const { error } = await supabase.from('tasks').delete().eq('id', task.id);

	if (error) {
		console.error('Error deleting task', error);
		return false;
	} else {
		return true;
	}
}

export async function createTask(task: ITasks) {
	const supabase = await createSupbaseClient();

	// parse for creating whats needed
	const newRow: any = {
		status: task.status,
		title: task.title,
		due_date: task.due_date,
		project_id: task.project_id,
	};

	const { error } = await supabase.from('tasks').insert({ ...newRow });

	if (error) {
		console.error('Error creating task', error);
		console.info(task);
		return false;
	} else {
		return true;
	}
}

export async function getProjectMembersTasks(projectId: String) {
	try {
		const supabase = await createSupbaseClient();

		const {
			data: memberIds,
			error: memberError,
		}: { data: any; error: any } = await supabase
			.from('projects_member')
			.select('user_id')
			.eq('project_id', projectId);
		// console.error("Error fetching members on projects:", memberError);

		if (memberError) {
			console.info('error', memberError);
		}

		// Main query to get user data using the extracted member IDs

		const { data: users, error: usersError } = await supabase
			.from('user')
			.select('*')
			.in(
				'id',
				memberIds.map((member: any) => member.user_id),
			);
		if (usersError) {
			console.info('error', usersError);
		} else {
			console.info('fetching users worked');
		}

		return users;
	} catch (error) {
		//alert('"Error fetching project members:", error')
		console.error('Error fetching project members:', error);
	}

	// FIXME: find proper return ttype...
	return null;
}

export async function addTaskMember(
	project_id: string,
	task_id: string,
	user_id: string,
) {
	const supabase = await createSupbaseClient();

	const { data, error } = await supabase
		.from('tasks_member')
		.insert([
			{ project_id: project_id, task_id: task_id, user_id: user_id },
		])
		.select();
	console.error(JSON.stringify(error));
	return error ? false : true;
}
