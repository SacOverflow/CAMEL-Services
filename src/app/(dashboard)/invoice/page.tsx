'use client';

import React, { useState } from 'react';
import ItemsTable from './itemsList';
import { env } from 'process';

const ReceiptPage = () => {
	const [receiptFile, setReceiptFile] = useState<File | null>(null);
	const [receiptData, setReceiptData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [items, setItems] = useState([]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

		const options = {
			method: 'POST',
			headers: {
				accept: 'application/json',
				apikey: 'f0d78cd0be8511eeb72409b0b60cbbed',
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

				// Assuming you want to print out the extracted information
				itemsInfo.forEach((item: any) => {
					alert(
						`Item: ${item.Item}, Quantity: ${item.Quantity}, Unit Price: ${item.UnitPrice}, Total Price: ${item.TotalPrice}`,
					);
				});

				setReceiptData(response);
				setLoading(false);
				alert(JSON.stringify(response));
			})
			.catch(err => {
				console.error(err);
				setError('An error occurred while processing the receipt.');
				setLoading(false);
			});
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
				<h1 style={{ textAlign: 'center' }}>Upload Receipt</h1>

				<form onSubmit={handleSubmit}>
					<input
						type="file"
						onChange={handleFileChange}
						className="mb-4"
					/>
					<button
						type="submit"
						className="bg-green-500 hover:bg-blue-200 text-green font-bold py-2 px-4 rounded"
						disabled={loading}
						style={{
							padding: '10px',
							backgroundColor: '#5A8472',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
						}}
					>
						{loading ? 'Processing...' : 'Upload'}
					</button>
				</form>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '10px',
					}}
				>
					<button
						style={{
							padding: '10px',
							backgroundColor: '#5A8472',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
						}}
					>
						Scan Receipt
					</button>
					<input
						style={{
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
						}}
						placeholder="Store"
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

					<textarea
						style={{
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							minHeight: '100px',
						}}
						placeholder="Notes"
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
						>
							Submit
						</button>
					</div>
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

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4">Upload Receipt</h2>
			{error && <p className="text-red-500">{error}</p>}
			<form onSubmit={handleSubmit}>
				<input
					type="file"
					onChange={handleFileChange}
					className="mb-4"
				/>
				<button
					type="submit"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					disabled={loading}
				>
					{loading ? 'Processing...' : 'Upload'}
				</button>
			</form>
		</div>
	);
};

export default ReceiptPage;
