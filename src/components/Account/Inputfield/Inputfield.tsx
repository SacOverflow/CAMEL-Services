'use client';

import React from 'react';
import { useState, useEffect } from 'react';
// import { createSupbaseClient } from '@/lib/supabase/client';

interface AccountInputFieldProps {
	label: string;
	placeholder: string;
	type: 'text' | 'email' | 'password';
	// onSubmit: (value: string) => void;
}

// const supabase = await createSupbaseClient();

const InputField = ({ label, placeholder, type }: AccountInputFieldProps) => {
	const [value, setValue] = useState('');
	const [userName, setUserName] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};
	// useEffect(() => {
	// 	const handleUserUpdate = async (newUser: any) => {
	// 		try {
	// 			const { data, error } = await supabase.auth.updateUser({
	// 				username: newUsername,
	// 			});

	// 			if (error) {
	// 				throw error;
	// 			}

	// 			if (data) {
	// 				alert('Username has been updated successfully!');
	// 			}
	// 		} catch (error) {
	// 			alert(`Error updating user: ${error.message}`);
	// 		}
	// 	};
	// });

	return (
		<div className="infocolumns">
			<label
				htmlFor={label}
				className="labelsformat"
			>
				{label}
			</label>
			<input
				type={type}
				id={label}
				className="inputf"
				placeholder={placeholder}
				value={value}
				onChange={handleChange}
				required
			/>
		</div>
	);
};

export default InputField;
