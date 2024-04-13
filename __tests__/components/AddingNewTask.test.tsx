import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CreateTaskForm from '@/components/projects/ProjectTasks/AddNewTask/AddNewTask';
import { ITasks, Status } from '@/types/database.interface';
import { createTask, deleteTask } from '@/lib/actions/client';

import { faker } from '@faker-js/faker';

describe('CreateTaskForm component', () => {
	it('should call onSave prop when form is submitted', async () => {
		// mock call to createTask
		const task: ITasks = {
			title: faker.word.adjective(8),
			created_at: new Date(),
			status: Status.InProgress,
			completed_date: new Date(),
			due_date: new Date(),
			project_id: `${process.env.PROJECT_ID!}`,
			id: faker.string.uuid(),
		};

		const resp = await createTask(task);

		expect(resp.error).toBeFalsy();

		// delete the test task we created
		const deleteResp = await deleteTask(task);
		expect(deleteResp).toBeTruthy();
	});
	it('should render form inputs correctly', () => {
		//allows to do mock data
		const onSaveMock = jest.fn();
		const { getByLabelText } = render(
			<CreateTaskForm onSave={onSaveMock} />,
		);
		// <CreateTaskForm onSave={onSaveMock} />

		// inputs
		// const taskNameInput = getByLabelText('Task Name');
		// const createdAtInput = getByLabelText('Created At');
		// const statusSelect = getByLabelText('Status');
		// const completedByInput = getByLabelText('Completed By');
		// const membersInput = getByLabelText('Members');
		const taskNameInput = document.querySelector('input[name="taskName"]');
		const createdAtInput = document.querySelector(
			'input[name="createdAt"]',
		);
		const statusSelect = document.querySelector('select[name="status"]');
		const completedByInput = document.querySelector(
			'input[name="completedBy"]',
		);
		const membersInput = document.querySelector('input[name="members"]');

		expect(taskNameInput).toBeInTheDocument();
		expect(createdAtInput).toBeInTheDocument();
		expect(statusSelect).toBeInTheDocument();
		expect(completedByInput).toBeInTheDocument();
		expect(membersInput).toBeInTheDocument();
	});

	it('should update state on input change', () => {
		const onSaveMock = jest.fn();
		const { getByLabelText } = render(
			<CreateTaskForm onSave={onSaveMock} />,
		);
		// const taskNameInput = getByLabelText('Task Name');
		const taskNameInput = document.querySelector(
			'input[name="taskName"]',
		) as HTMLInputElement;

		fireEvent.change(taskNameInput, { target: { value: 'New Task' } });
		expect(taskNameInput.value).toBe('New Task');
	});
});