'use client';
// CSS imports
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createOrganization, updateImage } from './client.actions';
import './CreateOrgModal.css';

export default function CreateOrgModal({
	className,
	children,
	clickHandler,
}: {
	className?: string;
	children?: React.ReactNode;
	clickHandler?: () => void;
}) {
	const DEFAULT_IMAGE =
		'https://apqmqmysgnkmkyesdrnn.supabase.co/storage/v1/object/public/profile-avatars/wyncoservices.png';
	const router = useRouter();
	const [orgName, setOrgName] = useState('');
	const [image, setImage] = useState<any>([]);
	const [imageURL, setImageURL] = useState(DEFAULT_IMAGE);
	const [orgError, setOrgError] = useState('');

	const handleImageChange = (e: any) => {
		if (!e.target.files) {
			return;
		}

		setImage(e.target.files[0]);
		setImageURL(URL.createObjectURL(e.target.files[0]));
	};

	const createOrganizationHandler = async (e: any) => {
		e.preventDefault();

		// upload image
		const {
			data: newURL,
			success,
			error: imageError,
			errorMessage,
		} = await updateImage(imageURL, image);

		const {
			data: orgData,
			success: orgSuccess,
			error: orgError,
			errorMessage: orgErrorMessage,
		} = await createOrganization(orgName, newURL || imageURL);

		if (orgError) {
			setOrgError(orgErrorMessage);
		} else {
			if (clickHandler) {
				clickHandler();
				router.refresh();
			}
		}
	};
	return (
		<>
			<div className="organization-modal">
				<div className="header-section">
					<span className="title">Create Organization</span>
				</div>

				<form className="form-section flex flex-col gap-2">
					<input
						className=""
						type="text"
						placeholder="Organization Name"
						onChange={e => setOrgName(e.target.value)}
					/>
					<span className="org-error text-xs text-primary-green-200 font-semibold">
						{orgError}
					</span>
					<Image
						src={imageURL}
						alt="Organization Image"
						width={50}
						height={50}
						className="self-center rounded-3xl w-full h-[7rem]"
						priority={true}
					/>

					<input
						type="file"
						name="image"
						onChange={handleImageChange}
					/>

					<div className="button-section">
						<button
							className="cancel-button"
							onClick={clickHandler}
						>
							Cancel
						</button>
						<button
							className="create-button"
							onClick={createOrganizationHandler}
						>
							Create
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
