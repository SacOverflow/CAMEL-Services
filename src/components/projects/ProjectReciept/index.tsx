'use client';

import { IReceipts } from '@/types/database.interface';

import './ProjectReciepts.css';
import { useState, useEffect } from 'react';
import { createSupbaseClient } from '@/lib/supabase/client';
import getLang from '@/app/translations/translations';
import { getLangPrefOfUser } from '@/lib/actions/client';

import { tessearctImageOCR } from '@/lib/actions/OCR_actions';

const ReceiptModal = ({
	project_id,
	org_id,
	user_id,
	closeModal,
	readMode,
}: {
	project_id: string;
	org_id: string;
	user_id: string;
	closeModal: () => void;
	readMode: boolean;
}) => {
	const DEFAULT_IMAGE = '';
	const [image, setImage] = useState<any>([]);
	const [imageURL, setImageURL] = useState(DEFAULT_IMAGE);
	const [createFlag, setCreateFlag] = useState(false);
	const [errorRe, setErrorMessage] = useState<{
		error: Boolean;
		errorMessage: string;
		errorCode: string | number;
	}>({ error: false, errorMessage: 'No error for now', errorCode: 100 });
	const [user_lang, setUserLang] = useState('english');
	//FIXME: EXTRACT PROJECT_ID AMD org_id dyncmically -Hashem Jaber -DONE

	const [reciept, setReciept] = useState<IReceipts | any>({
		proj_id: project_id,
		org_id: org_id,
		img_id: '',
		store: '',
		category: 'category',
		updated_by: null,
		updated_at: new Date(),
		created_by: user_id,
		created_at: new Date(),
		price_total: null,
		note: '',
	});

	const [receiptLoader, setReceiptLoader] = useState<boolean>(false);

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>,
	) => {
		const { name, value } = event.target;

		setReciept((prevReciept: any) => ({
			...prevReciept,
			[name]: name === 'price_total' ? parseFloat(value) : value,
		}));
	};

	useEffect(() => {
		const getUserLang = async () => {
			const userLang = await getLangPrefOfUser();
			setUserLang(userLang);
		};
		getUserLang();
	}, []);

	const getDateFormat = (date: Date) => {
		const d = new Date(date);

		// if date isnt valid return todays
		if (isNaN(d.getTime())) {
			console.log('date obj');
			return new Date().toISOString().split('T')[0];
		}
		// // return in ISO format
		// const yy = d.getFullYear();
		// const mm = (d.getMonth() + 1).toString().padStart(2, '0');
		// const dd = d.getDate().toString().padStart(2, '0');

		// return `${yy}-${mm}-${dd}`
		// Format: YYYY-MM-DD
		return d.toISOString().split('T')[0];
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

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (!event.target.files) {
			return;
		}

		setImage(event.target.files[0]);
		setImageURL(URL.createObjectURL(event.target.files[0]));

		setReceiptLoader(true);

		const { total, confidence, store } = await tessearctImageOCR(
			URL.createObjectURL(event.target.files[0]),
		);
		setReceiptLoader(false);

		setReciept((prevReciept: any) => ({
			...prevReciept,
			price_total: total,
			store: store,
		}));
	};

	const createReciept = async (e: any) => {
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
					"Failed to extract user info, are you sure you're signed in?",
				errorCode: 400,
			});
			return;
		}
		let newURL = null;

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
						'Failed to upload imaage of reciept, please try again',
					errorCode: 400,
				});
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
			return;
		}

		// captilize to have consistency on store
		reciept.store = reciept.store?.toUpperCase();
		// query to create new row entry
		const { data: entryData, error: entryError } = await supabase
			.from('receipts')
			.insert([
				{
					...reciept,
					image: newURL || imageURL,
				},
			]);

		if (entryError) {
			console.error(entryError);
		} else {
			setErrorMessage({
				error: false,
				errorMessage: 'no errors to report',
				errorCode: 200,
			});
		}

		if (
			entryError?.message ===
				'duplicate key value violates unique constraint "organization_name_key"' ||
			entryError?.code === '23505'
		) {
			setErrorMessage({
				error: true,
				errorMessage:
					'failed to upload reciept, please try again, error detail: duplicate key value violates unique constrainty ',
				errorCode: 23505,
			});
		}
	};

	return (
		<div className="project-receipts-modal">
			<div className="project-receipts-container">
				<div className="flex flex-row justify-center items-center overflow-hidden">
					<div className="bg-white p-4 rounded-md border border-gray-300 my-4">
						<h1 className="receipt-upload-title">
							{getLang('Upload Receipt', user_lang)}
						</h1>
						<form
							onSubmit={() => {}}
							className={`${receiptLoader ? 'hidden' : ''}`}
						>
							<div className="form-uploader">
								<input
									type="file"
									onChange={handleFileChange}
									className="mb-4"
								/>
							</div>
						</form>
						<ReceiptLoaderComp
							className={`${!receiptLoader ? 'hidden' : ''}`}
						/>
						<div className="input-form-fields">
							<input
								className="input-fields"
								placeholder="Store"
								value={reciept?.store}
								name="store"
								onChange={handleChange}
							/>
							<div className="flex flex-row gap-4">
								<input
									className="input-fields"
									onChange={handleChange}
									name="price_total"
									placeholder="Price/Total"
									type="number"
									value={reciept?.price_total}
								/>
							</div>
							<input
								className="input-fields"
								// place holder be todays date
								placeholder={getDateFormat(reciept?.updated_at)}
								value={getDateFormat(reciept?.updated_at)}
								name="updated_at"
								onChange={handleChange}
								type="date"
							/>
							<span> {getLang('Category', user_lang)}</span>
							<select
								name="category"
								className="category-select"
								onChange={handleChange}
							>
								<option value="">
									{getLang('Select Category', user_lang)}
								</option>
								<option value="HVAC Equipment & Supplies">
									{getLang(
										'HVAC Equipment & Supplies',
										user_lang,
									)}
								</option>
								<option value="Electrical Supplies">
									{getLang('Electrical Supplies', user_lang)}
								</option>
								<option value="Construction Materials">
									{getLang(
										'Construction Materials',
										user_lang,
									)}
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
									{getLang(
										'Transportation & Fuel',
										user_lang,
									)}
								</option>
								<option value="Rental Equipment">
									{getLang('Rental Equipment', user_lang)}
								</option>
								<option value="Miscellaneous Expenses">
									{getLang(
										'Miscellaneous Expenses',
										user_lang,
									)}
								</option>
							</select>
							<textarea
								className="input-fields h-32"
								placeholder="Notes"
								name="note"
								value={reciept?.note}
								onChange={handleChange}
							/>
							<div className="receipts-btns">
								<button
									onClick={closeModal}
									className="cancel-btn"
								>
									{errorRe.errorCode === 200
										? getLang('Close', user_lang)
										: getLang('Cancel', user_lang)}
								</button>
								<button
									className="submit-btn"
									onClick={() => {
										setCreateFlag(true);
										createReciept('')
											.then((res: any) => {
												// You might want to handle your response here or set some other state based on the result.
												setCreateFlag(false);
											})
											.catch(error => {
												// Don't forget to handle errors and potentially reset the flag here as well.
												console.error(error);
												setCreateFlag(false);
											});
									}}
									disabled={createFlag}
								>
									{createFlag
										? 'Loading...'
										: getLang('Submit', user_lang)}
								</button>
							</div>
							{errorRe.errorCode === 200 && (
								<span className="text-center">
									{getLang(
										'Receipt uploaded successfully 🎉🥳!',
										user_lang,
									)}{' '}
								</span>
							)}
							{errorRe.error && (
								<span className="text-center">
									{getLang(
										'Oops something went wrong: errorCode',
										user_lang,
									)}
									: errorCode: {errorRe.errorCode} {'\n'}{' '}
									error Message: {errorRe.errorMessage}{' '}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const AddProjectReciept = ({
	project_id,
	user_id,
	org_id,
}: {
	project_id: string;
	user_id: string;
	org_id: string;
}) => {
	const [showModal, setShowModal] = useState(false);

	const openModal = () => {
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		window.location.reload();
	};

	return (
		<>
			<button
				className="add-receipt-btn"
				onClick={() => setShowModal(!showModal)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					className="add-receipt-svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 4.5v15m7.5-7.5h-15"
					/>
				</svg>
			</button>
			{showModal ? (
				<ReceiptModal
					org_id={org_id}
					user_id={user_id}
					project_id={project_id}
					closeModal={closeModal}
					readMode={false}
				/>
			) : null}
		</>
	);
};

const ReceiptLoaderComp = ({ className }: { className: string }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className={`loader-receipt-icon w-6 h-6 animate-spin text-center mx-auto ${
				className || ''
			}`}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
			/>
		</svg>
	);
};
