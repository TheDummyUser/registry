export const loginApi = async (credentials) => {
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
