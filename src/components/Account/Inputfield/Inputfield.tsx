'use client';

import React from 'react';
import { useState, useEffect } from 'react';
// import { createSupbaseClient } from '@/lib/supabase/client';

interface AccountInputFieldProps {
	label: string;
	placeholder: string;
	type: 'text' | 'email' | 'password';
	value: any;
	setValue: (value: any) => void;
}

// const supabase = await createSupbaseClient();

const InputField = ({
	label,
	placeholder,
	type,
	value: valTmp,
	setValue: setVal,
}: AccountInputFieldProps) => {
	const [value, setValue] = useState(valTmp);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
		setVal(e.target.value);
	};

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
