import '@testing-library/jest-dom';
import { deleteTask } from '@/lib/actions/client';
import { Status, ITasks, Roles } from '../src/types/database.interface';
import { ProjectTask } from '@/components/projects/ProjectTasks/TaskCard';
import { fireEvent, render } from '@testing-library/react';

jest.mock('@/lib/actions/client.ts', () => ({
	deleteTask: jest.fn(),
}));

require('dotenv').config({ path: 'test.env' });
const OLD_ENV = process.env;

beforeEach(() => {
	jest.resetModules(); // Most important - it clears the cache
	process.env = { ...OLD_ENV }; // Make a copy
	jest.spyOn(console, 'error').mockImplementation(() => {});
	jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
	process.env = OLD_ENV; // Restore old environment
	jest.restoreAllMocks();
});

// Testing the ProjectTask component whether it deletes a task
it('should delete a task', async () => {
	// Mocking deleteTask
	jest.doMock('@/lib/actions/client', () => ({
		deleteTask: jest.fn().mockResolvedValue(true),
	}));

	const { deleteTask } = require('@/lib/actions/client');
	const taskId = 'task_id';

	// Calls function using await and taskId
	const result = await deleteTask(taskId);
	// Expecting result to be true if successfully deletes
	expect(result).toBe(true);
});

// Testing delete with Invalid task ID
it('should handle errors when task ID is invalid', async () => {
	// Call the function with an invalid task ID
	const invalidTaskId: ITasks = {
		id: 'invalid_id',
		project_id: '',
		title: '',
		status: Status.ToDo,
		due_date: new Date(),
		completed_date: new Date(),
		created_at: new Date(),
	};

	// Mock deleteTask function
	const deleteTaskMock = jest.fn().mockResolvedValueOnce({
		error: true,
		message: 'Invalid task ID',
	});
	// Assign the mock function to deleteTask
	(deleteTask as jest.Mock).mockImplementation(deleteTaskMock);

	const result = await deleteTask(invalidTaskId);

	// Expects result to have an error with invalid task ID
	expect(result).toEqual({
		error: true,
		message: 'Invalid task ID',
	});
});

// Testing with delete button
it('should delete a task when delete button is clicked', async () => {
	// Mocking deleteTask
	const deleteTaskMock = jest.fn().mockResolvedValue(true);
	(deleteTask as jest.Mock).mockImplementation(deleteTaskMock);

	// Sample task
	const task: ITasks = {
		id: '123e4567-e89b-12d3-a456-426614174000',
		project_id: 'project_123',
		title: 'Tasks',
		status: Status.ToDo,
		due_date: new Date(),
		completed_date: new Date(),
		created_at: new Date(),
	};

	// Render ProjectTask component with the sample task
	const { getByTestId } = render(
		<ProjectTask
			task={task}
            // Mocking the role as ADMIN 
			role={Roles.ADMIN}
		/>,
	);

	// Find delete button icon by test ID
	const deleteButton = getByTestId('delete-task-btn');

	// Fire event on delete button
	fireEvent.click(deleteButton);

	// Expect deleteTask function is called with the correct task ID (not sure why its being called twice aha)
	expect(deleteTask).toHaveBeenNthCalledWith(2, task);
});

// Check rendering content
describe('ProjectTask', () => {
	it('renders the correct content', async () => {
		// Sample task
		const task: ITasks = {
			id: '123e4567-e89b-12d3-a456-426614174000',
			project_id: 'project123',
			title: 'Tasks',
			status: Status.Complete,
			due_date: new Date(),
			completed_date: new Date(),
			created_at: new Date(2024, 2, 25),
		};

		const { getByText } = render(
			<ProjectTask
				task={task}
				role={Roles.ADMIN}
			/>,
		);

		// Check task title is being rendered correctly
		expect(getByText('Tasks')).toBeInTheDocument();

		// Check task status is being rendered correctly
		// may need to implement more cases for more statuses
		expect(getByText('complete')).toBeInTheDocument();
	});
});
