export const PostgresError = {
  unique_violation: '23505',
  undefined_column: '42703',
};
export const MONGOOSE_ERRORS = {
  11000: (keyValue: Record<string, any>) =>
    `${Object.keys(keyValue).join(', ')} duplicated key`,
};
export default {
  'A-01': {
    err: 'Something got wrong! Please, try again!',
    code: 'A-01',
  },
  'A-02': (args = '') => {
    return {
      err: `Missing parameter: ${args}`,
      code: 'A-02',
    };
  },
  'A-03': (args = '') => {
    return {
      err: `Invalid parameter: ${args}`,
      code: 'A-02',
    };
  },

  'U-01': {
    err: 'Invalid Password',
    code: 'U-01',
  },
  'U-02': {
    err: "Password or Login doesn't correct",
    code: 'U-02',
  },
  'U-03': {
    err: 'Login is busy',
    code: 'U-03',
  },
};
