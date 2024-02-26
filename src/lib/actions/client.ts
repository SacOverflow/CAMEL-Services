'use client';
import {
	IReceipts,
	IUsers,
	IProject_Activities,
	ITasks
} from '@/types/database.interface';

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

			return data?.length ? data[0] : ({} as IUsers);
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

export const insertReceipts = async (receipts: any) => {
	// 1. Create supabase client in order to interact with SUPABASE service
	const supabase = await createSupbaseClient();
	//alert(JSON.stringify(receipts));
	const insertData = {
		category: receipts?.category || null,
		created_at: receipts?.created_at,
		created_by: receipts?.created_by,
		img_id: 'tmp',
		org_id: receipts?.org_id,
		price_total: receipts?.price_total || 0,
		proj_id: receipts?.proj_id,
		store: receipts?.store || null,
		note: receipts?.note,
	};

	// 2. Create statement with client
	// insert into db with parsed content
	const { data, error } = await supabase
		.from('receipts')
		.insert([insertData]);

	// 3. Check error and response
	if (error) {
		//alert(JSON.stringify(error));
		return false;
	}

	// 4. Return response dependent on results
	return true;
};
export const updateReceipts = async (receipts: IReceipts) => {
	// 1. Create supabase client in order to interact with SUPABASE service
	const supabase = await createSupbaseClient();
	//alert(JSON.stringify(receipts));
	const insertData = {
		id: receipts?.id,
		category: receipts?.category || null,
		created_at: receipts?.created_at,
		created_by: receipts?.created_by,
		img_id: 'tmp',
		org_id: receipts?.org_id,
		price_total: receipts?.price_total || 0,
		proj_id: receipts?.proj_id,
		store: receipts?.store || null,
		note: receipts?.note,
	};

	// 2. Create statement with client
	// insert into db with parsed content
	const { data, error } = await supabase
		.from('receipts')
		.update([insertData])
		.eq('id', receipts.id);

	// 3. Check error and response
	if (error) {
		//alert(JSON.stringify(error));
		return false;
	}

	// 4. Return response dependent on results
	return true;
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

export async function deleteProjectActivity(activity_id: string) {
	const supabase = await createSupbaseClient();

	// remove user from projects_member table
	const { error } = await supabase
		.from('project_activities')
		.delete()
		.eq('id', activity_id);

	if (error) {
		console.error('Error removing project activity', error);
		return false;
	}

	return true;
}

export const editProjectActivity = async (
	activity: IProject_Activities,
	project_id: string,
): Promise<IProject_Activities> => {
	const supabase = await createSupbaseClient();
	// Function to format timestamp as UTC string
	const formatTimestampUTC = (date: Date) => {
		// check if date is valid
		if (typeof date === 'string') {
			date = new Date(date);
		}
		if (isNaN(date.getTime())) {
			console.log('error: ', 'date is invalid');
		}

		// Get UTC date components; format to store in ISO
		const year = date.getFullYear();
		const month = date.getMonth() + 1; // Month is zero-based, so add 1
		const day = date.getDate();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();

		// Format as YYYY-MM-DD HH:MM:SS
		return `${year}-${month.toString().padStart(2, '0')}-${day
			.toString()
			.padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	const insertData: any = {
		task_id: activity?.task_id !== '' ? activity.task_id : null,
		// NOTE: HANDLE LATER when allow inputs ni forms
		// project_id: activity?.project_id ? activity.project_id : null,
		// user_id: activity?.user_id ? activity.user_id : null,
		status: activity.status,
		notes: activity.notes,
		timestamp: formatTimestampUTC(activity.timestamp),
		duration: activity.duration,
	};

	// validate the object
	if (!insertData.task_id) {
		delete insertData.task_id;
	} else if (!insertData.timestamp) {
		delete insertData.timestamp;
		return {} as IProject_Activities;
	}

	const { data, error, status } = await supabase
		.from('project_activities')
		.update(insertData)
		.eq('id', `${activity.id}`)
		.eq('project_id', `${project_id}`)
		.select();

	if (error) {
		console.error('Error updating project activity:', error);
		return {} as IProject_Activities;
	}

	return data[0] as IProject_Activities;
};

export const createProjectActivity = async (
	activity: IProject_Activities,
	project_id: string,
): Promise<IProject_Activities> => {
	const supabase = await createSupbaseClient();

	// format timestamp
	const formatTimestampISO = (date: Date) => {
		// check if date is valid
		if (isNaN(date.getTime())) {
			return '';
		}
		const mm = date.getMonth() + 1; // getMonth() is zero-based
		const dd = date.getDate();
		const yyyy = date.getFullYear();
		const dateStr = `${yyyy}-${mm.toString().padStart(2, '0')}-${dd
			.toString()
			.padStart(2, '0')}`;

		const hh = date.getHours().toString().padStart(2, '0');
		const min = date.getMinutes().toString().padStart(2, '0');
		const ss = date.getSeconds().toString().padStart(2, '0');
		const timeStr = `${hh}:${min}:${ss}`;
		const timestamp = `${dateStr} ${timeStr}`;

		return timestamp;
	};

	const insertActivityInfo = {
		task_id: activity.task_id ? activity.task_id : null,
		project_id: project_id,
		user_id: activity.user_id ? activity.user_id : null,
		status: activity.status,
		notes: activity.notes,
		timestamp: formatTimestampISO(activity.timestamp),
		duration: activity.duration,
	};

	if (!insertActivityInfo.user_id) {
		console.log('error: ', 'user_id is required');
		return {} as IProject_Activities;
	}

	const { data, error } = await supabase
		.from('project_activities')
		.insert([insertActivityInfo])
		.select();

	if (error) {
		console.error('Error creating project activity:', error);
		return {} as IProject_Activities;
	}

	if (data?.length) {
		// created activity
		return data[0] as IProject_Activities;
	}

	return {} as IProject_Activities;
};

export async function updateTask(task:ITasks) {

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
		console.error(JSON.stringify(error));
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

const readReceipt_h = async (receiptId?: string) => {
	const supabase = await createSupbaseClient();
	let query = supabase.from('receipts').select('*');

	if (receiptId) {
		query = query.eq('id', receiptId);
	}

	const { data, error } = await query;

	if (error) {
		console.error('Failed to fetch receipt:', error);
		return { error: true, message: error.message };
	}

	return { error: false, data };
};

const updateReceipt_h = async (
	receiptId: string,
	updates: Record<string, any>,
) => {
	const supabase = await createSupbaseClient();
	const { data, error } = await supabase
		.from('receipts')
		.update(updates)
		.match({ id: receiptId });

	if (error) {
		console.error('Failed to update receipt:', error);
		return { error: true, message: error.message };
	}

	return { error: false, data };
};

const deleteReceipt_h = async (receiptId: string) => {
	const supabase = await createSupbaseClient();

	const { data, error } = await supabase
		.from('receipts')
		.delete()
		.match({ id: receiptId });

	if (error) {
		console.error('Failed to delete receipt:', error);
		return { error: true, message: error.message };
	}

	return { error: false, data };
};

// Function to create a new receipt
const createReceipt_h = async (
	receiptData: any,
	imageFile: File | null,
	DEFAULT_IMAGE: string,
) => {
	// Initialize Supabase client
	const supabase = await createSupbaseClient();

	// Attempt to get the current user from Supabase authentication
	const { data: userData, error: userError } = await supabase.auth.getUser();

	// Handle user authentication error
	if (userError) {
		console.error(
			"Failed to extract user info, please make sure you're signed in.",
		);
		return; // Exit the function if there's an error
	}

	// Initialize the URL for the receipt image
	let imageURL = DEFAULT_IMAGE;

	// Proceed with image upload if a new image file is provided and it's not the default image
	if (imageFile && imageURL !== DEFAULT_IMAGE) {
		// Create a unique hash for the image file
		const imageHash = Math.random().toString(36).substring(2);
		const imagePath = `public/${imageHash}`;

		// Upload the image to Supabase storage
		const { data, error: uploadError } = await supabase.storage
			.from('profile-avatars')
			.upload(imagePath, imageFile, {
				cacheControl: '3600', // Example cache control setting
			});

		// Handle image upload error
		if (uploadError) {
			console.error(
				'Failed to upload image of receipt, please try again.',
			);
			return; // Exit the function if there's an error
		}
		const {
			data: { publicUrl },
		} = supabase.storage
			.from('profile-avatars')
			.getPublicUrl(data?.path as string);
		// On successful upload, set the new image URL
		imageURL = publicUrl;
	}

	// Prepare the receipt data with the user ID and image URL
	const receiptPayload = {
		...receiptData,
		created_by: userData.user?.id, // Use the ID of the authenticated user
		image: imageURL, // Use the uploaded image URL or the default
	};

	// Insert the new receipt data into the 'receipts' table
	const { error: insertError } = await supabase
		.from('receipts')
		.insert([receiptPayload]);

	// Handle error on inserting receipt data
	if (insertError) {
		console.error('Receipt creation failed:', insertError.message);
		return; // Exit the function if there's an error
	}

	// Successfully created the receipt
	console.log('Receipt created successfully.');
};
