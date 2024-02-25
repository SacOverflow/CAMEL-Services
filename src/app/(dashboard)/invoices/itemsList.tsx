// Sample data format that you might have extracted
'use client';
import React, { useState } from 'react';

const initialItems = [
	{
		id: 1,
		Item: 'Lorem ipsum',
		Quantity: 1,
		UnitPrice: '$2.50',
		TotalPrice: '$2.50',
	},
	// Add more items here as per your data
];

function EditableRow({
	item,
	onSave,
	onCancel,
	onDelete,
}: {
	item: String | any;
	onSave: () => {} | any;
	onCancel: () => {} | any;
	onDelete: () => {} | any;
}) {
	const [editItem, setEditItem] = useState(item);

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setEditItem({ ...editItem, [name]: value });
	};

	return (
		<tr>
			<td>
				<input
					type="text"
					name="Item"
					value={editItem.Item}
					onChange={handleChange}
				/>
			</td>
			<td>
				<input
					type="number"
					name="Quantity"
					value={editItem.Quantity}
					onChange={handleChange}
				/>
			</td>
			<td>
				<input
					type="text"
					name="UnitPrice"
					value={editItem.UnitPrice}
					onChange={handleChange}
				/>
			</td>
			<td>
				<input
					type="text"
					name="TotalPrice"
					value={editItem.TotalPrice}
					onChange={handleChange}
				/>
			</td>
			<td>
				<button onClick={() => onSave()}>Save</button>
				<button onClick={onCancel}>Cancel</button>
				<button onClick={() => onDelete()}>Delete</button>
			</td>
		</tr>
	);
}

function ItemRow({ item, onEdit }: { item: any; onEdit: any }) {
	return (
		<tr>
			<td>{item.Item}</td>
			<td>{item.Quantity}</td>
			<td>{item.UnitPrice}</td>
			<td>{item.TotalPrice}</td>
			<td>
				<button onClick={() => onEdit(item.id)}>Edit</button>
			</td>
		</tr>
	);
}

function ItemsTable({ item }: { item: any }) {
	const [items, setItems] = useState(item);
	const [editItemId, setEditItemId] = useState(null);

	const handleSave = (editedItem: any) => {
		setItems(
			items.map((item: any) =>
				item.id === editedItem.id ? editedItem : item,
			),
		);
		setEditItemId(null); // Exit editing mode
	};

	const handleCancel = () => {
		setEditItemId(null); // Exit editing mode
	};

	const handleDelete = (id: any) => {
		setItems(items.filter((item: any) => item.id !== id));
	};

	const handleEdit = (id: any) => {
		setEditItemId(id);
	};

	return (
		<div style={{ maxHeight: '400px', overflowY: 'auto' }}>
			<table>
				<thead>
					<tr>
						<th>Item</th>
						<th>Quantity</th>
						<th>Unit Price</th>
						<th>Total Price</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{items.length &&
						items.map((item: any) =>
							editItemId === item.id ? (
								<EditableRow
									key={item.id}
									item={item}
									onSave={() => {}}
									onCancel={handleCancel}
									onDelete={() => {}}
								/>
							) : (
								<ItemRow
									key={item.id}
									item={item}
									onEdit={handleEdit}
								/>
							),
						)}
				</tbody>
			</table>
		</div>
	);
}

export default ItemsTable;
