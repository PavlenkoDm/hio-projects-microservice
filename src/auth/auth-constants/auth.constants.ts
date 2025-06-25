export const emailValidationRegExp =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export const passwordValidationRegExp = {
  upperCaseLetter: /[A-Z]/,
  lowerCaseLetter: /[a-z]/,
  number: /\d/,
  specialCharacter: /[\W_]/,
};

export enum ValidationEmailErrMsg {
  EMPTY_EMAIL = 'Email could not be empty',
  NOT_VALID_EMAIL = 'Not valid email',
  NOT_CORRECT_EMAIL_FORMAT = 'The email must follow the format example@domain.com',
}

export enum ValidationPasswordErrMsg {
  PASSWORD_IS_NOT_STRING = 'Password must be a string',
  EMPTY_PASSWORD = 'Password could not be empty',
  PASSWORD_MIN_LENGTH = 'Password must contain 8 characters',
  NO_UPPERCASE_LETTER = 'Password must contain at least one uppercase letter',
  NO_LOWERCASE_LETTER = 'Password must contain at least one lowercase letter',
  NO_NUMBER = 'Password must contain at least one number',
  NO_SPECIAL_CHARACTERS = 'Password must contain at least one special character (example: !@#$%^&*)',
}
