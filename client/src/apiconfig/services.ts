import { FormData } from '~/utils/types';

// Define a reusable base URL

const isEmu = true;

const BASE_URL = isEmu ? 'http://10.0.2.2:8080' : 'http://192.168.0.104:8080';

const fetchApi = async (endpoint: string, options: RequestInit) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      throw new Error(errorData.message || 'Unknown error');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch API Error:', error);
    throw error;
  }
};

export const loginApi = async (credentials: FormData) => {
  return fetchApi('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
};

export const checkTimer = async (user_id: number) => {
  return fetchApi('/checktimer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id }),
  });
};

export const startTimer = async (user_id: number) => {
  return fetchApi('/starttimer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id }),
  });
};

export const stopTimer = async (user_id: number) => {
  return fetchApi('/stoptimer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id }),
  });
};
