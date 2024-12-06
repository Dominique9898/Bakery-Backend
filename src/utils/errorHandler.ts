import { Response } from 'express';
import { 
  BadRequestError, 
  NotFoundError, 
  ValidationError,
  AuthenticationError,
  isApplicationError 
} from '../types/errors';
import { ResponseHandler } from './responseHandler';
import LOG from '../config/Logger';

export class ErrorHandler {
  static handle(res: Response, error: any): void {
    LOG.error(`Error occurred: ${error}`);

    if (isApplicationError(error)) {
      if (error instanceof BadRequestError) {
        ResponseHandler.badRequest(res, error.message);
      } else if (error instanceof NotFoundError) {
        ResponseHandler.notFound(res, error.message);
      } else if (error instanceof ValidationError) {
        ResponseHandler.error(res, error, error.message, 422);
      } else if (error instanceof AuthenticationError) {
        ResponseHandler.unauthorized(res, error.message);
      }
    } else {
      // 处理未知错误
      ResponseHandler.error(res, error, '服务器内部错误', 500);
    }
  }

  static handleAsync(fn: Function) {
    return async (req: any, res: any, next: any) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        ErrorHandler.handle(res, error);
      }
    };
  }
} 