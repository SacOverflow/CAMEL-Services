'use client';

import { IProject_Activities, Status } from '@/types/database.interface';
// CSS imports
import './ProjectActivity.css';
import { useEffect, useState } from 'react';
import { createSupbaseClient } from '@/lib/supabase/client';
import {
	createProjectActivity,
	editProjectActivity,
} from '@/lib/actions/client';

export default function ProjectActivityModal({
	project_id,
	project,
	closeModal,
	readMode = true,
}: {
	project_id: string;
	project?: IProject_Activities;
	closeModal: () => void;
	// readmode default true
	readMode: boolean;
}) {
	const [activity, setActivity] = useState<IProject_Activities>({
		id: project?.id || '',
		task_id: project?.task_id || '',
		created_at: project?.created_at || new Date(),
		user_id: project?.user_id || '',
		project_id: project?.project_id || project_id,
		status: project?.status || Status.Complete,
		notes: project?.notes || '',
		timestamp: project?.timestamp || new Date(),
		duration: project?.duration || 0,
	});
	const [popupText, setPopupText] = useState<boolean>(false);

	const [projectText, setProjectText] = useState<string>(
		project ? 'Edit Activity' : 'Add Activity',
	);

	useEffect(() => {
		const getProjectActivity = async () => {
			const supabase = await createSupbaseClient();

			const { data, error } = await supabase.auth.getUser();

			if (error) {
				console.error('Error getting user:', error);
				return;
			}

			const {
				user: { id },
			} = data as any;
			setActivity({ ...activity, user_id: id });
		};

		getProjectActivity();
	}, []);

	// handle form updates
	const handleStatusChange = (status: Status) => {
		setActivity({ ...activity, status });
	};

	const handleNotesChange = (notes: string) => {
		setActivity({ ...activity, notes });
	};

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// dont update if not valid date
		if (isNaN(new Date(e.target.value).getTime())) {
			return;
		}
		// convert to date object
		const date = new Date(e.target.value);
		// format for ISO format representation
		const isoDate = date.toISOString().split('T')[0];
		const mm = isoDate.split('-')[1];
		const dd = isoDate.split('-')[2];
		const yyyy = isoDate.split('-')[0];

		const timestamp = new Date(activity.timestamp);

		timestamp.setFullYear(parseInt(yyyy));
		timestamp.setMonth(parseInt(mm) - 1);
		timestamp.setDate(parseInt(dd));

		setActivity({ ...activity, timestamp });
	};

	const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// validate the incoming time format and is valid Date time object
		const time = e.target.value.split(':');

		const validationChecks = [
			time.length === 3,
			parseInt(time[0], 10) >= 0 && parseInt(time[0], 10) <= 23,
			parseInt(time[1], 10) >= 0 && parseInt(time[1], 10) <= 59,
			parseInt(time[2], 10) >= 0 && parseInt(time[2], 10) <= 59,
		];
		if (validationChecks.some(check => !check)) {
			// invalid time format
			return;
		}

		// Update the time part of the timestamp based on the input provided by the user
		const timestamp = new Date(activity.timestamp);

		// Get the current date part of the timestamp
		const year = timestamp.getFullYear();
		const month = timestamp.getMonth();
		const day = timestamp.getDate();

		// Set the time part of the timestamp based on the input provided by the user
		timestamp.setHours(parseInt(time[0], 10));
		timestamp.setMinutes(parseInt(time[1], 10));
		timestamp.setSeconds(parseInt(time[2], 10));

		// Construct a new Date object with the updated time and original date
		const updatedTimestamp = new Date(
			year,
			month,
			day,
			timestamp.getHours(),
			timestamp.getMinutes(),
			timestamp.getSeconds(),
		);

		setActivity({ ...activity, timestamp: updatedTimestamp });
	};

	// handle duration
	const handleDurationChange = (duration: number) => {
		setActivity({ ...activity, duration });
	};

	// handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// send activity to server
		if (project) {
			await editActivity(activity);
		} else {
			await createActivity();
		}
	};

	const editActivity = async (activity: IProject_Activities) => {
		// const supabase = await createSupbaseClient();

		// Function to format timestamp as UTC string
		const formatTimestampUTC = (date: Date) => {
			// check if date is valid
			if (typeof date === 'string') {
				date = new Date(date);
			}
			if (isNaN(date.getTime())) {
				console.log('error: ', 'date is invalid');
			}

			// Get UTC date components; format to store in ISO
			const year = date.getFullYear();
			const month = date.getMonth() + 1; // Month is zero-based, so add 1
			const day = date.getDate();
			const hours = date.getHours();
			const minutes = date.getMinutes();
			const seconds = date.getSeconds();

			// Format as YYYY-MM-DD HH:MM:SS
			return `${year}-${month.toString().padStart(2, '0')}-${day
				.toString()
				.padStart(2, '0')} ${hours
				.toString()
				.padStart(2, '0')}:${minutes
				.toString()
				.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		};

		// validate the object
		// utilize both insert data and activity, but overwrite with just
		const response = await editProjectActivity(activity, project_id);

		// if response is empty object, then there was an error
		if (Object.keys(response).length === 0) {
			console.error('Error updating project activity');
			setPopupText(true);

			setTimeout(() => {
				setPopupText(false);
			}, 5000);

			return;
		}

		// if response is not empty, then it was successful
		window.location.reload();
	};

	const createActivity = async () => {
		if (!activity.user_id) {
			console.log('error: ', 'user_id is required');
			return;
		}

		const response = await createProjectActivity(activity, project_id);

		// if response is empty object, then there was an error
		if (Object.keys(response).length === 0) {
			console.error('Error creating project activity');
			setPopupText(true);

			setTimeout(() => {
				setPopupText(false);
			}, 5000);

			return;
		}

		console.log('Created Activity: ', response);

		// if response is not empty, then it was successful
		window.location.reload();
	};

	// Function to format date for display in the input field
	const formatDateForInput = (date: Date): string => {
		date = new Date(date);
		// verify if date is valid
		if (isNaN(date.getTime())) {
			return '';
		}
		// Format: YYYY-MM-DD
		return date.toISOString().split('T')[0];
	};

	// Function to format time for display in the input field
	const formatTimeForInput = (date: Date): string => {
		date = new Date(date);
		const hh = date.getHours().toString().padStart(2, '0');
		const mm = date.getMinutes().toString().padStart(2, '0');
		const ss = date.getSeconds().toString().padStart(2, '0');
		// Format: HH:MM:SS
		return `${hh}:${mm}:${ss}`;
	};

	return (
		<div className="project-activity-modal">
			<div className="project-activity-container">
				<span className="header">{projectText}</span>
				<form
					className="input-form"
					onSubmit={handleSubmit}
				>
					<div className="input-field">
						<label htmlFor="Statuses">Status</label>

						<div className="status-labels">
							<button
								className={`status-button completed ${
									activity.status === Status.Complete &&
									'active'
								}`}
								disabled={readMode}
								onClick={e => {
									e.preventDefault();
									handleStatusChange(Status.Complete);
								}}
							>
								Completed
							</button>
							<button
								className={`status-button in-progress ${
									activity.status === Status.InProgress &&
									'active'
								}`}
								disabled={readMode}
								onClick={e => {
									e.preventDefault();
									handleStatusChange(Status.InProgress);
								}}
							>
								In-Progress
							</button>
							<button
								className={`status-button needs-approval ${
									activity.status === Status.NeedsApproval &&
									'active'
								}`}
								disabled={readMode}
								onClick={e => {
									e.preventDefault();
									handleStatusChange(Status.NeedsApproval);
								}}
							>
								Needs-Approval
							</button>
							<button
								className={`status-button action-needed ${
									activity.status === Status.ActionNeeded &&
									'active'
								}`}
								// if readMode dont allow changing
								disabled={readMode}
								onClick={e => {
									e.preventDefault();
									handleStatusChange(Status.ActionNeeded);
								}}
							>
								Action Needed
							</button>
						</div>
					</div>
					<div className="input-field">
						<label htmlFor="notes">Notes</label>
						<textarea
							name="notes"
							id="notes"
							className=""
							placeholder="Enter notes here..."
							required={true}
							onChange={e => handleNotesChange(e.target.value)}
							value={activity.notes}
						></textarea>
					</div>

					<div className="time-inputs-container ">
						{/* date */}
						<div className="input-field w-3/6">
							<label htmlFor="date">Date</label>
							<input
								type="date"
								name="date"
								id="date"
								onChange={e => handleDateChange(e)}
								disabled={readMode}
								value={formatDateForInput(activity.timestamp)}
							/>
						</div>
						<div className="input-field w-2/6">
							<label htmlFor="start-time">Time</label>
							<input
								type="time"
								name="start-time"
								id="start-time"
								disabled={readMode}
								onChange={(
									e: React.ChangeEvent<HTMLInputElement>,
								) => handleStartTimeChange(e)}
								value={formatTimeForInput(activity.timestamp)}
							/>
						</div>

						<div className="input-field w-1/6">
							<label htmlFor="duration">Duration</label>
							<DurationInput
								duration={activity.duration}
								durationEvent={handleDurationChange}
								readMode={readMode}
							/>
						</div>
					</div>

					{popupText && (
						<span className="error-message text-center">
							Error. Please try again.
						</span>
					)}

					<div className="mx-auto flex gap-2">
						<button
							className="btn btn-secondary btn-large bg-red-200"
							onClick={() => {
								closeModal();
							}}
						>
							{/* Cancel */}
							{readMode ? `Exit` : `Cancel`}
						</button>
						{readMode ? null : (
							<button className="btn btn-primary btn-large">
								Submit
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}

const DurationInput = ({
	duration,
	durationEvent,
	readMode = true,
}: {
	duration: number;
	durationEvent: (duration: number) => void;
	readMode?: boolean;
}) => {
	const MINUTES_INTERVAL = 15;

	const interpretDuration = (duration: number) => {
		const hours = Math.floor(duration / 60);
		// minutes in 15 minute intervals
		const minutes = (duration % 60) / MINUTES_INTERVAL;
		return { hours, minutes };
	};
	const [hours, setHours] = useState(interpretDuration(duration).hours || 0);
	const [minutes, setMinutes] = useState(
		interpretDuration(duration).minutes || 0,
	);
	const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newHours = parseInt(e.target.value);
		setHours(newHours);
		updateDuration(newHours, minutes);
	};

	const handleMinutesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newMinutes = parseInt(e.target.value);
		setMinutes(newMinutes);
		updateDuration(hours, newMinutes);
	};

	const updateDuration = (newHours: number, newMinutes: number) => {
		const hoursInMinutes = newHours * 60;
		const totalMinutes = hoursInMinutes + newMinutes * MINUTES_INTERVAL;

		durationEvent(totalMinutes);
	};

	return (
		<div className="flex flex-col w-full max-w-full">
			<div className="hours">
				<input
					type="number"
					className="p-1"
					min="0"
					max="24"
					value={hours}
					disabled={readMode}
					onChange={handleHoursChange}
				/>
				<span>H</span>
			</div>
			<select
				value={minutes}
				onChange={handleMinutesChange}
				disabled={readMode}
			>
				{Array.from({ length: 60 / MINUTES_INTERVAL }, (_, index) => (
					<option
						key={index}
						value={index}
					>
						{index * 15} minutes
					</option>
				))}
			</select>
		</div>
	);
};

export const AddProjectActivity = ({ project_id }: { project_id: string }) => {
	const [showModal, setShowModal] = useState(false);

	const openModal = () => {
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
	};

	return (
		<>
			<button
				className="add-activity-ts"
				onClick={() => setShowModal(!showModal)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-4 h-4 stroke-white"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 4.5v15m7.5-7.5h-15"
					/>
				</svg>
			</button>
			{showModal ? (
				<ProjectActivityModal
					project_id={project_id}
					closeModal={closeModal}
					readMode={false}
				/>
			) : null}
		</>
	);
};
