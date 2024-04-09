'use client';

// CSS imports
import './NewTask.css';
import { ITasks, Status } from '@/types/database.interface';
import { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../ContextProvider';
import { TaskMemberInput } from '../client';
import {
	createTask,
	getProjectMembersTasks,
	getAllTaskMembers,
	setLanguage,
} from '@/lib/actions/client';
import getLang from '@/app/translations/translations';
import { getLangPrefOfUser } from '@/lib/actions/client';
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

	const [taskMembers, setTaskMembers]: any = useState([]);

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
			: Status.Complete,
		completed_date: (selectedTask as ITasks)?.completed_date
			? ((selectedTask as ITasks)?.completed_date as Date)
			: (null as any),
		due_date: (selectedTask as ITasks)?.due_date
			? ((selectedTask as ITasks)?.due_date as Date) || new Date()
			: (new Date() as Date),
		project_id: (selectedTask as ITasks)?.project_id
			? ((selectedTask as ITasks)?.project_id as string)
			: '',
	});

	const [lang, setLang] = useState('english');
	useEffect(() => {
		const getTaskMembers = async () => {
			if (!selectedTask || !editedTask.id) {
				return;
			}

			const members = await getAllTaskMembers(editedTask.id);

			setTaskMembers(members);
		};

		getTaskMembers();
		const getLanguage = async () => {
			const tmpLang = await getLangPrefOfUser();
			setLang(tmpLang);
		};
		getLanguage();
	}, []);

	// Update form state when the selected task changes
	useEffect(() => {
		setEditedTask(editedTask);
	}, [editedTask]);

	// Handle form submission

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		// if we have a task selected, we are updating
		if (selectedTask) {
			// if update is successful, clear the selected task
			const resp = await updateTask(editedTask);
			if (resp) {
				setSelectedTask(null);
			}
			// setSelectedTask(null);
		} else {
			// editedTask.project_id = project_id;
			await createTask(editedTask);
			dismiss();
		}
	};

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = event.target;
		if (name === 'completed_date') {
			// date
			const [year, mm, dd] = value.split('-').map(Number);
			const dateObj = new Date(year, mm - 1, dd);

			setEditedTask(prevTask => ({
				...prevTask,
				['due_date']: dateObj,
			}));
		}

		// 	setMembers(members.filter(member => member.name !== value));
		// }
		else if (name === 'status') {
			// status use enums
			const enumStatus = {
				completed: Status.Complete,
				inprogress: Status.InProgress,
				'in progress': Status.InProgress,
				cancelled: Status.Cancelled,
			};
			const keyVal = value.toLowerCase();

			setEditedTask(prevTask => ({
				...prevTask,
				status: enumStatus[keyVal as keyof typeof enumStatus],
			}));
		} else {
			setEditedTask(prevTask => ({
				...prevTask,
				[name]: value,
			}));
		}
	};

	const getDateInput = (date: Date) => {
		date = new Date(date);
		if (isNaN(date.getTime())) {
			const today = new Date();
			return today.toISOString().split('T')[0];
		}
		const dateStr = date.toISOString().split('T')[0];
		return dateStr;
	};
	const formatDate = (date: Date) => {
		const newDate = new Date(date.toLocaleString());
		const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
		const day = newDate.getDate().toString().padStart(2, '0');
		const year = newDate.getFullYear();
		return `${year}-${month}-${day}`;
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="task-modal"
		>
			<h2 className="task-modal-title">
				{selectedTask
					? getLang('Edit Task', lang)
					: getLang('New Task', lang)}
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
					{getLang('Status', lang)}:
				</label>
				<select
					className="option-input"
					id="status"
					name="status"
					value={editedTask.status.toLowerCase()}
					onChange={handleChange}
				>
					<option value="completed">
						{getLang('Completed', lang)}
					</option>
					<option value="in progress">
						{getLang('In Progress', lang)}
					</option>
					<option value="cancelled">
						{getLang('Cancelled', lang)}
					</option>
				</select>
			</div>

			<div className="task-input-field">
				<label
					className="task-labels"
					htmlFor="completed_date"
				>
					{getLang('Completed By', lang)}:
				</label>
				<input
					className=""
					id="completed_date"
					type="date"
					name="completed_date"
					// value={getDateInput(editedTask.due_date)}
					value={formatDate(editedTask.due_date)}
					onChange={handleChange}
				/>
			</div>

			{/* Searching input for user to add new members to tasks  */}
			{selectedTask && editedTask.id && (
				<TaskMemberInput
					role={role}
					task={editedTask}
				/>
			)}
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

			{/* <div className="bg-white shadow rounded-lg p-6">
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
			</div> */}

			<div className="task-btns">
				<button
					type="button"
					className="cancel-btn"
					onClick={() =>
						selectedTask ? setSelectedTask(null) : dismiss()
					}
				>
					{getLang('Cancel', lang)}
				</button>
				<button
					type="submit"
					className="save-btn"
					onClick={async () => {
						if (selectedTask) {
							const resp = await updateTask(editedTask);
							if (resp) {
								// if update is successful, clear the selected task
								setSelectedTask(null);
							}
						} else {
							dismiss();
							editedTask.project_id = project_id;

							await createTask(editedTask);
							window.location.reload();
						}
					}}
				>
					{selectedTask
						? getLang('Save', lang)
						: getLang('Create', lang)}
				</button>
			</div>
		</form>
	);
};
