'use client';

import { ITasks, IUsers, Status } from '@/types/database.interface';
import { useContext, useEffect, useState } from 'react';
import { TaskContext } from './ContextProvider';
import { ProjectTask } from './TaskCard';
import CreateTaskForm from '../ProjectTasks/AddNewTask/AddNewTask';
import ErrorMessage from '@/components/SharedComponents/ErrorModal';
// css imports
import './ProjectTask.css';
import { EditTaskForm } from './NewTask';
import {
	addMembertoTask,
	addTaskMember,
	deleteTask,
	getAllNonTaskMembers,
	getAllTaskMembers,
	removeMemberFromTask,
} from '@/lib/actions/client';
import Image from 'next/image';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createSupbaseClient } from '@/lib/supabase/client';

// return array of 3 ITasks array filtered
export function organizeTasks(tasks: ITasks[]) {
	const completedTasks: ITasks[] = [];
	const inProgressTasks: ITasks[] = [];
	const cancelledTasks: ITasks[] = [];

	tasks.forEach(task => {
		switch (task.status) {
			case Status.Complete:
				completedTasks.push(task);
				break;
			case Status.InProgress:
				inProgressTasks.push(task);
				break;
			default:
				cancelledTasks.push(task);
				break;
		}
	});

	return [completedTasks, inProgressTasks, cancelledTasks];
}

// container component for tasks
export function TasksSection({
	tasks: allProjecTasks,
	role,
	project_id,
}: {
	tasks: any | ITasks[];
	role: string;
	project_id: string;
}) {
	const { tasks, setTasks, setTaskMembers, selectedTask } =
		useContext(TaskContext);
	const [isTaskCreating, setTaskCreating] = useState(false);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState('Completed');
	const [errorDetails, SetErrrDetails] = useState(
		'No error detected, try contacting our dev team and we shall help',
	);
	// filter tasks on status
	useEffect(() => {
		setTasks(allProjecTasks);

		// set the projects association members
		const getMembs = async () => {
			const resp = await getAllTaskMembers(project_id);

			setTaskMembers(resp as any);
		};

		getMembs();
	}, [allProjecTasks]);

	// add a listener to the window to check for screen size
	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			setIsSmallScreen(width < 800);
		};

		window.addEventListener('resize', handleResize);

		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<>
			{isSmallScreen ? (
				<MobileView
					tasks={tasks}
					selectedCategory={selectedCategory}
					setSelectedCategory={setSelectedCategory}
					role={role}
				/>
			) : (
				<DesktopView
					tasks={tasks}
					role={role}
				/>
			)}

			{/**TO DO HANDLE ORG_ID  -HASHEM */}
			{selectedTask && (
				<EditTaskForm
					role={role}
					setRefresh={() => {}}
					dismiss={() => {}}
					org_id={'d'}
					project_id={project_id}
					newTask={false}
				/>
			)}
			{!(
				errorDetails ===
					'No error detected, try contacting our dev team and we shall help' &&
				errorDetails !== null
			) && (
				<ErrorMessage
					title="Error"
					message={`Ooooops, something seems to have gone wrong, here is the error:\n${errorDetails}`}
					imageUrl="https://img.freepik.com/premium-photo/photo-shocked-real-camel-nature-bokeh-background-ai-generative_407474-14518.jpg"
				/>
			)}
		</>
	);
}

