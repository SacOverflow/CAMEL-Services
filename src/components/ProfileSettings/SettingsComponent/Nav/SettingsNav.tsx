// CSS imports
import './SettingsNav.css';
interface SettingsNavItem {
	//rules
	title: 'Settings' | string;
	href?: string; //optional parameter, question mark is optional
	icon: string | React.ReactNode;
}

//created function named SettingsItem
const SettingsItemNav = ({ title, href, icon }: SettingsNavItem) => {
	return (
		<a
			className="settings-item"
			href={`settings/${href}`}
		>
			{/* icon */}
			<div className="content">
				{icon}
				{/* title */}
				<span className="text">{title}</span>
			</div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				strokeWidth={1.75}
				className="arrow-right"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
				/>
			</svg>
		</a>
	);
};

export default SettingsItemNav;
