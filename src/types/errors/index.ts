import { BadRequestError } from './BadRequestError';
import { NotFoundError } from './NotFoundError';
import { ValidationError } from './ValidationError';
import { AuthenticationError } from './AuthenticationError';

export { BadRequestError } from './BadRequestError';
export { NotFoundError } from './NotFoundError';
export { ValidationError } from './ValidationError';
export { AuthenticationError } from './AuthenticationError';

export const isApplicationError = (error: Error): boolean => {
  return error instanceof BadRequestError ||
         error instanceof NotFoundError ||
         error instanceof ValidationError ||
         error instanceof AuthenticationError;
}; 