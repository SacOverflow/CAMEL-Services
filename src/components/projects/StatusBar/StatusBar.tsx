'use client';

import { Status } from '@/types/database.interface';
import './statusbar.css';

// FIXME: update to utilize the enum values stored in database.interface.ts
interface StatusBarProps {
	status: 'Completed' | 'In-Progress' | 'Needs-Approval' | 'Action-Needed';
}

const StatusBar = ({
	status,
	onClick,
	active,
}: {
	status: Status;
	onClick?: () => void;
	active?: boolean;
}) => {
	return (
		//generalized component circular
		<button
			className={`status-bar status-${status} ${active ? 'active' : ''}`}
			onClick={onClick}
		>
			{status}
		</button>
	);
};

export default StatusBar;
