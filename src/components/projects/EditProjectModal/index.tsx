import InputComponent from '@/components/SharedComponents/InputComponent';
import { createSupbaseClient } from '@/lib/supabase/client';
import { IProjects, Status } from '@/types/database.interface';
import { useState } from 'react';
import './EditProjectModal.css';

export const EditProjectModal = ({
	onClose,
	project,
}: {
	onClose: () => void;
	project: IProjects;
}) => {
	const [error, setError] = useState(false);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();

		return `${year}-${month}-${day}`;
	};

	const [formData, setFormData] = useState({
		projectTitle: project.title,
		projectOrgId: project.org_id,
		projectBudget: project.budget.toString(),
		projectDescription: project.details,
		projectStatus: project.status.toString(),
		projectLocation: project.address,
		projectStartDate: formatDate(project.start_date.toString()),
		projectEndDate: formatDate(project.due_date.toString()),
		projectAssignedMembers: '',
		projectCreator: project.created_by,
		projectCreatedDate: formatDate(project.created_at.toString()),
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	const handleStatusChange = (status: string) => {
		setFormData({
			...formData,
			projectStatus: status,
		});
	};

	const getStatus = (status: string) => {
		switch (status.toLowerCase()) {
			case 'in-progress':
			case 'in progress':
				return Status.InProgress;
			case 'needs-approval':
			case 'needs approval':
				return Status.NeedsApproval;
			case 'action-needed':
			case 'action needed':
				return Status.ActionNeeded;
			case 'to-do':
			case 'to do':
				return Status.ToDo;
			case 'cancelled':
				return Status.Cancelled;
			default:
				return Status.InProgress;
		}
	};

	const getStatusEnum = (status: string) => {
		switch (status.toLowerCase()) {
			case 'in-progress':
			case 'in progress':
				return Status.InProgress;
			case 'needs-approval':
			case 'needs approval':
				return Status.NeedsApproval;
			case 'action-needed':
			case 'action needed':
				return Status.ActionNeeded;
			case 'to-do':
			case 'to do':
				return Status.ToDo;
			case 'cancelled':
				return Status.Cancelled;
			case 'completed':
			case 'complete':
				return Status.Complete;
			default:
				return Status.InProgress;
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		// Submit to DB once API is ready
		const supabase = await createSupbaseClient();
		console.log('status: ', formData.projectStatus);

		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		const submissionData = {
			org_id: formData.projectOrgId,
			title: formData.projectTitle,
			address: formData.projectLocation,
			status: getStatusEnum(formData.projectStatus),
			budget: formData.projectBudget,
			details: formData.projectDescription,
			due_date: formData.projectEndDate,
			start_date: formData.projectStartDate,
			current_spent: formData.projectBudget,
		};

		// query db to create new entry
		const { data: entryData, error: entryError } = await supabase
			.from('projects')
			.update(submissionData)
			.eq('id', project.id);

		// if there is an error, set error to true and display error message
		if (entryError) {
			console.log(entryError);
			setError(true);
			setTimeout(() => {
				setError(false);
			}, 5000);
			return;
		}

		window.location.reload();
	};

	return (
		<div className="modal-overlay">
			<div className="project-details-modal">
				<div className="header-content">
					<h1 className="header">Project Details</h1>
					<button
						className="close-modal-button"
						onClick={onClose}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="close-btn"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18 18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<div>
					<form
						action=""
						method="post"
						className="w-full space-y-2"
						onSubmit={handleSubmit}
					>
						<InputComponent
							label="projectTitle"
							labelText="Title"
							type="text"
							id="projectTitle"
							placeholder="Project Title"
							value={formData.projectTitle}
							onChange={handleChange}
							required={true}
							className="w-full"
						/>
						<InputComponent
							label="projectBudget"
							labelText="Budget"
							type="number"
							id="projectBudget"
							placeholder="Project Budget"
							value={formData.projectBudget}
							onChange={handleChange}
							required={true}
						/>
						<InputComponent
							label="projectDescription"
							labelText="Description"
							type="text"
							id="projectDescription"
							placeholder="Project Description"
							value={formData.projectDescription}
							onChange={handleChange}
							required={true}
						/>
						<label className="status-header">Status</label>
						<div className="status-labels">
							<button
								className={`status-button in-progress ${
									formData.projectStatus === 'In-Progress' ||
									formData.projectStatus === Status.InProgress
										? 'border-black border-2'
										: ''
								}`}
								onClick={e => {
									e.preventDefault();

									handleStatusChange('In-Progress');
								}}
							>
								In-Progress
							</button>
							<button
								className={`status-button completed ${
									formData.projectStatus === 'Completed' ||
									formData.projectStatus === Status.Complete
										? 'border-black border-2'
										: ''
								}`}
								onClick={e => {
									e.preventDefault();
									handleStatusChange('Completed');
								}}
							>
								Completed
							</button>
							<button
								className={`status-button needs-approval ${
									formData.projectStatus ===
										Status.NeedsApproval ||
									formData.projectStatus === 'Needs-Approval'
										? 'border-black border-2'
										: ''
								}`}
								onClick={e => {
									e.preventDefault();
									handleStatusChange('Needs-Approval');
								}}
							>
								Needs-Approval
							</button>
							<button
								className={`status-button action-needed ${
									formData.projectStatus ===
										'Action Needed' ||
									formData.projectStatus ===
										Status.ActionNeeded
										? 'border-black border-2'
										: ''
								}`}
								onClick={e => {
									e.preventDefault();
									handleStatusChange('Action Needed');
								}}
							>
								Action Needed
							</button>
						</div>
						<InputComponent
							label="projectLocation"
							labelText="Location"
							type="text"
							id="projectLocation"
							placeholder="Location"
							value={formData.projectLocation}
							onChange={handleChange}
							required={true}
						/>
						<InputComponent
							label="projectStartDate"
							labelText="Start Date"
							type="date"
							id="projectStartDate"
							placeholder="Start Date"
							value={formData.projectStartDate}
							onChange={handleChange}
							required={true}
						/>
						<InputComponent
							label="projectEndDate"
							labelText="End Date"
							type="date"
							id="projectEndDate"
							placeholder="End Date"
							value={formData.projectEndDate}
							onChange={handleChange}
							required={true}
						/>
						<InputComponent
							label="projectAssignedMembers"
							labelText="Assigned Members"
							type="text"
							id="projectAssignedMembers"
							placeholder="Assigned Members"
							value={formData.projectAssignedMembers}
							onChange={handleChange}
							required={false}
							className="mb-4"
						/>
						{error && (
							<span className="text-primary-red-300 text-center">
								Error submitting new project
							</span>
						)}

						<button
							className="submit-new-project-button"
							type="submit"
						>
							Submit
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
