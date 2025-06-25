import { IsNotEmpty, IsEmail, Matches } from 'class-validator';
import {
  emailValidationRegExp,
  ValidationEmailErrMsg,
} from '../auth-constants/auth.constants';

export class SignOutDto {
  @IsNotEmpty({ message: ValidationEmailErrMsg.EMPTY_EMAIL })
  @IsEmail({}, { message: ValidationEmailErrMsg.NOT_VALID_EMAIL })
  @Matches(emailValidationRegExp, {
    message: ValidationEmailErrMsg.NOT_CORRECT_EMAIL_FORMAT,
  })
  email: string;
}
