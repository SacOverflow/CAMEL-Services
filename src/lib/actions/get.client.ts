import { IUsers } from '@/types/database.interface';
import { createSupbaseClient } from '../supabase/client';

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

export const getAllNonProjectMembers = async (
	org_id: string,
	project_id: string,
) => {
	let resp: IUsers[] = [];
	const client = await createSupbaseClient();
	const { data, error: err } = await client.rpc(
		'get_users_not_in_project_and_in_organization',
		{
			org: org_id,
			project: project_id,
		},
	);

	if (err) {
		console.log(err);
		return resp;
	}

	// Filter out any empty or error states
	resp =
		(data?.filter((user: any) => Object.keys(user).length > 0) as any) ||
		([] as IUsers[]);

	return resp;
};
export const getAllNonOrganizationMembers = async (
	organization_id: string,
): Promise<IUsers[]> => {
	let resp: IUsers[] = [];
	const client = await createSupbaseClient();
	const { data, error: err } = await client.rpc(
		'get_users_not_in_organization',
		{
			organization: organization_id,
		},
	);

	// err return empty array
	if (err) {
		console.log(err);
		return resp;
	}

	// Filter out any empty or error states
	resp =
		(data?.filter((user: any) => Object.keys(user).length > 0) as any) ||
		([] as IUsers[]);
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

export const getOrganizationMemberRole = async (org_id: string) => {
	const supabase = await createSupbaseClient();

	// pass this as an argument to the function to abstract functionality
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
};
