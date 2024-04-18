import ReceiptPage from '@/components/Invoices';
import {
	getLangPrefOfUser,
	getOrganizationMemberRole,
	getUserInformation,
} from '@/lib/actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function InvoicesPage() {
	// retrieve client info
	const userInfo = await getUserInformation();

	// check if the user has a valid organization stored in their cookies
	const cookieStore = cookies();
	const org = cookieStore.get('org')?.value as string;
	const lang = await getLangPrefOfUser(userInfo?.id);

	// if there is no cookie association with the use ror the org, redirect to the organization page
	if (!org) {
		redirect('/organization');
	}
	const roleResponse = await getOrganizationMemberRole(org);
	const role: string = roleResponse?.role || '';
	if (!role) {
		redirect('/organization');
	}
	return (
		<>
			<ReceiptPage />
		</>
	);
}
