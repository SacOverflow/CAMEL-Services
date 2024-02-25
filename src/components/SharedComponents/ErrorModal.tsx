import React from 'react';
import '@/components/SharedComponents/ErrorMessage.css';

const ErrorMessage = ({
	title,
	message,
	imageUrl,
}: {
	title: string;
	message: string;
	imageUrl: string;
}) => {
	return (
		<div className="modal-backdrop">
			<div className="error-container">
				<h2 className="error-title">{title}</h2>
				<img
					src={imageUrl}
					alt="Error"
					className="error-image"
				/>
				<p className="error-message">{message}</p>
			</div>
		</div>
	);
};

export default ErrorMessage;
