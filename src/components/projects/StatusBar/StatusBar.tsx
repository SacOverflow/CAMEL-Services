'use client';

import './statusbar.css';

// FIXME: update to utilize the enum values stored in database.interface.ts
interface StatusBarProps {
	status: 'Completed' | 'In-Progress' | 'Needs-Approval' | 'Action-Needed';
}

const StatusBar = ({ status }: StatusBarProps) => {
	return (
		//generalized component circular
		<button
			className={`status-bar status-${status}`}
			// TODO: implement logic for filters; can pass fxn as prop
			onClick={() => console.log(`${status}`)}
		>
			{status}
		</button>
	);
};

export default StatusBar;
