export const validationRules = {
  username: {
    required: 'Username is required',
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      message: 'Please enter a valid email',
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
