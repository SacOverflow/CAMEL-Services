// components/OptionList.js
'use client';
import React from 'react';

const OptionList = ({ action }: { action: any }) => {
	const options = [{ question: 'Give me a business summary' }];

	return (
		<div className="options-container scrollable">
			{options.map((option, index) => (
				<button
					key={index}
					onClick={() => {
						action(option.question);
					}}
					className="option-button"
				>
					{option.question}
				</button>
			))}
		</div>
	);
};

export default OptionList;
