/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from 'express';
import { z, ZodError, ZodIssue } from 'zod';

// helper function
function processResponse(
  error: ZodIssue,
  obj: { command: 'returnObject' | 'returnValue' },
) {
  if (obj.command === 'returnObject') {
    return error.code === 'too_small'
      ? { min: error.minimum }
      : error.code === 'invalid_type' || error.code === 'invalid_enum_value'
        ? { received: error.received }
        : {};
  } else {
    return error.code === 'too_small'
      ? error.minimum
      : error.code === 'invalid_type' || error.code === 'invalid_enum_value'
        ? error.received
        : '';
  }
}

// generic error response function
const giveGenericErrorResponse = (receivedError: ZodError, res: Response) => {
  const formattedErrors: any['error']['errors'] = {
    message: 'Validation failed',
    success: false,
    error: {
      name: receivedError.name,
      errors: {},
    },
    stack: receivedError.stack,
  };

  // Map over each Zod error
  receivedError instanceof z.ZodError
    ? receivedError.errors.forEach((err: ZodIssue) => {
        const path = err.path[0] as string;
        formattedErrors.error.errors[path] = {
          message: err.message,
          name: 'ValidatorError',
          properties: {
            message: err.message,
            type: err.code,
            ...(processResponse(err, { command: 'returnObject' }) as Record<
              string,
              any
            >),
          },
          kind: err.code,
          path: err.path.join('.'),
          value: processResponse(err, { command: 'returnValue' }),
        };
      })
    : (formattedErrors.error.errors = receivedError);

  res.status(500).json(formattedErrors);
};

export default giveGenericErrorResponse;
