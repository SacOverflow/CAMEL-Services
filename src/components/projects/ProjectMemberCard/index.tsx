import Image from 'next/image';
import { Poppins } from 'next/font/google';

// CSS import
import './ProjectMemberCard.css';
import MemberCardDropdown from './MemberCardDropdown';
import { Roles } from '@/types/database.interface';

const PoppinsRegular = Poppins({
	subsets: ['latin-ext'],
	weight: ['400'],
});

interface MemberCardProps {
	className?: string;

	memberName: string;
	memberRole: string;
	memberImage: string;
	memberDescription: string;

	user_id: string;
	project_id: string;
	admin?: boolean;

	currUserId?: string;
}

export default function MemberCard({
	className,
	memberName,
	memberRole,
	memberImage,
	memberDescription,
	user_id,
	project_id,
	admin,
	currUserId,
}: MemberCardProps) {
	const memberDescriptionText = () => {
		if (memberDescription) {
			return memberDescription;
		} else if (memberRole === 'admin') {
			return 'Member is an admin in the team.';
		}

		return `Member is a ${memberRole} in the team.`;
	};

	return (
		<div
			className={`member-card ${PoppinsRegular.className}${
				className ? ` ${className}` : ''
			}`}
		>
			{/* dropdown toggle */}
			{admin && user_id !== currUserId && memberRole !== Roles.ADMIN ? (
				<MemberCardDropdown
					user_id={user_id}
					project_id={project_id}
				/>
			) : null}
			<div className="profile">
				{/* img left col */}
				<Image
					src={memberImage}
					alt={memberName}
					width={125}
					height={125}
					className="member-image"
				/>
				<div className="member-name">{memberName}</div>
			</div>

			<div className="member-role">Team {memberRole}</div>
			<span className="member-description">
				{memberDescriptionText()}
			</span>
		</div>
	);
}