// component for mobile view
const MobileView = ({
	tasks,
	selectedCategory,
	setSelectedCategory,
	role,
}: any) => {
	const [completedTasks, setCompletedTasks] = useState<ITasks[]>([]);
	const [inProgressTasks, setInProgressTasks] = useState<ITasks[]>([]);
	const [cancelledTasks, setCancelledTasks] = useState<ITasks[]>([]);

	// filter tasks on status
	useEffect(() => {
		// redundant code, fix er up hehe
		const newListOfCompletedTasks: ITasks[] = [];
		const newListOfInProgressTasks: ITasks[] = [];
		const newListOfCancelledTasks: ITasks[] = [];

		tasks.forEach((task: ITasks) => {
			switch (task.status) {
				case Status.Complete:
					newListOfCompletedTasks.push(task);
					break;
				case Status.InProgress:
					newListOfInProgressTasks.push(task);
					break;
				default:
					newListOfCancelledTasks.push(task);
					break;
			}
		});

		setCompletedTasks(newListOfCompletedTasks);
		setInProgressTasks(newListOfInProgressTasks);
		setCancelledTasks(newListOfCancelledTasks);
	}, [tasks]);

	return (
		<div className="flex flex-col items-center justify-between mb-4">
			<h2 className="text-xl font-bold w-fit">Tasks</h2>
			<select
				value={selectedCategory}
				onChange={e => setSelectedCategory(e.target.value)}
				className="rounded-md border border-gray-300 p-2 min-w-fit text-sm font-medium"
			>
				<option value="Completed">Completed</option>
				<option value="InProgress">In Progress</option>
				<option value="NeedsApproval">Cancelled</option>
			</select>

			{completedTasks.map(
				(task, index) =>
					selectedCategory === 'Completed' && (
						<ProjectTask
							key={index}
							task={task}
							role={role}
						/>
					),
			)}

			{inProgressTasks.map(
				(task, index) =>
					selectedCategory === 'InProgress' && (
						<ProjectTask
							key={index}
							task={task}
							role={role}
						/>
					),
			)}

			{cancelledTasks.map(
				(task, index) =>
					selectedCategory === 'NeedsApproval' && (
						<ProjectTask
							key={index}
							task={task}
							role={role}
						/>
					),
			)}
		</div>
	);
};

