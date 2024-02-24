'use client';
import { IReceipts, IUsers } from '@/types/database.interface';
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
