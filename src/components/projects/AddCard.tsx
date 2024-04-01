'use client';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { NewProjectModal } from './NewProjectModal';
import getLang from '@/app/translations/translations';
import { getLangPrefOfUser } from '@/lib/actions/client';
const AddCard = ({ org_id }: { org_id: string }) => {
	const [enabled, setEnabled] = useState(false);
	const [lang, setLang] = useState('english');

	useEffect(() => {
		const getPrefLang = async () => {
			const tmpLang = await getLangPrefOfUser();
			setLang(tmpLang);
		};
		getPrefLang();
	}, []);

	const handleCloseModal = () => {
		setEnabled(false);
	};

	return (
		<>
			<div className="bg-gray-100 hover:bg-gray-300 rounded-md shadow-lg p-3 m-2 transition-all duration-300 ease-in-out">
				<button
					onClick={() => setEnabled(!enabled)}
					className="flex flex-col h-full justify-center items-center w-full"
				>
					<div>
						<div className="flex flex-col items-center ">
							<FontAwesomeIcon
								icon={faPlus}
								size="6x"
							/>
							<div className="text-gray-500 font-semibold">
								{getLang('Add New Project Here', lang)}...
							</div>
						</div>
					</div>
				</button>
			</div>

			{enabled && (
				<NewProjectModal
					onClose={handleCloseModal}
					org_id={org_id}
					lang={lang}
				/>
			)}
		</>
	);
};

export default AddCard;
