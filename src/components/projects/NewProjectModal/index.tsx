'use client';

import InputComponent from '@/components/SharedComponents/InputComponent';
import { useState } from 'react';
import './NewProjectModal.css';

export const NewProjectModal = ({ onClose }: { onClose: () => void }) => {
	const [formData, setFormData] = useState({
		projectTitle: '',
		projectBudget: '',
		projectDescription: '',
		projectStatus: '',
		projectLocation: '',
		projectStartDate: '',
		projectEndDate: '',
		projectAssignedMembers: '',
		projectCreator: '',
		projectCreatedDate: '',
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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const updatedFormData = {
			...formData,

			created_at: new Date().toISOString(),
		};

		// TODO: implement logic here once we setup trigger on supabase

		const jsonFormData = JSON.stringify(updatedFormData);

		// Submit to DB once API is ready
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
									formData.projectStatus === 'In-Progress'
										? 'border-black border-2'
										: ''
								}`}
								onClick={() =>
									handleStatusChange('In-Progress')
								}
							>
								In-Progress
							</button>
							<button
								className={`status-button completed ${
									formData.projectStatus === 'Completed'
										? 'border-black border-2'
										: ''
								}`}
								onClick={() => handleStatusChange('Completed')}
							>
								Completed
							</button>
							<button
								className={`status-button needs-approval ${
									formData.projectStatus === 'Needs-Approval'
										? 'border-black border-2'
										: ''
								}`}
								onClick={() =>
									handleStatusChange('Needs-Approval')
								}
							>
								Needs-Approval
							</button>
							<button
								className={`status-button action-needed ${
									formData.projectStatus === 'Action Needed'
										? 'border-black border-2'
										: ''
								}`}
								onClick={() =>
									handleStatusChange('Action Needed')
								}
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
							required={true}
							className="mb-4"
						/>
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

// export default Page;
