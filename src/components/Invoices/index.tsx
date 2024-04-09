'use client';

import { useState, useEffect } from 'react';

import { createSupbaseClient } from '@/lib/supabase/client';
import { IProjects, IReceipts } from '@/types/database.interface';
import {
	getAllProjects,
	getCookie,
	getLangPrefOfUser,
} from '@/lib/actions/client';
import getLang from '@/app/translations/translations';

export default function ReceiptPage() {
	const DEFAULT_IMAGE =
		'https://apqmqmysgnkmkyesdrnn.supabase.co/storage/v1/object/public/profile-avatars/wyncoservices.png';
	const [receiptFile, setReceiptFile] = useState<File | null>(null);
	const [receiptData, setReceiptData] = useState(null);
	const [image, setImage] = useState<any>([]);
	const [imageURL, setImageURL] = useState(DEFAULT_IMAGE);
	const [user_lang, setUserLang] = useState('english');
	const [errorRe, setErrorMessage] = useState<{
		error: Boolean;
		errorMessage: string;
		errorCode: string | number;
	}>({ error: false, errorMessage: 'No error for now', errorCode: 100 });

	const [projects, setProjects] = useState<IProjects[]>([]);

	useEffect(() => {
		const getuserLang = async () => {
			const userLang = await getLangPrefOfUser();
			setUserLang(userLang);
		};

		const getAllProjecttsAssociations = async () => {
			// retrieve the cookie upon mount
			const cookie = getCookie('org');
			setReciept((prevReciept: any) => ({
				...prevReciept,
				org_id: cookie,
			}));
			const projects = await getAllProjects(cookie);

			setProjects(projects);
		};

		getuserLang();
		getAllProjecttsAssociations();
	}, []);

	const [reciept, setReciept] = useState<IReceipts | any>({
		proj_id: '',
		org_id: '',
		img_id: '',
		store: '',
		category: 'category',
		updated_by: null,
		updated_at: new Date(),
		created_by: '',
		created_at: new Date(),
		price_total: 0,
		note: '',
	});

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>,
	) => {
		const { name, value } = event.target;

		if (name === 'created_at') {
			const [year, month, day] = value.split('-');
			// create date obj using local time
			const date = new Date(year, month - 1, day);
			// set the date to the state
			setReciept((prevReciept: any) => ({
				...prevReciept, // Spread the previous state
				[name]: date,
			}));
		} else {
			// Create a new object for the state update
			setReciept((prevReciept: any) => ({
				...prevReciept, // Spread the previous state
				[name]: name === 'price_total' ? parseFloat(value) : value, // Ensure numbers are handled correctly
			}));
		}
	};

	const receiptCheckPass = () => {
		const hasAllFields =
			!reciept.proj_id ||
			!reciept.org_id ||
			!reciept.img_id ||
			!reciept.store ||
			!reciept.category ||
			// !reciept.updated_by ||
			!reciept.created_by ||
			!reciept.created_at ||
			!reciept.price_total;

		if (hasAllFields) {
			return false;
		}

		return true;
	};

	const formatDate = (date: Date) => {
		const newDate = new Date(date.toLocaleString());
		const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
		const day = newDate.getDate().toString().padStart(2, '0');
		const year = newDate.getFullYear();
		return `${year}-${month}-${day}`;
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) {
			return;
		}

		setImage(event.target.files[0]);
		setImageURL(URL.createObjectURL(event.target.files[0]));
		setReceiptFile(event.target.files ? event.target.files[0] : null);
	};

	const createReciept = async (e: any): Promise<boolean> => {
		// verify the receipt has all required fields
		let resp = false;
		// create org using user auth
		const supabase = await createSupbaseClient();

		// user info
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error) {
			setErrorMessage({
				error: true,
				errorMessage:
					'failed to extract user info, are you sure your signed in?',
				errorCode: 400,
			});
			return false;
		}

		let newURL = null;

		// if image is not default??¿¿¿ NOTE: unsure of this logic
		if (imageURL !== DEFAULT_IMAGE) {
			// create custom hash for image
			const hash = Math.random().toString(36).substring(2);
			// upload image to storage
			const { data, error } = await supabase.storage
				.from('profile-avatars')
				.upload(`receipts/${hash}`, image, {
					cacheControl: '3600',
				});

			if (error) {
				console.error(error);
				setErrorMessage({
					error: true,
					errorMessage:
						'failed to upload imaage of reciept, please try again',
					errorCode: 400,
				});
				return false;
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

		reciept.created_by = user?.id;
		reciept.img_id = newURL || imageURL;
		const pass = receiptCheckPass();
		if (!pass) {
			setErrorMessage({
				error: true,
				errorMessage:
					'failed to upload reciept, please ensure all fields are filled',
				errorCode: 400,
			});
			return false;
		}
		// query to create new row entry
		const { data: entryData, error: entryError } = await supabase
			.from('receipts')
			.insert([
				{
					...reciept,
					// image: newURL || imageURL,
				},
			]);

		if (entryError) {
			console.error(entryError);
			console.log('error creating receipt');
			setErrorMessage({
				error: true,
				errorMessage: entryError?.message,
				errorCode: entryError?.code,
			});
			return false;
		} else {
			setErrorMessage({
				error: false,
				errorMessage: 'no errors to report',
				errorCode: 200,
			});
		}

		if (
			(entryError as any)?.message ===
				'duplicate key value violates unique constraint "organization_name_key"' ||
			// entryError?.code === '23505'
			(entryError as any)?.code === '23505'
		) {
			setErrorMessage({
				error: true,
				errorMessage:
					'failed to upload reciept, please try again, error detail: duplicate key value violates unique constrainty ',
				errorCode: 23505,
			});
			return false;
		}

		resp = true;
		return resp;
	};

	return (
		<div className="receipts-input-form-container mx-auto max-w-[14rem] md:max-w-none">
			<div className="receipts-input-form flex flex-col gap-2  bg-white rounded-md my-5 p-4 ">
				<h1 className="text-center font-bold text-xl">
					{getLang('Upload Receipt', user_lang)}
				</h1>

				<form
					onSubmit={() => {}}
					className="flex flex-col gap-4"
				>
					<input
						type="file"
						onChange={handleFileChange}
						className="mb-4"
					/>
				</form>
				<div className="flex flex-col gap-4">
					<input
						className="p-2 md:p-4 border border-gray-300 rounded-md"
						placeholder="Store"
						value={reciept?.store}
						name="store"
						onChange={handleChange}
					/>
					<div className="flex gap-1 items-center">
						<input
							className="flex p-2 md:p-4 border border-gray-300 rounded-md w-3/4"
							onChange={handleChange}
							name="price_total"
							placeholder="Price/Total"
							type="number"
							value={reciept?.price_total}
						/>
						<select className="p-2 md:p-4 border border-gray-300 rounded-md w-1/4">
							<option value="USD">USD</option>
							{/* Add other currencies as needed */}
						</select>
					</div>
					<input
						className="p-2 md:p-4 border border-gray-300 rounded-md"
						placeholder="MM/DD/YYYY"
						value={formatDate(reciept?.created_at)}
						type="date"
						name="created_at"
						onChange={handleChange}
					/>
					<span>{getLang('Category', user_lang)}</span>
					<select
						name="category"
						className="p-2 md:p-4 rounded-md bg-[#5A8472] text-white"
						onChange={handleChange}
					>
						<option value="">
							{getLang('Select Category', user_lang)}
						</option>
						<option value="HVAC Equipment & Supplies">
							{getLang('HVAC Equipment & Supplies', user_lang)}
						</option>
						<option value="Electrical Supplies">
							{getLang('Electrical Supplies', user_lang)}
						</option>
						<option value="Construction Materials">
							{getLang('Construction Materials', user_lang)}
						</option>
						<option value="Tools & Machinery">
							{getLang('Tools & Machinery', user_lang)}
						</option>
						<option value="Safety Equipment">
							{getLang('Safety Equipment', user_lang)}
						</option>
						<option value="Plumbing Supplies">
							{getLang('Plumbing Supplies', user_lang)}
						</option>
						<option value="Lighting Fixtures">
							{getLang('Lighting Fixtures', user_lang)}
						</option>
						<option value="Paint & Sundries">
							{getLang('Paint & Sundries', user_lang)}
						</option>
						<option value="Hardware & Fasteners">
							{getLang('Hardware & Fasteners', user_lang)}
						</option>
						<option value="Office Supplies">
							{getLang('Office Supplies', user_lang)}
						</option>
						<option value="Transportation & Fuel">
							{getLang('Transportation & Fuel', user_lang)}
						</option>
						<option value="Rental Equipment">
							{getLang('Rental Equipment', user_lang)}
						</option>
						<option value="Miscellaneous Expenses">
							{getLang('Miscellaneous Expenses', user_lang)}
						</option>
					</select>
					<span>{getLang('Project', user_lang)}</span>
					<select
						name="proj_id"
						className="p-2 md:p-4 rounded-md bg-[#5A8472] text-white"
						onChange={handleChange}
					>
						<option value="">
							{getLang('Select Project', user_lang)}
						</option>
						{projects.map(project => (
							<option
								key={project.id}
								value={project.id}
							>
								{project.title}
							</option>
						))}
					</select>

					<textarea
						className="p-4 border border-gray-300 rounded-md h-32"
						placeholder="Notes"
						name="note"
						value={reciept?.note}
						onChange={handleChange}
					/>
					<div className="flex gap-4">
						<button className="flex-1 p-4 border border-gray-300 rounded-md text-black">
							{getLang('Cancel', user_lang)}
						</button>
						<button
							className="flex-1 p-4 border border-gray-300 rounded-md bg-[#5A8472] text-white"
							onClick={async (e: any) => {
								const resp = await createReciept(e);

								if (resp) {
									setTimeout(() => {
										window.location.reload();
									}, 5000);
								}
							}}
						>
							{getLang('Submit', user_lang)}
						</button>
					</div>
					{errorRe.errorCode === 200 && (
						<span>
							{getLang(
								'Receipt uploaded successfully 🎉🥳!',
								user_lang,
							)}{' '}
						</span>
					)}
					{errorRe.error && (
						<span>
							{getLang('Oops something went wrong', user_lang)} :
							errorCode: {errorRe.errorCode} {'\n'} error Message:{' '}
							{errorRe.errorMessage}{' '}
						</span>
					)}
				</div>
			</div>
			{receiptData && (
				<div className="mt-4">
					<h3 className="text-xl font-bold">Receipt Data:</h3>
					<pre>{JSON.stringify(receiptData, null, 2)}</pre>
				</div>
			)}
		</div>
	);
}
