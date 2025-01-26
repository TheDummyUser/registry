import { FormData } from '~/utils/types';

export const loginApi = async (credentials: FormData) => {
  const response = await fetch('http://10.0.2.2:8080/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Invalid username or password');
  }

  return response.json();
};

export const checkTimer = async (user_id: number) => {
  const response = await fetch('http://10.0.2.2:8080/checktimer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id }),
  });
  if (!response.ok) {
    throw new Error('No active timer found for this user');
  }
  return response.json();
};

export const startTimer = async (user_id: number) => {
  const response = await fetch('http://10.0.2.2:8080/starttimer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id }),
  });
  if (!response.ok) {
    throw new Error('timer already running bruh');
  }
  return response.json();
};

export const stopTimer = async (user_id: number) => {
  const response = await fetch('http://10.0.2.2:8080/stoptimer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id }),
  });
  if (!response.ok) {
    throw new Error('No active timer found for this user');
  }
  return response.json();
};
