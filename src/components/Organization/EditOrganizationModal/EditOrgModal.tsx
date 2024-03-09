'use client';
// CSS imports
import { createSupbaseClient } from '@/lib/supabase/client';
import { IOrgEdit } from '@/types/componentTypes';
import { IOrganization } from '@/types/database.interface';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import './EditOrgModal.css';

export default function EditOrgModal({
	clickHandler,
	organization,
}: {
	clickHandler: () => void;
	organization: IOrgEdit;
}) {
	const [formData, setFormData] = useState({
		orgName: organization.name,
		orgImageUrl: organization.image,
		orgImage: useState<any>([]),
	});

	const DEFAULT_IMAGE =
		'https://apqmqmysgnkmkyesdrnn.supabase.co/storage/v1/object/public/profile-avatars/wyncoservices.png';
	const PREVIOUS_IMAGE = organization.image;
	console.log(PREVIOUS_IMAGE);
	const router = useRouter();

	const [image, setImage] = useState<any>([]);
	const [imageURL, setImageURL] = useState(PREVIOUS_IMAGE);
	const [orgError, setOrgError] = useState('');
	var isNewImage = false;

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
		isNewImage = true;

		setImage(e.target.files[0]);
		setImageURL(URL.createObjectURL(e.target.files[0]));
	};

	const handleSubmit = async (e: any) => {
		// upload image
		await editOrganization(e);
	};

	const editOrganization = async (e: any) => {
		// create org using user auth
		const supabase = await createSupbaseClient();

		// user info
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		let newURL = null;

		if (isNewImage === true) {
			// create custom hash for image
			const hash = Math.random().toString(36).substring(2);
			// upload image to storage
			const { data, error } = await supabase.storage
				.from('profile-avatars')
				.upload(`public/${hash}`, image, {
					cacheControl: '3600',
				});

			if (error) {
				console.error(error);
				setOrgError('Error uploading image');
				return;
			}

			// get image url
			const {
				data: { publicUrl },
			} = supabase.storage
				.from('profile-avatars')
				.getPublicUrl(data?.path as string);

			newURL = publicUrl;

			setImageURL(publicUrl);
		}

		const submissionData = {
			name: formData.orgName,
			image: newURL || imageURL,
		};

		// query to edit row entry
		const { data: entryData, error: entryError } = await supabase
			.from('organization')
			.update(submissionData)
			.eq('id', organization.id);

		if (
			entryError?.message ===
				'duplicate key value violates unique constraint "organization_name_key"' ||
			entryError?.code === '23505'
		) {
			setOrgError('Org name is already taken. Choose a new one.');
			return;
		}
	};
	return (
		<>
			<div className="organization-modal w-full">
				<div className="header-section">
					<span className="title">Edit Organization</span>
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
							Cancel
						</button>
						<button
							className="create-button"
							onClick={handleSubmit}
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
