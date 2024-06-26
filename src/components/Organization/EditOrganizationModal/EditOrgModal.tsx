'use client';
// CSS imports
import { IOrgEdit } from '@/types/componentTypes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import getLang from '@/app/translations/translations';
import './EditOrgModal.css';
import { editOrganization, updateImage } from './client.actions';

export default function EditOrgModal({
	clickHandler,
	organization,
	lang,
}: {
	clickHandler: () => void;
	organization: IOrgEdit;
	lang?: string;
}) {
	const [formData, setFormData] = useState({
		orgName: organization.name,
		orgImageUrl: organization.image,
		orgImage: useState<any>([]),
	});

	const PREVIOUS_IMAGE = organization.image;
	const router = useRouter();
	const [image, setImage] = useState<any>([]);
	const [imageURL, setImageURL] = useState(PREVIOUS_IMAGE);
	const [orgError, setOrgError] = useState('');

	const [imageChanged, setImageChanged] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	const handleImageChange = (e: any) => {
		if (!e.target.files) {
			return;
		}

		setImageChanged(true);

		setImage(e.target.files[0]);
		setImageURL(URL.createObjectURL(e.target.files[0]));
	};

	const editOrganizationHandler = async (e: any) => {
		e.preventDefault();

		// upload image
		let newURL = organization.image;
		if (imageChanged) {
			const {
				data: imgURL,
				success,
				error: imageError,
				errorMessage,
			} = await updateImage(imageURL, image);

			if (imageError) {
				setOrgError(errorMessage);
				return;
			}

			setImageURL(imgURL);
			newURL = imgURL;
		}

		const {
			data: orgData,
			success: orgSuccess,
			error: orgError,
			errorMessage: orgErrorMessage,
		} = await editOrganization(
			organization.id,
			formData.orgName,
			newURL || imageURL,
		);

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
			<div className="organization-modal w-full">
				<div className="header-section">
					<span className="title">
						{getLang('Edit', lang ? lang : 'english')}{' '}
						{getLang('Organization', lang ? lang : 'english')}
					</span>
				</div>

				<form className="form-section flex flex-col gap-2">
					<input
						className=""
						type="text"
						id="orgName"
						placeholder="Organization Name"
						value={formData.orgName}
						onChange={handleChange}
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
							{getLang('Cancel', lang ? lang : 'english')}
						</button>
						<button
							className="create-button"
							onClick={editOrganizationHandler}
						>
							{getLang('Submit', lang ? lang : 'english')}
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
