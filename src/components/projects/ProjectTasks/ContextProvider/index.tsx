'use client';

import { createSupbaseClient } from '@/lib/supabase/client';
import { ITasks, IUsers } from '@/types/database.interface';
import { createContext, useState } from 'react';

interface taskMembers {
	id: string;
	user: IUsers;
}

interface TaskContextContent {
	tasks: ITasks[];
	setTasks: (tasks: ITasks[]) => void;
	tasksMembers: taskMembers[];
	setTaskMembers: (members: taskMembers[]) => void;
	addTask: (task: ITasks) => void;
	removeTask: (task: ITasks) => void;
	updateTask: (task: ITasks | any) => void;
	// addMember: any;
	// removeMember: any;
	selectedTask: ITasks | null;
	setSelectedTask: (task: ITasks | null) => void;
}

// was maybe thinking using this for filtering tasks and such...
interface FilteredTasks {
	completedTasks: ITasks[];
	inProgressTasks: ITasks[];
	cancelledTasks: ITasks[];

	isSmallScreen: boolean;
	selectedCategory: string;
	setSelectedCategory: (category: string) => void;
}

export const TaskContext = createContext<TaskContextContent>({
	tasks: [],
	setTasks: () => {},
	tasksMembers: [],
	setTaskMembers: () => {},
	addTask: () => {},
	removeTask: () => {},
	updateTask: () => {},
	// addMember: () => {},
	// removeMember: () => {},
	selectedTask: null,
	setSelectedTask: () => {},
});

export const TaskContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [tasks, setTasks] = useState<ITasks[]>([]);
	const [tasksMembers, setTaskMembers] = useState<taskMembers[]>([]);
	const [selectedTask, setSelectedTask] = useState<ITasks | null>(null);

	const addTask = (task: ITasks) => {
		setTasks([...tasks, task]);
	};

	const removeTask = (task: ITasks) => {
		setTasks(tasks.filter(t => t.id !== task.id));
	};

	const updateTask = async (task: ITasks) => {
		
		const supabase = await createSupbaseClient();

		const { data, error } = await supabase
			.from('tasks')
			.update({
				title: task.title,
				due_date: task.due_date,
				status: task.status.toLocaleLowerCase(),
				completed_date: task.completed_date,
			})
			.eq('id', task.id);

		if (error) {
			console.error('Error updating task:', error);
		}

		

		// update current tasks state
		setTasks(tasks.map(t => (t.id === task.id ? task : t)));
	};

	return (
		<TaskContext.Provider
			value={{
				tasks,
				setTasks,
				tasksMembers,
				setTaskMembers,
				addTask,
				removeTask,
				updateTask,
				selectedTask,
				setSelectedTask,
			}}
		>
			{children}
		</TaskContext.Provider>
	);
};
