'use client';

import { useState } from 'react';

import { createSupbaseClient } from '@/lib/supabase/client';
import { IReceipts } from '@/types/database.interface';

export default function ReceiptPage() {
	const DEFAULT_IMAGE =
		'https://apqmqmysgnkmkyesdrnn.supabase.co/storage/v1/object/public/profile-avatars/wyncoservices.png';
	const [receiptFile, setReceiptFile] = useState<File | null>(null);
	const [receiptData, setReceiptData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [items, setItems] = useState([]);
	const [image, setImage] = useState<any>([]);
	const [imageURL, setImageURL] = useState(DEFAULT_IMAGE);
	const [errorRe, setErrorMessage] = useState<{
		error: Boolean;
		errorMessage: string;
		errorCode: string | number;
	}>({ error: false, errorMessage: 'No error for now', errorCode: 100 });
	//FIXME: EXTRACT PROJECT_ID AMD org_id dyncmically -Hashem Jaber

	const [reciept, setReciept] = useState<IReceipts | any>({
		// proj_id: 'a7188d51-4ea8-492e-9277-7989551a3b97',
		proj_id: '',
		org_id: '',
		img_id: 'some-img-id',
		store: 'store',
		category: 'category',
		updated_by: null,
		updated_at: new Date(),
		created_by: '',
		created_at: new Date(),
		price_total: 100.0,
		note: '',
	});

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>,
	) => {
		const { name, value } = event.target;

		// Create a new object for the state update
		setReciept((prevReciept: any) => ({
			...prevReciept, // Spread the previous state
			[name]: name === 'price_total' ? parseFloat(value) : value, // Ensure numbers are handled correctly
		}));
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
	const createReciept = async (e: any): Promise<boolean> => {
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
		// error
		//     ? setErrorMessage({
		//         error: true,
		//         errorMessage:
		//             'failed to extract user info, are you sure your signed in?',
		//         errorCode: 400,
		//     })
		//     : () => { };
		let newURL = null;

		// if image is not default??¿¿¿ NOTE: unsure of this logic
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

		if (entryError) {
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
		// entryError
		//     ? setError('Reciept creation failed due to unknown ')
		//     : setErrorMessage({
		//         error: false,
		//         errorMessage: 'no errors to report',
		//         errorCode: 200,
		//     });

		if (
			(entryError as any).message ===
				'duplicate key value violates unique constraint "organization_name_key"' ||
			// entryError?.code === '23505'
			(entryError as any).code === '23505'
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
		<div className="receipts-input-form-container mx-auto">
			<div
				// style={{
				//     background: 'white',
				//     margin: 'auto',
				//     width: '50%',
				//     padding: '10px',
				//     border: '1px grey',
				//     borderRadius: '8px',
				//     marginTop: '20px',
				// }}
				className="receipts-input-form flex flex-col gap-2  bg-white rounded-md my-5 p-4"
			>
				<h1 className="text-center font-bold text-xl">
					Upload Receipt
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
				<div className="flex flex-col gap-4">
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
						// style={{
						//     padding: '10px',
						//     border: '1px solid #ccc',
						//     borderRadius: '4px',
						// }}
						className="p-4 border border-gray-300 rounded-md"
						placeholder="Store"
						value={reciept?.store}
						name="store"
						onChange={handleChange}
					/>
					<div className="flex gap-1 items-center">
						<input
							// style={{
							//     flex: 1,
							//     padding: '10px',
							//     border: '1px solid #ccc',
							//     borderRadius: '4px',
							// }}
							className="flex-1 p-4 border border-gray-300 rounded-md"
							onChange={handleChange}
							name="price_total"
							placeholder="Price/Total"
							type="number"
							value={reciept?.price_total}
						/>
						<select
							// style={{
							//     padding: '10px',
							//     border: '1px solid #ccc',
							//     borderRadius: '4px',
							// }}
							className="p-4 border border-gray-300 rounded-md"
						>
							<option value="USD">USD</option>
							{/* Add other currencies as needed */}
						</select>
					</div>
					<input
						// style={{
						//     padding: '10px',
						//     border: '1px solid #ccc',
						//     borderRadius: '4px',
						// }}
						className="p-4 border border-gray-300 rounded-md"
						placeholder="MM/DD/YYYY"
						type="date"
					/>
					<span>Category</span>
					<select
						name="category"
						// style={{
						//     padding: '10px',
						//     backgroundColor: '#5A8472',
						//     color: 'white',
						//     border: 'none',
						//     borderRadius: '4px',
						// }}
						className="p-4 rounded-md bg-[#5A8472] text-white"
						onChange={handleChange}
					>
						<option value="">Select Category</option>
						<option value="HVAC Equipment & Supplies">
							HVAC Equipment & Supplies
						</option>
						<option value="Electrical Supplies">
							Electrical Supplies
						</option>
						<option value="Construction Materials">
							Construction Materials
						</option>
						<option value="Tools & Machinery">
							Tools & Machinery
						</option>
						<option value="Safety Equipment">
							Safety Equipment
						</option>
						<option value="Plumbing Supplies">
							Plumbing Supplies
						</option>
						<option value="Lighting Fixtures">
							Lighting Fixtures
						</option>
						<option value="Paint & Sundries">
							Paint & Sundries
						</option>
						<option value="Hardware & Fasteners">
							Hardware & Fasteners
						</option>
						<option value="Office Supplies">Office Supplies</option>
						<option value="Transportation & Fuel">
							Transportation & Fuel
						</option>
						<option value="Rental Equipment">
							Rental Equipment
						</option>
						<option value="Miscellaneous Expenses">
							Miscellaneous Expenses
						</option>
					</select>
					<textarea
						// style={{
						//     padding: '10px',
						//     border: '1px solid #ccc',
						//     borderRadius: '4px',
						//     minHeight: '100px',
						// }}
						className="p-4 border border-gray-300 rounded-md h-32"
						placeholder="Notes"
						name="note"
						value={reciept?.note}
						onChange={handleChange}
					/>
					<div
						// style={{ display: 'flex', gap: '10px' }}
						className="flex gap-4"
					>
						<button
							// style={{
							//     flex: 1,
							//     padding: '10px',
							//     backgroundColor: 'white',
							//     color: 'black',
							//     border: 'none',
							//     borderRadius: '4px',
							// }}
							className="flex-1 p-4 border border-gray-300 rounded-md text-black"
						>
							Cancel
						</button>
						<button
							// style={{
							//     flex: 1,
							//     padding: '10px',
							//     backgroundColor: '#5A8472',
							//     color: 'white',
							//     border: 'none',
							//     borderRadius: '4px',
							// }}
							className="flex-1 p-4 border border-gray-300 rounded-md bg-[#5A8472] text-white"
							onClick={async () => {
								const resp = await createReciept('');

								//
								// FIXME:  had some alerts again;
								// NOTE: noting this down ONCE AGAIN; DO NOT USE OR PUSH ALERTS TO THE MAIN BRANCH OR WHEN COMMITING PLEASEEEEEE
								// LETS FOLLOW PROPER FORMATTING THAT WE HAVE BEEN USING OF MODALS OR JUST SIMPLE SPAN TEXTS THANK YOU!!!!
								// if (resp) {
								//     setReceiptData(reciept);
								// }
							}}
						>
							Submit
						</button>
					</div>
					{errorRe.errorCode === 200 && (
						<span>Receipt uplaoded succesfully 🎉🥳 ! </span>
					)}
					{errorRe.error && (
						<span>
							Oops something went wrong: errorCode:{' '}
							{errorRe.errorCode} {'\n'} error Message:{' '}
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