// component for desktop view
const DesktopView = ({ tasks, role }: { tasks: ITasks[]; role: string }) => {
	const [completedTasks, setCompletedTasks] = useState<ITasks[]>([]);
	const [inProgressTasks, setInProgressTasks] = useState<ITasks[]>([]);
	const [cancelledTasks, setCancelledTasks] = useState<ITasks[]>([]);

	// filter tasks on status
	useEffect(() => {
		const [
			newListOfCompletedTasks,
			newListOfInProgressTasks,
			newListOfCancelledTasks,
		] = organizeTasks(tasks);

		setCompletedTasks(newListOfCompletedTasks);
		setInProgressTasks(newListOfInProgressTasks);
		setCancelledTasks(newListOfCancelledTasks);
	}, [tasks]);

	if (!tasks.length) {
		return (
			<div className="flex flex-col items-center justify-center h-80">
				<h2 className="text-xl font-bold">No tasks yet</h2>
			</div>
		);
	}

	return (
		<div className={`flex flex-row gap-2 max-w-screen justify-between`}>
			<div className="flex-row m-4">
				<h2 className={`text-xl font-bold my-2`}>Completed Tasks</h2>
				<div
					className={`flex flex-col gap-2 overflow-auto ${
						tasks.length ? 'h-80' : ''
					}`}
				>
					{completedTasks.map((task, index) => (
						<ProjectTask
							key={index}
							task={task}
							role={role}
						/>
					))}
				</div>
			</div>
			<div className="flex-row m-4">
				<h2 className={`text-xl font-bold my-2`}>In Progress Tasks</h2>
				<div
					className={`flex flex-col gap-2 overflow-auto ${
						tasks.length ? 'h-80' : ''
					}`}
				>
					{inProgressTasks.map((task, index) => (
						<ProjectTask
							key={index}
							task={task}
							role={role}
						/>
					))}
				</div>
			</div>
			<div className="flex-row m-4">
				<h2 className={`text-xl font-bold my-2`}>Cancelled Tasks</h2>
				<div
					className={`flex flex-col gap-2 overflow-auto ${
						tasks.length ? 'h-80' : ''
					}`}
				>
					{cancelledTasks.map((task, index) => (
						<ProjectTask
							key={index}
							task={task}
							role={role}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

// component for editing a task; minimal client component
export function SelectTask({ task }: { task: ITasks }) {
	const { setSelectedTask } = useContext(TaskContext);

	const handleSelection = () => {
		setSelectedTask(task);
	};

	return (
		<button onClick={handleSelection}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="select-task-btn"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
				/>
			</svg>
		</button>
	);
}

// component for deleting a task; minimal client component (only admin or supervisor)
export function DeleteTask({ task }: { task: ITasks }) {
	// const { removeTask } = useContext(TaskContext);

	const handleDelete = async () => {
		const resp = await deleteTask(task);

		if (resp) {
			window.location.reload();
		}
	};

	return (
		<svg
			onClick={handleDelete}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="delete-task-btn"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
			/>
		</svg>
	);
}

export function TaskMemberInput({
	task,
	role,
}: {
	task: ITasks;
	role?: string;
}) {
	// const { setEditedTask } = useContext(TaskContext);
	const [members, setMembers] = useState<IUsers[]>([]);
	const [currInput, setCurrInput] = useState<string>('');

	const [nonMembers, setNonMembers] = useState<IUsers[]>([]);

	const [searchResults, setSearchResults] = useState<IUsers[]>([]);

	useEffect(() => {
		// fetch members from db
		const getMembs = async () => {
			const resp = await getAllTaskMembers(task.id);

			setMembers(resp);
		};

		const getNonMems = async () => {
			const resp = await getAllNonTaskMembers(task.id);
			setNonMembers(resp);
		};

		// setMembers(members);
		getMembs();
		getNonMems();
	}, []);

	const handleSearch = (e: any) => {
		const search = e.target.value;
		setCurrInput(search);

		const results = nonMembers.filter(
			member =>
				member.name.toLowerCase().includes(search.toLowerCase()) ||
				member.email.toLowerCase().includes(search.toLowerCase()) ||
				member.username.toLowerCase().includes(search.toLowerCase()),
		);

		// limit to top 3 results
		const LIMIT = 3;
		results.length = results.length > LIMIT ? LIMIT : results.length;

		setSearchResults(results);
	};

	const handleBlur = () => {
		setSearchResults([]);
	};

	const handleAddMember = (member: IUsers) => {
		console.log('I like Mexico');
		setMembers([...members, member]);
		setCurrInput('');
	};

	return (
		<div className="task-input-field relative">
			<label
				className="task-labels"
				htmlFor="members"
			>
				Members:
			</label>
			<input
				className="flex-grow mr-2"
				id="members"
				type="text"
				name="members"
				value={currInput}
				onChange={handleSearch}
				autoComplete="off"
				// onBlur={handleBlur}
			/>

			{/* search box reuslts */}
			<div className="task-member-search-container">
				{searchResults.map((member, index) => (
					<TaskMemberSearchCard
						key={index}
						task={task}
						member={member}
						handler={() => {
							handleAddMember(member);
						}}
					/>
				))}
			</div>

			{/* member badges already associated*/}
			<div className="task-member-input-badge absolute left-3/4 bottom-1 whitespace-nowrap flex gap-2 overflow-x-scroll max-h-[12em] max-w-[6em] md:max-w-[8em] ">
				{members.sort().map((member, index) => (
					<TaskMemberInputBadge
						task={task}
						role={role}
						key={index}
						member={member}
					/>
				))}
			</div>
		</div>
	);
}

// component for displaying a member badge
function TaskMemberInputBadge({
	member,
	role,
	task,
}: {
	member: IUsers;
	role?: string;
	task: ITasks;
}) {
	const DelePriv = () => {
		console.info('Role of user is :', role);
		return (
			role?.toLocaleLowerCase() === 'admin' ||
			role?.toLocaleLowerCase() === 'supervisor'
		);
	};

	const adminPriviledge = DelePriv();
	return (
		<div className="task-member-badge flex items-center justify-center gap-2 rounded-3xl bg-primary-green-50 p-2 relative  ">
			<Image
				src={member.image || '/images/default-profile.png'}
				alt="profile picture"
				width={20}
				height={20}
				className="rounded-full"
			/>

			<span className="text-white text-xs text-start truncate">
				{member.name}
				{adminPriviledge && (
					<div
						onClick={() => {
							removeMemberFromTask(task, member.id).then(res => {
								console.info('user removed from task');
								window.location.reload();
							});
						}}
						className="absolute top-0 right-0 bg-red-300 text-white text-center transform translate-y-1/2  rounded-lg bg-center"
					>
						X
					</div>
				)}
			</span>
		</div>
	);
}

// component for displaying the members card when searching to add new members
function TaskMemberSearchCard({
	member,
	handler,
	task,
}: {
	member: IUsers;
	handler: any;
	task: ITasks;
}) {
	const addMemberToTask = async (e: any) => {
		e.stopPropagation();
		console.log('clicked member addition...');
		const resp = await addTaskMember(task.project_id, task.id, member.id);

		if (!resp) {
			// error
			// display some msgs
			return;
		}

		window.location.reload();
	};

	return (
		<button
			className="task-member-search-badge z-50 cursor-zoom-in "
			onClick={addMemberToTask}
		>
			<Image
				src={member.image || '/images/default-profile.png'}
				alt="profile picture"
				width={40}
				height={20}
				className="rounded-full"
			/>

			<span className="name">{member.name}</span>

			<div className="add-icon">+</div>
		</button>
	);
}
