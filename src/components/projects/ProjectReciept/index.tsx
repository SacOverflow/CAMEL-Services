'use client';

import { IReceipts } from '@/types/database.interface';

import './ProjectReciepts.css';
import { useState, useEffect } from 'react';
import { createSupbaseClient } from '@/lib/supabase/client';
import getLang from '@/app/translations/translations';
import { getLangPrefOfUser } from '@/lib/actions/client';

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
	const [receiptFile, setReceiptFile] = useState<File | null>(null);
	const [error, setError] = useState('');
	const [items, setItems] = useState([]);
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
		// img_id: 'some-img-id',
		img_id: '',
		store: 'store',
		category: 'category',
		updated_by: null,
		updated_at: new Date(),
		created_by: user_id,
		created_at: new Date(),
		price_total: 100.0,
		note: '',
	});

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

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) {
			return;
		}

		setImage(event.target.files[0]);
		setImageURL(URL.createObjectURL(event.target.files[0]));
		setReceiptFile(event.target.files ? event.target.files[0] : null);
	};

	const handleSubmitForm = async (e: any) => {
		e.preventDefault();

		// upload image
		await createReciept(e);
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
				.upload(`public/${hash}`, image, {
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
		// query to create new row entry
		const { data: entryData, error: entryError } = await supabase
			.from('receipts')
			.insert([
				{
					...reciept,
					image: newURL || imageURL,
				},
			]);

		// entryError
		//     ? setErrorMessage({
		//         error: true,
		//         errorMessage: entryError?.message,
		//         errorCode: entryError?.code,
		//     })
		//     : setErrorMessage({
		//         error: false,
		//         errorMessage: 'no errors to report',
		//         errorCode: 200,
		//     });
		// entryError
		//     ? setError('Reciept creation failed due to unknown ')
		//     : setErrorMessage({
		//         error: false,
		//         errorMessage: 'no errors to report',
		//         errorCode: 200,
		//     });
		if (entryError) {
			setError('Reciept creation failed due to unknown ');
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
				<div className="flex flex-row justify-center items-center w-full h-full">
					<div className="bg-white p-4 rounded-md border border-gray-300 my-4 m-auto ">
						<h1 className="text-center font-bold text-xl">
							{getLang('Upload Receipt', user_lang)}
						</h1>
						<form onSubmit={() => {}}>
							<div className="form-uploader">
								<input
									type="file"
									onChange={handleFileChange}
									className="mb-4"
								/>
							</div>
						</form>
						<div className="flex flex-col gap-4 text-xl">
							{/* <button
                        style={{
                            padding: '10px',
                            backgroundColor: '#5A8472',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                        }}
                    >
                        Scan Receipt
                    </button> */}
							<input
								className="p-4 border border-gray-300 rounded-md"
								placeholder="Store"
								value={reciept?.store}
								name="store"
								onChange={handleChange}
							/>
							<div className="flex flex-row gap-4">
								<input
									className="p-4 border border-gray-300 rounded-md"
									onChange={handleChange}
									name="price_total"
									placeholder="Price/Total"
									type="number"
									value={reciept?.price_total}
								/>
							</div>
							<input
								className="p-4 border border-gray-300 rounded-md"
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
								className="p-4 rounded-md text-white bg-[#5A8472]"
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
								className="p-4 border border-gray-300 rounded-md h-32"
								placeholder="Notes"
								name="note"
								value={reciept?.note}
								onChange={handleChange}
							/>
							<div className="flex gap-4">
								<button
									onClick={closeModal}
									className="flex-1 p-4 bg-white text-black border border-gray-300 rounded-md"
								>
									{errorRe.errorCode === 200
										? getLang('Close', user_lang)
										: getLang('Cancel', user_lang)}
								</button>
								<button
									className="flex-1 p-4 bg-[#5A8472] text-white border border-gray-300 rounded-md"
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
								<span>
									{getLang(
										'Receipt uploaded successfully 🎉🥳!',
										user_lang,
									)}{' '}
								</span>
							)}
							{errorRe.error && (
								<span>
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
