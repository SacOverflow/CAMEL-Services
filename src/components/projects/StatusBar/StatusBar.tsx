'use client';

import { Status } from '@/types/database.interface';
import './statusbar.css';
import getLang from '../../../app/translations/translations';
// FIXME: update to utilize the enum values stored in database.interface.ts
interface StatusBarProps {
	status: 'Completed' | 'In-Progress' | 'Needs-Approval' | 'Action-Needed';
}
function capitalizeFirstLetterOfEachWord(str: string) {
	return str
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

const StatusBar = ({
	status,
	onClick,
	active,
	lang,
}: {
	status: Status;
	onClick?: () => void;
	active?: boolean;
	lang: string;
}) => {
	return (
		//generalized component circular
		<button
			className={`status-bar status-${status} ${active ? 'active' : ''}`}
			onClick={onClick}
		>
			{getLang(capitalizeFirstLetterOfEachWord(status), lang)}
		</button>
	);
};

export default StatusBar;
