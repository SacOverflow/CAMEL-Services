import { ITasks } from '@/types/database.interface';
import { TasksSection } from './client';
import { TaskContextProvider } from './ContextProvider';

// not sure if actually server side
//ans: if it is importing any client componants then it is a client side I think.
export function TasksSectionContainer({
	tasks,
	role,
	project_id,
}: {
	tasks: ITasks[];
	role: string;
	project_id: string;
}) {
	return (
		<TaskContextProvider>
			<TasksSection
				project_id={project_id}
				tasks={tasks}
				// used in TaskCard to allow for deletion of tasks
				role={role}
			/>
		</TaskContextProvider>
	);
}
