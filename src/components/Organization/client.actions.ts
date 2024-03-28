import { createSupbaseClient } from '@/lib/supabase/client';

const DEFAULT_IMAGE =
	'https://apqmqmysgnkmkyesdrnn.supabase.co/storage/v1/object/public/profile-avatars/wyncoservices.png';

interface responseObject {
	data?: any;
	success: boolean;
	error: boolean;
	errorMessage: string;
}
export const updateImage = async (
	newurl: string,
	image: any,
): Promise<responseObject> => {
	const supabase = await createSupbaseClient();
	let resp = {
		data: DEFAULT_IMAGE,
		success: false,
		error: false,
		errorMessage: '',
	};

	// if image is not default, we have an image to upload
	if (newurl !== DEFAULT_IMAGE) {
		// create custom hash for image
		const hash = Math.random().toString(36).substring(2);
		// upload image to storage
		const { data: profileUploadData, error: profileUploadError } =
			await supabase.storage

				.from('profile-avatars')
				.upload(`public/${hash}`, image, {
					cacheControl: '3600',
				});

		// check for errors
		if (profileUploadError) {
			console.error(profileUploadError);
			// some error occured?? :'(
			resp = {
				...resp,
				error: true,
				errorMessage: 'Error uploading image',
			};
			return resp;
		}

		// get image url; no errors caught so retrieve the uploaded URL
		const {
			data: { publicUrl },
		} = supabase.storage
			.from('profile-avatars')
			.getPublicUrl(profileUploadData?.path as string);

		resp = {
			...resp,
			data: publicUrl,
			success: true,
		};
	}

	return resp;
};

export const createOrganization = async (
	orgName: string,
	imageURL: string,
): Promise<responseObject> => {
	// upload image

	let resp = {
		data: '',
		success: false,
		error: false,
		errorMessage: '',
	};
	// create org using user auth
	const supabase = await createSupbaseClient();

	// user info
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	// insert org into db
	const { data: entryData, error: entryError } = await supabase
		.from('organization')
		.insert([
			{
				name: orgName,
				created_by: user?.id,
				image: imageURL,
			},
		]);

	// check for errors
	if (
		entryError?.message ===
			'duplicate key value violates unique constraint "organization_name_key"' ||
		entryError?.code === '23505'
	) {
		// org name is already taken
		resp = {
			...resp,
			error: true,
			errorMessage: 'Org name is already taken. Choose a new one.',
		};
	} else {
		// org created successfully
		resp = {
			...resp,
			data: entryData as any,
			success: true,
		};
	}

	return resp;
};
