import CreateOrgModal from '@/components/Organization/CreateOrgModal';
import {
	CreateOrgCard,
	OrgDetailsCard,
} from '@/components/SharedComponents/DetailsCard/DetailsCard';
import { createSupbaseServerClientReadOnly } from '@/lib/supabase/server';
import { getLangPrefOfUser, getUserInformation } from '@/lib/actions/index';
import { IOrganization } from '@/types/database.interface';
import getLang from '@/app/translations/translations';
export default async function Page() {
	const allOrgs = await getOrganizationsWithRole();
	const currUser = await getUserInformation();
	const langPref = await getLangPrefOfUser(currUser?.id);

	return (
		<div className="w-full flex flex-col">
			<span className="text-primary-green-600 text-4xl font-bold p-2">
				{getLang('Choose Organization', langPref)}
			</span>
			{/* <CreateOrgModal  /> */}
			<div className="flex-grow overflow-y-auto bg-white text-default-text">
				{allOrgs && allOrgs?.length > 0 ? (
					<>
						<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 m-4 gap-4">
							{/* NOTE: When fetching the organization associated with a user, if non center the create org card. */}
							<CreateOrgCard lang={langPref} />
							{allOrgs.map(org => (
								<OrgDetailsCard
									key={org.id}
									{...org}
									lang={langPref}
								/>
							))}
						</div>
					</>
				) : (
					// Center the object only
					<div className="grid grid-cols-1 m-4 gap-4 justify-items-center">
						<CreateOrgCard lang={langPref} />
					</div>
				)}
			</div>
			{/* </div> */}
		</div>
	);
}

interface IOrganization_Role extends IOrganization {
	role: string;
}

const getOrganizationsWithRole = async (): Promise<IOrganization_Role[]> => {
	const supabase = await createSupbaseServerClientReadOnly();
	const { data: organizations, error: orgError } = await supabase
		.from('organization')
		.select('*');

	if (orgError) {
		console.error(orgError);
		return [];
	}

	const organizationsWithPermissions = await Promise.all(
		organizations.map(async org => {
			const { data: roleData, error: roleError } = await supabase
				.from('organization_member_view')
				.select('role')
				.eq('org_id', org.id);

			if (roleError) {
				console.error(roleError);
				return { ...org, role: '' };
			}

			const role = roleData[0]?.role || '';

			if (typeof role === 'undefined') {
				return { ...org, role: '' };
			}

			return { ...org, role: role };
		}),
	);

	return organizationsWithPermissions;
};
