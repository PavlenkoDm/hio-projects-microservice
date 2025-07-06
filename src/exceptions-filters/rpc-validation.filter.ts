import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(BadRequestException)
export class RpcValidationFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const data = ctx.getData();
    const response = exception.getResponse();

    const message =
      typeof response === 'object' &&
      response !== null &&
      'message' in response &&
      Array.isArray(response?.message)
        ? response.message.join(', ')
        : typeof response === 'string'
          ? response
          : 'Validation Error! Hio-projects-microservice';

    console.error('Validation Error: ', response);
    console.error('Request data: ', data);

    throw new RpcException({ status: HttpStatus.BAD_REQUEST, message });
  }
}
