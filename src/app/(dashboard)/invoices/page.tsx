'use client';

import React, { useState } from 'react';
import { createSupbaseClient } from '@/lib/supabase/client';
interface IReceipts {
	id: string;
	proj_id: string;
	org_id: string;
	img_id: string;
	store: string;
	category: string;
	updated_by: string;
	updated_at: Date;
	created_by: string;
	created_at: Date;
	price_total: number;
	note?: string;
}

const ReceiptPage = () => {
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
		proj_id: 'a7188d51-4ea8-492e-9277-7989551a3b97',
		org_id: 'a210d3f7-bcc8-4e8b-9d61-2d4228bff047',
		img_id: 'some-img-id',
		store: 'store',
		category: 'category',
		updated_at: new Date(),
		created_by: 'cd1d7916-a61a-40fa-9691-c29e42c8988a',
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

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!receiptFile) {
			setError('Please select a file to upload.');
			return;
		}

		setLoading(true);
		const form = new FormData();
		form.append('file', receiptFile);
		form.append('refresh', 'false');
		form.append('incognito', 'false');
		form.append('extractTime', 'false');
		form.append('extractLineItems', 'true');

		const options: any = {
			method: 'POST',
			headers: {
				accept: 'application/json',
				apikey: process.env.NEXT_PUBLIC_TAGGUN_KEY,
			},
			body: form,
		};

		fetch('https://api.taggun.io/api/receipt/v1/verbose/file', options)
			.then(response => response.json())
			.then(response => {
				function extractItemsInfo(receiptJson: any) {
					const items = receiptJson.entities?.productLineItems || [];
					const extractedInfo = items.map((item: any) => {
						const itemData = item.data;
						const itemName = itemData.name?.text || 'Unknown item';
						const quantity = itemData.quantity?.data || 0;
						const unitPrice = itemData.unitPrice?.data || 0.0;
						const totalPrice = itemData.totalPrice?.data || 0.0;

						return {
							Item: itemName,
							Quantity: quantity,
							UnitPrice: `$${unitPrice.toFixed(2)}`,
							TotalPrice: `$${totalPrice.toFixed(2)}`,
						};
					});

					return extractedInfo;
				}

				// Extract items info
				const itemsInfo = extractItemsInfo(response);
				const tmps: any = [];

				itemsInfo.forEach((item: any) => {
					try {
						/*	console.log(
							`Item: ${item.Item}, Quantity: ${item.Quantity}, Unit Price: ${item.UnitPrice}, Total Price: ${item.TotalPrice}`,
						);
*/
						tmps.push({
							item: item.Item,
							Quantity: item.Quantity,
							price: item.UnitPrice,
							total_price: item.TotalPrice,
						});
						setItems(tmps);
					} catch (e: any) {
						console.error('failed due to\n:' + e);
					}
				});

				setReceiptData(response);
				setLoading(false);
				console.info(JSON.stringify(response));
			})
			.catch((err: any) => {
				console.error(err);
				setError(
					'An error occurred while processing the receipt., error details: ',
				);
				setLoading(false);
			});
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

		error
			? setErrorMessage({
					error: true,
					errorMessage:
						'failed to extract user info, are you sure your signed in?',
					errorCode: 400,
			  })
			: () => {};
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
						'failed to upload imaage of reciept, please try again',
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

		entryError
			? setErrorMessage({
					error: true,
					errorMessage: entryError?.message,
					errorCode: entryError?.code,
			  })
			: setErrorMessage({
					error: false,
					errorMessage: 'no errors to report',
					errorCode: 200,
			  });
		entryError
			? setError('Reciept creation failed due to unknown ')
			: setErrorMessage({
					error: false,
					errorMessage: 'no errors to report',
					errorCode: 200,
			  });

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
			return;
		}
		/*if (clickHandler) {
			clickHandler();
			router.refresh();
		}*/
	};

	return (
		<>
			<div
				style={{
					background: 'white',
					margin: 'auto',
					width: '50%',
					padding: '10px',
					border: '1px grey',
					borderRadius: '8px',
					marginTop: '20px',
				}}
			>
				<h1
					style={{ textAlign: 'center' }}
					className=""
				>
					Upload Receipt
				</h1>

				<form onSubmit={handleSubmit}>
					<input
						type="file"
						onChange={handleFileChange}
						className="mb-4"
					/>

					<button
						style={{
							padding: '10px',
							backgroundColor: '#5A8472',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
						}}
					>
						{loading ? 'Processing...' : 'Scan Receipt'}
					</button>
				</form>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '10px',
					}}
				>
					<input
						style={{
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
						}}
						placeholder="Store"
						onChange={handleChange}
						name="store"
					/>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '5px',
						}}
					>
						<input
							style={{
								flex: 1,
								padding: '10px',
								border: '1px solid #ccc',
								borderRadius: '4px',
							}}
							onChange={handleChange}
							name="price_total"
							placeholder="Price/Total"
							type="number"
						/>
						<select
							style={{
								padding: '10px',
								border: '1px solid #ccc',
								borderRadius: '4px',
							}}
						>
							<option value="USD">USD</option>
							{/* Add other currencies as needed */}
						</select>
					</div>
					<input
						style={{
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
						}}
						placeholder="MM/DD/YYYY"
						type="date"
					/>
					<span>catagory</span>
					<select
						name="category"
						style={{
							padding: '10px',
							backgroundColor: '#5A8472',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
						}}
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
						style={{
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							minHeight: '100px',
						}}
						placeholder="Notes"
						name="note"
						onChange={handleChange}
					/>
					<div style={{ display: 'flex', gap: '10px' }}>
						<button
							style={{
								flex: 1,
								padding: '10px',
								backgroundColor: 'white',
								color: 'black',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							Cancel
						</button>
						<button
							style={{
								flex: 1,
								padding: '10px',
								backgroundColor: '#5A8472',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
							}}
							onClick={handleSubmitForm}
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
		</>
	);
};

export default ReceiptPage;
