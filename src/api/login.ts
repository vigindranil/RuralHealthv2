import Cookies from 'js-cookie';

interface LoginCredentials {
  username: string;
  password: string;
}

export const login = async (credentials: LoginCredentials): Promise<string | null> => {
  try {
    const response = await fetch('http://localhost:3010/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    if (data.status === 0 && data.data?.token) {
      Cookies.set('authToken', data.data.token);
      return data.data.token;
    } else {
      throw new Error(data.message || 'Invalid response');
    }
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};
