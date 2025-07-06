import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const statusCode = status;
    const path = request.url;
    let message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal HIO projects-microcervice server error (from Global Exception Filter)';

    if (Array.isArray(exception?.response?.message)) {
      message =
        exception.message + ', ' + exception.response.message.join(', ');
    }

    const logMessage = {
      statusCode,
      message,
      path,
      timestamp: new Date().toISOString(),
      method: request.method,
      body: request.body,
      query: request.query,
      params: request.params,
      stack: exception.stack,
    };

    if (process.env.NODE_ENV != 'test') {
      console.error(logMessage);
    }

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path,
      message,
    });
  }

  private anonimyzeReqBody(body: object): object {
    const requestBody = JSON.stringify(body).replace(
      /"password":"[^"]*"/,
      '"password":"password"',
    );

    return JSON.parse(requestBody);
  }
}
