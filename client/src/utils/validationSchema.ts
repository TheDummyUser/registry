export const validationRules = {
  username: {
    required: 'Username is required',
    pattern: {
      value: /^[a-zA-Z0-9]+$/,
      message: 'Username must contain only letters and numbers',
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 5,
      message: 'Password must be at least 5 characters',
    },
    maxLength: {
      value: 50,
      message: 'Password must be less than 50 characters',
    },
  },
};
