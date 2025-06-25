import {
  IsNotEmpty,
  IsEmail,
  Matches,
  MinLength,
  IsString,
} from 'class-validator';
import {
  emailValidationRegExp,
  passwordValidationRegExp,
  ValidationEmailErrMsg,
  ValidationPasswordErrMsg,
} from '../auth-constants/auth.constants';

export class SignUpDto {
  @IsNotEmpty({ message: ValidationEmailErrMsg.EMPTY_EMAIL })
  @IsEmail({}, { message: ValidationEmailErrMsg.NOT_VALID_EMAIL })
  @Matches(emailValidationRegExp, {
    message: ValidationEmailErrMsg.NOT_CORRECT_EMAIL_FORMAT,
  })
  email: string;

  @IsString({ message: ValidationPasswordErrMsg.PASSWORD_IS_NOT_STRING })
  @IsNotEmpty({ message: ValidationPasswordErrMsg.EMPTY_PASSWORD })
  @MinLength(8, { message: ValidationPasswordErrMsg.PASSWORD_MIN_LENGTH })
  @Matches(passwordValidationRegExp.upperCaseLetter, {
    message: ValidationPasswordErrMsg.NO_UPPERCASE_LETTER,
  })
  @Matches(passwordValidationRegExp.lowerCaseLetter, {
    message: ValidationPasswordErrMsg.NO_LOWERCASE_LETTER,
  })
  @Matches(passwordValidationRegExp.number, {
    message: ValidationPasswordErrMsg.NO_NUMBER,
  })
  @Matches(passwordValidationRegExp.specialCharacter, {
    message: ValidationPasswordErrMsg.NO_SPECIAL_CHARACTERS,
  })
  password: string;
}
