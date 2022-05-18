import { HttpStatus } from '@nestjs/common';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { ErrorDto, ErrorListDto } from './DTO/errorList.dto';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500;
    let errorList: ErrorListDto[];

    if (error instanceof HttpException) {
      // We manage the case where we are in an HttpException
      const errorResponse = error.getResponse();
      if (typeof errorResponse === 'object') {
        try {
          errorList = (errorResponse as any).message.map((msg) => {
            return {
              message: msg,
              name: error.name,
            };
          });
        } catch {
          errorList = [
            {
              message: error.message,
              name: error.name,
            },
          ];
        }
      } else {
        errorList = [
          {
            message: errorResponse,
            name: error.name,
          },
        ];
      }

      status = error.getStatus();
    } else if (error instanceof QueryFailedError) {
      if (error.driverError.code === 'ER_DUP_ENTRY') {
        status = 409;
        errorList = [
          {
            name: 'Unique violation',
            message:
              (<string>error.driverError.sqlMessage)
                .match(/(?<=for key \').*?(?=\')/)[0]
                .split('.')[1] + ' already exists',
            stack: {
              status: 'CONFLICT',
              origin: 'DB',
              value: error.driverError.sqlMessage,
            },
          },
        ];
      } else if (error.driverError.code === 'ER_NO_REFERENCED_ROW_2') {
        status = 404;
        errorList = [
          {
            name: 'NotFound',
            message:
              (<string>error.driverError.sqlMessage).match(
                /(?<=FOREIGN KEY \(\`).*?(?=\`\) REFERENCES)/,
              )[0] + ' not found',
            stack: {
              status: 'NOT_FOUND',
              origin: 'DB',
              value: error.driverError.sqlMessage,
            },
          },
        ];
      } else {
        status = 500;
        errorList = [
          {
            name: 'DB Error',
            message: 'Internal error during database query',
            stack: {
              status: 'DB_Error',
              origin: 'DB',
              value: error.driverError.sqlMessage,
            },
          },
        ];
      }
      // else if (error.driverError.code === 'ER_BAD_FIELD_ERROR') {
      //   status = 409;
      //   errorList = [
      //     {
      //       name: 'Bad field error',
      //       message: error.driverError.sqlMessage,
      //       stack: {
      //         status: 'CONFLICT',
      //         origin: 'DB',
      //         value: error.parameters[0],
      //       },
      //     },
      //   ];
      // }
    } else if (error instanceof TypeORMError) {
      status = 400;
      errorList = [
        {
          name: 'Bad Request',
          message: error.message,
          stack: error.stack,
        },
      ];
    } else {
      // We manage the case where we are not in an HttpException
      errorList = [
        {
          name: 'InternalServerError',
          message: 'Something went wrong.',
          stack: `${error.message} ${error.stack}`,
        },
      ];
      status = 500;
    }

    const newError = new ErrorDto();

    newError.statusCode = status;
    newError.status = HttpStatus[status];

    if (process.env.NODE_ENV && process.env.NODE_ENV != 'development') {
      errorList = errorList.map((err) => {
        delete err.stack;
        return err;
      });
    }
    newError.error = errorList;

    response.status(status).json(newError);
  }
}
