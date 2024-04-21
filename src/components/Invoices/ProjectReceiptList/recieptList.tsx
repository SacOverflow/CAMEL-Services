'use client';

// CSS imports
import './recieptList.css';

import React, { useState, useEffect } from 'react';
import { createSupbaseClient } from '@/lib/supabase/client';
import { IReceipts, Roles } from '@/types/database.interface';
import Image from 'next/image';
import { deleteReceipt } from '@/lib/actions/client';
import { ReceiptModal } from '@/components/projects/ProjectReciept';

const getAllReciptsForProject = async (
	project_id: string,
): Promise<IReceipts[]> => {
	const supaBase = await createSupbaseClient();
	const { data: reciepts, error } = await supaBase
		.from('receipts')
		.select('*')
		.eq('proj_id', project_id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('faild to get reciepts', error);
		return [];
	}
	return reciepts;
};

const RecieptList = ({
	proj_id,
	role,
	user,
}: {
	proj_id: string;
	role: string;
	user?: any;
}) => {
	const [receipts, setReceipts] = useState<IReceipts[] | any>([]);

	useEffect(() => {
		const fetchReceipts = async () => {
			try {
				const res = await getAllReciptsForProject(proj_id);
				setReceipts(res);
			} catch (error) {
				console.error('Error fetching receipts:', error);
			}
		};

		fetchReceipts();
	}, []);

	return (
		<div className="receipt-cards-container">
			{receipts.length > 0 ? (
				<div className="receipts-scroll-container">
					{receipts.map((receipt: IReceipts) => (
						<div
							key={receipt.id}
							className="scroll-snap-align-center flex flex-1"
						>
							<ReceiptCard
								receipt={receipt}
								role={role}
								user={user}
							/>
						</div>
					))}
				</div>
			) : (
				<div className="text-center">No receipts found.</div>
			)}
		</div>
	);
};

const ReceiptCard = ({
	receipt,
	role,
	user,
}: {
	receipt: IReceipts;
	role: string;
	user?: any;
}) => {
	const [showModal, setShowModal] = useState(false);

	const updateModal = () => {
		setShowModal(!showModal);
	};

	return (
		<div
			className="receipt-card"
			onClick={updateModal}
		>
			{receipt.image && (
				<Image
					src={receipt.image}
					alt={`Receipt from ${receipt.store}`}
					className="receipt-image"
					width={100}
					height={100}
				/>
			)}
			<div className="receipt-context">
				<div className="store">{receipt.store}</div>
				<div className="total">${receipt.price_total.toFixed(2)}</div>
				<div className="category">{receipt.category}</div>
				{receipt.category && (
					<div className="notes">Notes: {receipt.note}</div>
				)}
			</div>
			{role === Roles.SUPERVISOR ||
			role === Roles.ADMIN ||
			user?.id === receipt.created_by ? (
				<ReceiptEditOptions
					receipt={receipt}
					showModal={showModal}
					setModal={setShowModal}
				/>
			) : null}

			{showModal && (
				<ReceiptModal
					receiptInfo={receipt}
					org_id={receipt.org_id}
					project_id={receipt.proj_id}
					user_id={receipt.created_by}
					readMode={false}
					closeModal={updateModal}
				/>
			)}
		</div>
	);
};

const ReceiptEditOptions = ({
	receipt,
	showModal,
	setModal,
}: {
	receipt: IReceipts;
	showModal: boolean;
	setModal: any;
}) => {
	const showModalFunc = async () => {
		setModal(!showModal);
	};

	return (
		<div className="receipt-edit-container">
			<button
				className="edit-receipt"
				onClick={showModalFunc}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="edit-receipt-icon"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
					/>
				</svg>
			</button>
			<button
				className="delete-receipt"
				onClick={e => {
					e.stopPropagation();
					e.preventDefault();
					deleteReceipt(receipt.id);
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="delete-receipt-icon"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
					/>
				</svg>
			</button>
		</div>
	);
};

export default RecieptList;
