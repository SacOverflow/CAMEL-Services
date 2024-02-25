'use client';

// CSS imports
import './NewTask.css';
import { ITasks, Status } from '@/types/database.interface';
import { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../ContextProvider';
import { TaskMemberInput } from '../client';
import { create } from 'domain';
import {
	createTask,
	getProjectMembersTasks,
	getAllTaskMembers,
	addTaskMember,
	removeMemberFromTask,
} from '@/lib/actions/client';

export const EditTaskForm = ({
	role,
	setRefresh,
	newTask = false,
	project_id,
	org_id,
	dismiss,
}: {
	role?: string;
	setRefresh: any;
	newTask?: boolean;
	project_id: any;
	org_id: any;
	dismiss: any;
}) => {
	// Form state
	// Holds the user object, client action lib removeTaskMember task id, to remove the the task_member user_id, only admin/adminstrators can change/edit task members makes span task
	// Create an opt task field
	//1. create optional field in editTaskForm (role)
	//2. Pass that to member badge input
	//3. Use prop here inside of badge and display X on hover that has functionality

	const contxt = useContext(TaskContext);

	const {
		tasks,
		setTasks,
		addTask,
		removeTask,
		updateTask,
		selectedTask,
		setSelectedTask,
	} = !newTask
		? contxt
		: {
				tasks: '',
				setTasks: '',
				addTask: '',
				removeTask: '',
				updateTask: contxt.updateTask,
				selectedTask: '',
				setSelectedTask: contxt.setSelectedTask,
		  };

	const [teamMember, setTeamMember]: any = useState();

	const [taskMembers, setTaskMembers]: any = useState([]);

	const [members, setMembers] = useState([
		{
			id: 1,
			name: 'oops, No Members in sight',
			image: '/https://files.oaiusercontent.com/file-npweLpN335IVGD1bfQAd6DIl?se=2024-02-23T09%3A47%3A17Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D723e25a6-0861-40a7-8472-3d3245b64813.webp&sig=P1gXkBn4KMbQyIIrrF2USVXoRvtCCWqiUWFxVzaHOVg%3D',
		},
	]);

	const [ref, setRef] = useState(false);
	function reFresh() {
		setRefresh();
		setRef(!ref);
		window.location.reload();
	}
	const [editedTask, setEditedTask] = useState<ITasks>({
		id: (selectedTask as ITasks)?.id
			? ((selectedTask as ITasks).id as string)
			: ('' as string),
		title: (selectedTask as ITasks)?.title
			? ((selectedTask as ITasks)?.title as string)
			: '',
		created_at: (selectedTask as ITasks).created_at
			? ((selectedTask as ITasks)?.created_at as Date)
			: new Date(),
		status: (selectedTask as ITasks)?.status
			? ((selectedTask as ITasks)?.status as Status)
			: Status.ToDo,
		completed_date: (selectedTask as ITasks)?.completed_date
			? ((selectedTask as ITasks)?.completed_date as Date)
			: (null as any),
		due_date: (selectedTask as ITasks)?.due_date
			? ((selectedTask as ITasks)?.due_date as Date) || new Date()
			: (null as any),
		project_id: (selectedTask as ITasks)?.project_id
			? ((selectedTask as ITasks)?.project_id as string)
			: '',
	});

	useEffect(() => {
		selectedTask
			? getAllTaskMembers(editedTask.id).then(members => {
					getProjectMembersTasks(project_id).then((tmp: any) => {
						console.log('Task Members:', taskMembers); // Debug: Check taskMembers content and type

						if (Array.isArray(taskMembers)) {
							// Ensure taskMembers is an array
							const filteredMembers = tmp.filter(
								(member: any) =>
									!taskMembers.some(
										(taskMember: any) =>
											taskMember.id === member.id,
									),
							);
							setTaskMembers(members);
							setMembers(filteredMembers);
						} else {
							console.error(
								'taskMembers is not an array:',
								taskMembers,
							);
						}
					});
			  })
			: () => {};
	}, []);

	// Update form state when the selected task changes
	useEffect(() => {
		setEditedTask(editedTask);
	}, [editedTask]);

	// Handle form submission

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		// Consolidate your create/update logic here
		if (selectedTask) {
			await updateTask(editedTask);

			setSelectedTask(null);
		} else {
			editedTask.project_id = project_id;
			await createTask(editedTask);
			dismiss();
		}
	};

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = event.target;
		if (name === 'completedBy') {
			setEditedTask(prevTask => ({
				...prevTask,
				[name]: value ? new Date(value) : null,
			}));
		} else if (name === 'team') {
			setTeamMember(value);
			const targetUser: number | any = members.find(
				member => member.name === value,
			)?.id;
			selectedTask
				? addTaskMember(project_id, editedTask.id, targetUser).then(
						res => {
							res
								? console.info('success')
								: console.info('fail');
						},
				  )
				: () => {};

			setMembers(members.filter(member => member.name !== value));
		} else {
			setEditedTask(prevTask => ({
				...prevTask,
				[name]: value,
			}));
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="task-modal"
		>
			<h2 className="task-modal-title">
				{selectedTask ? 'Edit Task' : 'New Task'}
			</h2>

			<div className="task-input-field">
				<label
					className="task-labels"
					htmlFor="taskName"
				>
					Task Name
				</label>
				<input
					className=""
					id="title"
					type="text"
					name="title"
					value={editedTask.title}
					onChange={handleChange}
				/>
			</div>

			<div className="task-input-field">
				<label
					className="task-labels"
					htmlFor="status"
				>
					Status:
				</label>
				<select
					className="option-input"
					id="status"
					name="status"
					value={editedTask.status.toLowerCase()}
					onChange={handleChange}
				>
					<option value="completed">Completed</option>
					<option value="in progress">In Progress</option>
					<option value="cancelled">Cancelled</option>
				</select>
			</div>

			<div className="task-input-field">
				<label
					className="task-labels"
					htmlFor="completedBy"
				>
					Completed By:
				</label>
				<input
					className=""
					id="completed_date"
					type="date"
					name="completed_date"
					value={
						editedTask.completed_date instanceof Date
							? editedTask.completed_date
									.toISOString()
									.split('T')[0]
							: ''
					}
					onChange={handleChange}
				/>
			</div>

			<TaskMemberInput
				role={role}
				task={editedTask}
			/>
			{/*	
			<select
				className="option-input max-w-full"
				id="team"
				name="team"
				value={'choose'}
				onChange={handleChange}
			>
				{members?.map(member => (
					<option
						key={member.name}
						value={member.name}
					>
						{member.name}
					</option>
				))}
			</select>
				*/}

			<div className="bg-white shadow rounded-lg p-6">
				<h2 className="text-lg font-semibold text-gray-800 mb-4">
					Task Members
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{taskMembers?.map((member: any) => (
						<>
							<div
								key={member.id}
								className="flex items-center space-x-3"
							>
								<img
									src={member.image}
									alt={member.name}
									className="w-14 h-14 rounded-full border border-gray-300"
								/>
								<div className="flex flex-col">
									<span className="font-small text-gray-900">
										{member.name}
									</span>
									<span className="text-sm text-gray-500">
										{member?.role
											? member.role
											: 'Team Member'}
									</span>

									<span
										onClick={() =>
											selectedTask
												? removeMemberFromTask(
														editedTask,
														member.id,
												  )
														.then(dismiss())
														.finally(() => {
															reFresh();
														})
												: () => {}
										}
										className="text-sm text-red-500 cursor-pointer"
									>
										Remove from task
									</span>
								</div>
							</div>
						</>
					))}
				</div>
			</div>

			<div className="task-btns">
				<button
					type="button"
					className="cancel-btn"
					onClick={() =>
						selectedTask ? setSelectedTask(null) : dismiss()
					}
				>
					Cancel
				</button>
				<button
					type="submit"
					className="save-btn"
					onClick={async () => {
						if (selectedTask) {
							updateTask(editedTask);
							setSelectedTask(null);
						} else {
							dismiss();
							editedTask.project_id = project_id;

							await createTask(editedTask);
							window.location.reload();
						}
					}}
				>
					{selectedTask ? 'Save' : 'Create'}
				</button>
			</div>
		</form>
	);
};
