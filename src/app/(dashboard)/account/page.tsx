import { AccountInputField } from '@/components/Account/AccountInputField/AccountInputField';
import { getOrganizationMemberRole, getUserInformation } from '@/lib/actions';
import { IUsers_table } from '@/types/database.interface';
import { cookies } from 'next/headers';

const AccountPage = async () => {
	// references backend username for First Name, Last Name initials of user
	const userInfo = await getUserInformation();
	const username = userInfo?.name || '';

	// check if the user has a valid organization stored in their cookies
	const cookieStore = cookies();
	const org = cookieStore.get('org')?.value as string;

	// references backend for role of user
	const roleResponse = await getOrganizationMemberRole(org);
	const role: string = roleResponse?.role || '';

	return (
		<>
			<AccountInputField
				userrole={role}
				user={userInfo as IUsers_table}
			/>
		</>
	);
};

export default AccountPage;
