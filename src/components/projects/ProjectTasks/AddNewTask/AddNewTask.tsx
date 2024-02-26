'use client';

//import { createSupbaseServerClientReadOnly } from '@/lib/supabase/server';
import { useState } from 'react';

type Task = {
	id: string;
	taskName: string;
	createdAt: Date;
	status: 'Completed' | 'In Progress' | 'Cancelled';
	completedBy?: Date;
	members: string[];
};

type CreateTaskFormProps = {
	onSave: (newTask: Task) => void;
};

const CreateTaskForm = ({ onSave }: CreateTaskFormProps) => {
	const [newTask, setNewTask] = useState({
		id: '',
		taskName: '',
		createdAt: new Date(),
		status: 'In Progress' as 'In Progress',
		completedBy: new Date(),
		members: [],
	});

	//const supabase = await createSupbaseServerClientReadOnly();

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;

		setNewTask({ ...newTask, [name]: value });
	};

	const handleMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

	return (
		<div className="">
			<form
				onSubmit={() => {}}
				className=" task-modal-add"
			>
				{/* Task Name */}
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="taskName"
					>
						Task Name
					</label>
					<input
						id="taskName"
						name="taskName"
						type="text"
						required
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						value={newTask.taskName}
						onChange={handleChange}
					/>
				</div>

				{/* Created At */}
				<div className="mb-4">
					<label className="">Created At</label>
					<input
						id="createdAt"
						name="createdAt"
						type="date"
						className=""
						onChange={handleChange}
					/>
				</div>

				{/* Status */}
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="status"
					>
						Status
					</label>
					<select
						id="status"
						name="status"
						className=""
						value={newTask.status}
						onChange={handleChange}
					>
						<option value="In Progress">In Progress</option>
						<option value="Completed">Completed</option>
						<option value="Cancelled">Cancelled</option>
					</select>
				</div>

				{/* Completed By */}
				<div className="mb-4">
					<label
						className=""
						htmlFor="completedBy"
					>
						Completed By
					</label>
					<input
						id="completedBy"
						name="completedBy"
						type="date"
						className=""
						onChange={handleChange}
					/>
				</div>

				{/* Members */}
				<div className="mb-6">
					<label
						className=""
						htmlFor="members"
					>
						Members
					</label>
					<input
						id="members"
						name="members"
						type="text"
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						value={newTask.members.join(', ')}
						onChange={handleMemberChange}
						placeholder="Enter member names separated by commas"
					/>
				</div>

				{/* Submit Button */}
				<div className="task-btns">
					<button
						type="button"
						className="cancel-btn"
						onClick={() => {}}
					>
						Cancel
					</button>
					<button
						type="submit"
						className="save-btn"
					>
						Create
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateTaskForm;
