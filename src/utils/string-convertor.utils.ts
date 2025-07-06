import { HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

import { ValidationIdErrMsg } from '../auth/auth-constants/auth.constants';
import { createRpcException } from './create-rpcexception.utils';

export function convertStringToObjectId(id: string) {
  const isValidId = Types.ObjectId.isValid(id);
  if (!isValidId) {
    throw createRpcException(
      HttpStatus.BAD_REQUEST,
      ValidationIdErrMsg.NOT_CORRECT_ID,
    );
  }
  return new Types.ObjectId(id);
}
