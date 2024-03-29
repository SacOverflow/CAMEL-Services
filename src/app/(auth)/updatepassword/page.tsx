// meta tags
import type { Metadata } from 'next';
export const metadata: Metadata = {
	title: 'Update Password Page',
	description: 'CAMEL - Update Password Page.',
	authors: [{ name: 'SacOverflow' }],
	keywords: [
		'CAMEL',
		'Cloud Asset Management Enhanced Launcher',
		'Update Password',
	],
};

// Custom Components
import UpdatePasswordForm from '@/components/UpdatePassword/UpdatePasswordForm';

const UpdatePassword = () => {
	return <UpdatePasswordForm />;
};

export default UpdatePassword;
