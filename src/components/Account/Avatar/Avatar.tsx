'use client';
import React, { useState } from 'react';
import './Avatar.css';
import Image from 'next/image';
import { createSupbaseClient } from '@/lib/supabase/client';

interface AvatarProps {
	name: string;
	image?: string;
}
//Splits name into intials
const Avatar = ({ name, image }: AvatarProps) => {
	const nameParts = name.split(' ');
	const fnameInit = nameParts[0] ? nameParts[0][0] : '';
	const lnameInit = nameParts[1] ? nameParts[1][0] : '';

	const [pfpImage, setPfpImage] = useState<any>([]);
	const [pfpImageUrl, setPfpImageUrl] = useState<any>(image);

	const onImagechange = async (e: any) => {
		if (!e.target.files) {
			return;
		}

		// update image
		const file = e.target.files[0];
		const fileType = file.type;
		const fileTypes = ['image/png', 'image/jpeg', 'image/jpg'];

		if (!fileTypes.includes(fileType)) {
			// case should be handled by input field
			console.error('Invalid file type');
			return;
		}
		setPfpImage(file);
		const imgUrl = URL.createObjectURL(file);
		setPfpImageUrl(imgUrl);

		try {
			// create supabase client
			const supabase = await createSupbaseClient();

			// create custom hash for image
			const hash = Math.random().toString(36).substring(2);
			// get content type

			// upload image to storage
			const { data, error } = await supabase.storage
				.from('profile-avatars')
				.upload(`profiles/${hash}`, file, {
					cacheControl: '3600',
					upsert: false,
					contentType: fileType,
				});

			if (error) {
				console.error(error);
				// TODO: Add error handling
				window.location.reload();
				return;
			}

			// get image url
			const imgUrl = await getImageUrl(data?.path, supabase);
			setPfpImageUrl(imgUrl);

			// update user profile with image url
			const { data: user, error: userError } = await supabase
				.from('user')
				.update({ image: imgUrl })
				// do by ID or username instead pass prop TODO
				.eq('image', image);

			if (userError) {
				console.error(userError);
				return;
			}

			window.location.reload();
		} catch (error) {
			console.error(error);
		}
	};

	const getImageUrl = async (img: any, supabase: any) => {
		const { data } = await supabase.storage
			.from('profile-avatars')
			.getPublicUrl(img as string);
		return data.publicUrl as string;
	};

	return (
		<>
			{pfpImage ? (
				<div className="pfp-container">
					<Image
						src={pfpImageUrl}
						alt="Profile Picture"
						width={100}
						height={100}
						className="pfp-image"
					/>
					<input
						type="file"
						accept="image/png, image/jpeg, image/jpg"
						onChange={onImagechange}
						className="pfp-image-input"
					/>
					<div className="overlay">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="camera-icon w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
							/>
						</svg>
					</div>
				</div>
			) : (
				<div className="font profilecontainer">
					{fnameInit}
					{lnameInit}
				</div>
			)}
		</>
	);
};

export default Avatar;
