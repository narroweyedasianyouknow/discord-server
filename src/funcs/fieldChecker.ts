import type { Response } from 'express';
import errorCodes from 'src/errorCodes';

const missingArgs = errorCodes['A-02'];
const invalidArgs = errorCodes['A-03'];

export const fieldsChecker = (
  object: any,
  expected: Record<string, 'number' | 'string' | 'boolean'>,
  res: Response,
): boolean => {
  let isOk = true;
  for (const index in expected) {
    if (!(index in object)) {
      res.status(400).send(missingArgs(index));
      isOk = false;
      break;
    } else if (typeof object[index] !== expected[index]) {
      res.status(400).send(invalidArgs(index));
      isOk = false;
      break;
    }
  }
  return isOk;
};
