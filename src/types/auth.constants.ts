// password for now is min 6 characters (letters and digits)
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
export const PASSWORD_MESSAGE =
	'Password must be at least 6 characters long and contain at least one letter and one digit.';
