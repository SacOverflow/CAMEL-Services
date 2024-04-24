'use client';
import {
	IReceipts,
	IUsers,
	IProject_Activities,
	ITasks,
	IProjects,
} from '@/types/database.interface';

import { createSupbaseClient } from '../supabase/client';

interface ReceiptResponse {
	error: boolean;
	message?: string;
	data?: IReceipts[]; // Use your interface here
	receipts?: IReceipts[]; // Also adjust this if needed
}

export const getCookie = (name: string): string => {
	const value = `; ${window.document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return parts.pop()?.split(';').shift() as string;
	}
	return '';
};

export const setCookie = (
	name: string,
	value: string,
	expirationDays: number,
): void => {
	// const date = new Date();
	// date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
	// window.document.cookie = `${name}=${value};path=/;expires=${date.toUTCString()}`;

	// no expiration days
	window.document.cookie = `${name}=${value};path=/`;
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

export const inviteMemberToOrg = async (userId: any): Promise<boolean> => {
	let resp = false;
	const org = getCookie('org');

	// Search with supabase if user exists
	const supabase = await createSupbaseClient();

	// insert the new user into the organization_member table
	const { data: newOrgMember, error: newOrgMemberError } = await supabase
		.from('organization_member')
		.insert([
			{
				member_id: userId,
				org_id: org,
				role: 'member',
			},
		])
		.select('*');

	if (newOrgMemberError) {
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

	const { data: tasks_member, error } = await supabase
		.from('tasks_member')
		.select('*')
		.eq('task_id', task.id);

	if (error) {
		console.error('Failed to fetch members in task:', error);
		return { error: true, message: 'Failed to fetch members in task' };
	} else {
		return { error: false, data: tasks_member };
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
	const note = task?.notes || 'no notes';

	// parse for creating whats needed
	const newRow: any = {
		status: task.status,
		title: task.title,
		due_date: task.due_date,
		project_id: task.project_id,
		notes: note,
	};

	const { error } = await supabase.from('tasks').insert({ ...newRow });

	if (error) {
		console.error('Error creating task', error);
		console.info(task);
		return {
			error: true,
			message: 'Failed to create task',
		};
	}

	return { error: false };
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

	if (error) {
		console.error('Failed to add task member:', error);
		return { error: true, message: 'Failed to add task member' };
	}

	return { error: false };
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

/*
Create new organization
returns a sorted reciept lists based on newest to oldest date of creation.
org id required*/

const createNewOrganization = async (
	created_by: string,
	name: string,
	image: string,
) => {
	const supabase = await createSupbaseClient();

	const { data, error } = await supabase
		.from('organization')
		.insert([{ name: name, image: image, created_by: created_by }])
		.select();

	//assending false means it orders/sorts it based on newest to oldest
	//.order('created_at', { ascending: false });
	if (error) {
		console.error('Failed to create organization:', error);
		//If error in supabase api fetching then object of error and error message is returned
		return { error: true, message: error.message };
	}
	return { error: false, data, response: 200 };
};

/*
Get all organizations that a user is an admin from
returns a list of organizations that a user is in
user_ id required*/

const getAllUsersOrgs = async (user_id: string) => {
	const supabase = await createSupbaseClient();

	const { data, error } = await supabase
		.from('organization_member')
		.select('org_id')
		.eq('member_id', user_id);

	//assending false means it orders/sorts it based on newest to oldest
	//.order('created_at', { ascending: false });
	if (error) {
		console.error('Failed to create organization:', error);
		//If error in supabase api fetching then object of error and error message is returned
		return { error: true, message: error.message };
	}
	const { data: organizations, error: error_get_org_list } = await supabase
		.from('organization')
		.select('*')
		.in('id', data);

	if (error_get_org_list) {
		console.error('Failed to create organization:', error);
		//If error in supabase api fetching then object of error and error message is returned
		return { error: true, message: error_get_org_list.message };
	}

	return { error: false, data: organizations, response: 200 };
};

/*
Update organization
returns the updated organization based on newest to oldest date of creation.
org id required, name and image not required*/

const updateOrganization = async (
	org_id: string,
	name: string,
	image: string,
) => {
	const supabase = await createSupbaseClient();

	const { data, error } = await supabase
		.from('organization')
		.update([{ name: name, image: image, created_by: org_id }])
		.eq('org_id', org_id)
		.select();

	//assending false means it orders/sorts it based on newest to oldest
	//.order('created_at', { ascending: false });
	if (error) {
		console.error('Failed to create organization:', error);
		//If error in supabase api fetching then object of error and error message is returned
		return { error: true, message: error.message };
	}
	return { error: false, data, response: 200 };
};

/*
Delete organization
deletes an organization based on the passed id, and but check before if
org id, memeber_id required*/

export const deleteOrganizationById = async (org_id: string) => {
	const supabase = await createSupbaseClient();
	const { data, error } = await supabase
		.from('organization')
		.delete()
		.eq('id', org_id);

	if (error) {
		console.error('Failed to create organization:', error);
		//If error in supabase api fetching then object of error and error message is returned
		return false;
	}
	return true;
};

const deleteOrganization = async (org_id: string, member_id: string) => {
	const supabase = await createSupbaseClient();

	const { data, error } = await supabase
		.from('organization_member')
		.select('org_id')
		.eq('member_id', member_id);

	//assending false means it orders/sorts it based on newest to oldest
	//.order('created_at', { ascending: false });
	if (error) {
		console.error('Failed to create organization:', error);
		//If error in supabase api fetching then object of error and error message is returned
		return { error: true, message: error.message };
	}

	return { error: false, data, response: 200 };
};

/*
Get All receipts based on project ID
returns a sorted reciept lists based on newest to oldest date of creation.
project id required*/
export const getAllReceiptsByProject = async (project_id: string) => {
	const supabase = await createSupbaseClient();
	//If project Id is provided then query supabase api
	if (project_id) {
		const { data: receipts, error } = await supabase
			// from table name 'receipts' TODO: Maybe provide a object called SupaBaseTableNames ?, just an idea  ~Hashem Jaber
			.from('receipts')
			.select('*')
			.eq('proj_id', project_id)
			//assending false means it orders/sorts it based on newest to oldest
			.order('created_at', { ascending: false });
		if (error) {
			console.error('Failed to fetch receipt:', error);
			//If error in supabase api fetching then object of error and error message is returned
			return { error: true, message: error.message };
		}
		return { error: false, receipts };
	} else {
		//If Project Id not provided then return with error message
		return { error: true, message: 'no project Id provided' };
	}
};

/*
Get All receipts based on organization ID
returns a sorted reciept lists based on newest to oldest date of creation.
org id required*/
export const getAllReceiptsByOrganization = async (org_id: string) => {
	const supabase = await createSupbaseClient();

	//If org_id Id is provided then query supabase api
	if (org_id) {
		const { data: receipts, error } = await supabase
			// from table name 'receipts' TODO: Maybe provide a object called SupaBaseTableNames ?, just an idea  ~Hashem Jaber
			.from('receipts')
			.select('*')
			.eq('org_id', org_id)
			//assending false means it orders/sorts it based on newest to oldest
			.order('created_at', { ascending: false });
		if (error) {
			console.error('Failed to fetch receipt:', error);
			//If error in supabase api fetching then object of error and error message is returned
			return { error: true, message: error.message };
		}
		return { error: false, receipts };
	} else {
		//If Project Id not provided then return with error message
		return { error: true, message: 'no organization Id provided' };
	}
};

/*
Get All receipts based on user ID and project ID 
returns a sorted reciept lists based on newest to oldest date of creation.
user_id and project_id required*/
export const getAllReceiptsByUserAndProject = async (
	user_id: string,
	project_id: string,
) => {
	const supabase = await createSupbaseClient();

	//If user_id and project_id  is provided then query supabase api
	if (user_id && project_id) {
		const { data: receipts, error } = await supabase
			// from table name 'receipts' TODO: Maybe provide a object called SupaBaseTableNames ?, just an idea  ~Hashem Jaber
			.from('receipts')
			.select('*')
			.eq('user_id', user_id)
			.eq('proj_id', project_id)
			//assending false means it orders/sorts it based on newest to oldest
			.order('created_at', { ascending: false });
		if (error) {
			console.error('Failed to fetch receipt:', error);
			//If error in supabase api fetching then object of error and error message is returned
			return { error: true, message: error.message };
		}
		return { error: false, receipts };
	} else if (!user_id) {
		//If user_id Id not provided then return with error message
		return { error: true, message: 'no user Id provided' };
	} else {
		//If Project Id not provided then return with error message
		return { error: true, message: 'no project Id provided' };
	}
};

/*
Get All receipts based on user ID and project ID 
returns a sorted reciept lists based on newest to oldest date of creation.
user_id and project_id required*/
export const getAllReceiptsByUserAndOrganization = async (
	user_id: string,
	org_id: string,
) => {
	const supabase = await createSupbaseClient();

	//If user_id and project_id  is provided then query supabase api
	if (user_id && org_id) {
		const { data: receipts, error } = await supabase
			// from table name 'receipts' TODO: Maybe provide a object called SupaBaseTableNames ?, just an idea  ~Hashem Jaber
			.from('receipts')
			.select('*')
			.eq('user_id', user_id)
			.eq('proj_id', org_id)
			//assending false means it orders/sorts it based on newest to oldest
			.order('created_at', { ascending: false });
		if (error) {
			console.error('Failed to fetch receipt:', error);
			//If error in supabase api fetching then object of error and error message is returned
			return { error: true, message: error.message };
		}
		return { error: false, receipts };
	} else if (!user_id) {
		//If user_id Id not provided then return with error message
		return { error: true, message: 'no user Id provided' };
	} else {
		//If Project Id not provided then return with error message
		return { error: true, message: 'no project Id provided' };
	}
};

/**
 *
 * @returns varchat value indicating the language preference of the user, in case of failure then defualt language is english
 */
export async function getLangPrefOfUser() {
	const supabase = await createSupbaseClient();
	const { data: userData, error: userError } = await supabase.auth.getUser();
	// from the table user_lang_pref select the pref lang based on the user_id

	let resp;
	try {
		const { data: langResp, error } = await supabase
			.from('user_lang_pref')
			.select('lang')
			.eq('user_id', userData.user?.id);

		resp = langResp || [];

		// if (error) {
		// 	console.error('getting user language faild', error);
		// 	return 'eng';
		// } else {
		// 	// console.info('user pref lang is');
		// 	// console.info(
		// 	// 	resp[0]?.lang === undefined
		// 	// 		? 'undefined, no such user lang pref exisist'
		// 	// 		: resp[0].lang,
		// 	// );
		// }
	} catch (e) {
		console.info('no user_pref in data base, switching to english');
		return 'eng';
	}

	try {
		return resp[0].lang;
	} catch (e) {
		console.info('no user_pref in data base, switching to english');
		return 'english';
	}
}

/**
 * @param lang The language the user set to prefer
 * @returns The language preference of the user, in case of failure then default language is English
 */
export async function setLanguage(lang: string) {
	const supabase = await createSupbaseClient();
	const { data: userData, error: userError } = await supabase.auth.getUser();

	if (userError) {
		console.error('Error fetching user data', userError);
		return 'eng';
	}

	const userId = userData.user?.id;
	if (!userId) {
		console.error('No user id found');
		return 'eng';
	}

	// Check if the user language preference already exists, since the way we related the data base from user to pref_lang was by a new table and user_id as fk -Hashem Jaber
	const { data: existingPref, error: existingError } = await supabase
		.from('user_lang_pref')
		.select('lang')
		.eq('user_id', userId)
		.single();

	if (existingError && existingError.code !== 'PGRST116') {
		console.error(
			'Error checking existing language preference',
			existingError,
		);
		if (existingError.code === 'PGRST100') {
			console.log('user does not exist in table user_pref');
		}

		return 'eng';
	}

	let resp;
	let error;

	if (existingPref) {
		// Update existing preference since now we know the user_id exists in the table and so instead of insert we do Patch/Update
		({ data: resp, error } = await supabase
			.from('user_lang_pref')
			.update({ lang: lang })
			.eq('user_id', userId));
	} else {
		// Insert new preference since the user_id does not exist as a foreign key in the table user_lang_pref
		({ data: resp, error } = await supabase
			.from('user_lang_pref')
			.insert([{ user_id: userId, lang: lang }]));
	}

	if (error) {
		return false;
	} else {
		window.location.reload();
	}

	return true;
}
/*FOLLOWING ARE FOR TESTING STRICTLY, WILL BE DELETED/EDITED !!!!-Hashem Jaber*/

/*
Creates project 
returns a truthy or false based on success
project interface required*/
export const createProject = async (
	org_id: string,
	title: string,
	address: string,
	status: string,
	budget: any,
	details: string,
	due_date: Date,
	start_date: Date,
	user_id: string,
) => {
	const supabase = await createSupbaseClient();

	const submissionData = {
		org_id: org_id,
		title: title,
		address: address,
		status: status,
		budget: budget,
		details: details,
		due_date: due_date,
		start_date: start_date,
		created_at: new Date().toISOString(),
		current_spent: 0,
		created_by: user_id,
	};

	// query db to create new entry
	const { data: entryData, error: entryError } = await supabase
		.from('projects')
		.insert([submissionData])
		.select('*');

	// if there is an error, console error message
	if (entryError) {
		return false;
	}

	return true;
};

/*
Update project 
returns a truthy or false based on success
project interface required*/
export const updateProject = async (
	project_id: string,
	org_id: string,
	title: string,
	address: string,
	status: string,
	budget: any,
	details: string,
	due_date: Date,
	start_date: Date,
) => {
	const supabase = await createSupbaseClient();

	const submissionData = {
		project_id: project_id,
		org_id: org_id,
		title: title,
		address: address,
		status: status,
		budget: budget,
		details: details,
		due_date: due_date,
		start_date: start_date,
		created_at: new Date().toISOString(),
		current_spent: 0,
	};

	const { data: entryData, error: entryError } = await supabase
		.from('projects')
		.update([submissionData])
		.eq('id', project_id);

	// if there is an error, console error message
	if (entryError) {
		return false;
	}

	return true;
};

/*
Retrieve project 
returns a truthy or false based on success
project interface required*/
export const getProjectById = async (project_id: string) => {
	const supabase = await createSupbaseClient();

	// query db to create new entry
	const { data: entryData, error: entryError } = await supabase
		.from('projects')
		.select('*')
		.eq('id', project_id);

	// if there is an error, console error message
	if (entryError) {
		return false;
	}

	return true;
};
export const getProjectDetailsById = async (
	project_id: string,
): Promise<IProjects | null> => {
	const supabase = await createSupbaseClient();

	// query db to create new entry
	const { data: entryData, error: entryError } = await supabase
		.from('projects')
		.select('*')
		.eq('id', project_id)
		.single();

	// if there is an error, console error message
	if (entryError) {
		return null;
	}

	return entryData as IProjects;
};

/**
 *
 * @returns financial state of the organization acorss all projects
 */
export const get_financial_state = async () => {
	let state: String = 'No financial summary can be provided';
	const client = await createSupbaseClient();
	const { data, error: err } = await client.rpc('calculate_financials');

	if (err) {
		console.log(err);
		return state;
	} else {
		console.log('got responce on financial summary ', data);
	}

	state = data;

	return state;
};

/**
 *
 * @returns gets tasks information along side its members
 */
export const get_tasks_with_members_for_CAMELAI = async () => {
	let state: String = 'No tasks summary can be provided';
	const client = await createSupbaseClient();
	const { data, error: err } = await client.rpc(
		'get_tasks_with_members_for_camelai',
	);

	if (err) {
		console.log(err);
		return state;
	} else {
		console.log('got responce on tasks summary ', data);
	}

	state = data;

	return state;
};

/**
 *
 * @param reciept
 * @returns boolean if created returns true, else false
 */
export const createReciept = async (reciept: any) => {
	// create org using user auth
	const supabase = await createSupbaseClient();

	// user info
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error) {
		return;
	}

	reciept.created_by = user?.id;
	// query to create new row entry
	const { data: entryData, error: entryError } = await supabase
		.from('receipts')
		.insert([
			{
				...reciept,
			},
		]);

	if (entryError) {
		console.error('failed to create reciept');
	} else {
		console.error('reciept successfule');
		return;
	}
};

/**
 *
 * @param org_id not needed
 * @param project_id needed
 * @param member_id needed
 * @returns boolean, true if successfule, false if not
 */
export const inviteProjectMemberForCamelAI = async ({
	org_id,
	project_id,
	member_id,
}: {
	org_id?: string;
	project_id: string;
	member_id: string;
}): Promise<boolean> => {
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
	} else {
		console.log('got data from inviteProjectMemberForCamelAI ' + data);
	}

	resp = true;

	return resp;
};

/**
 *
 * @param project_id needed
 * @param member_id needed
 * @returns boolean, true if successfule, false if not
 */
export async function removeProjectMemberForCamelAI({
	project_id,
	member_id,
}: {
	project_id: string;
	member_id: string;
}) {
	const supabase = await createSupbaseClient();

	// remove user from projects_member table
	const { error } = await supabase
		.from('projects_member')
		.delete()
		.eq('project_id', project_id)
		.eq('user_id', member_id);

	if (error) {
		alert('failed');
		console.error('Error removing project member', error);
		return false;
	}

	return true;
}

/**
 *
 * @param task_id needed
 * @param member_id needed
 * @returns boolean, true if successfule, false if not
 */
export async function addMembertoTaskForCamelAI({
	task_id,
	member_id,
	project_id,
}: {
	task_id: string;
	member_id: string;
	project_id: string;
}) {
	const supabase = await createSupbaseClient();

	let resp = false;

	const client = await createSupbaseClient();

	const { data, error: err } = await client.from('tasks_member').insert([
		{
			project_id: project_id,
			user_id: member_id,
			task_id: task_id,
		},
	]);

	if (err) {
		console.log(err);
		return resp;
	}

	resp = true;
	return resp;
}

export async function removeMemberFromTaskForCamelAI({
	task_id,
	member_id,
}: {
	task_id: string;
	member_id: string;
}) {
	const supabase = await createSupbaseClient();

	const { error } = await supabase
		.from('tasks_member')
		.delete()
		.eq('user_id', member_id)
		.eq('task_id', task_id);

	if (error) {
		console.error(JSON.stringify(error));
		return false;
	} else {
		return true;
	}
}

//get_information_about_tasks_projects_members

//get_information_about_tasks_projects_members_for_camel

/**
 *
 * @returns gets projects, tasks, members information
 */
export const get_Information_About_Tasks_Projects_Members_For_CamelAI =
	async () => {
		let state: String = 'No tasks summary can be provided';
		const client = await createSupbaseClient();
		const { data, error: err } = await client.rpc(
			'get_information_about_tasks_projects_members_for_camel',
		);

		if (err) {
			console.log(err);
			return state;
		} else {
			console.log('got responce on tasks summary ', data);
		}

		state = data;

		return state;
	};
export async function getAllProjects(org_id: string): Promise<IProjects[]> {
	const supabase = await createSupbaseClient();

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

export const getReceiptsForProject = async (
	project_id: string,
): Promise<IReceipts[]> => {
	const supabase = await createSupbaseClient();

	const { data: receipts, error } = await supabase
		.from('receipts')
		.select('*')
		.eq('proj_id', project_id)
		// .order('created_at', { ascending: false });
		.order('price_total', { ascending: false });

	if (error) {
		console.error('Failed to fetch receipts:', error);
		return [];
	}

	return receipts;
};

export const getReceiptsForProjectByGroup = async (
	projects: IReceipts[],
	column: string,
) => {
	// check if the column is valid
	if (['store', 'category'].indexOf(column) === -1) {
		console.info('Invalid column name');
		return [];
	}

	// return an arry of receipts grouped by the specific column

	let groupedReceipts: any;
	if (column === 'store') {
		groupedReceipts = Object.groupBy(projects, ({ store }) => store);
	} else {
		groupedReceipts = Object.groupBy(projects, ({ category }) => category);
	}

	for (const key in groupedReceipts) {
		groupedReceipts[key] = {
			receipts: groupedReceipts[key],
			total: groupedReceipts[key]?.reduce(
				(acc: number, { price_total }: { price_total: number }) =>
					acc + price_total,
				0,
			),
		};
	}

	return groupedReceipts;
};

/**
 * 	Function to delete a project
 *
 * @param project_id The project id we are wishing to delete
 *
 * @returns boolean indicating if the project was deleted successfully
 */
export const deleteProject = async (project_id: string): Promise<boolean> => {
	const supabase = await createSupbaseClient();
	const { data: deleteProj, error: deleteProjError } = await supabase
		.from('projects')
		.delete()
		.eq('id', project_id);

	if (deleteProjError) {
		console.error('Error deleting project', deleteProjError);
		return false;
	}

	return true;
};

export const editReceipt = async (receiptInfo: IReceipts) => {
	console.log('info for receipt: ', receiptInfo);
	const supabase = await createSupbaseClient();
	const { data, error } = await supabase
		.from('receipts')
		.update({
			...receiptInfo,
		})
		.eq('id', receiptInfo.id);

	if (error) {
		console.error('Error updating receipt:', error);
		return false;
	}

	return true;
};

export const deleteReceipt = async (receipt_id: string) => {
	const supaBase = await createSupbaseClient();
	const { error } = await supaBase
		.from('receipts')
		.delete()
		.eq('id', receipt_id);

	if (error) {
		console.error('Error deleting receipt:', error);
		return false;
	}

	return true;
};

export const getNotifications = async (user_id: string): Promise<any[]> => {
	const supabase = await createSupbaseClient();
	const { data: notification_user_view, error } = await supabase
		.from('notification_user_view')
		.select('*')
		.eq('notification_status', 'unread')
		.eq('org_id', getCookie('org'))
		.eq('user_id', user_id)
		.order('notification_created_at', { ascending: false })
		.limit(40);

	if (error) {
		console.error(error);

		// set the notifications to an empty array
		return [];
	} else {
		return notification_user_view;
	}
};
