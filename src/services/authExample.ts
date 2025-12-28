/**
 * Example: How to use the auth token in API calls
 * 
 * After successful login, the auth token is stored in AsyncStorage.
 * You can retrieve it and use it in subsequent API calls.
 */

import { getAuthToken } from '../utils/storage';

/**
 * Example: Making an authenticated API request
 */
export const exampleAuthenticatedRequest = async () => {
  try {
    // Get the stored auth token
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No auth token found. Please login first.');
    }

    // Make API request with Authorization header
    const response = await fetch('https://proworker.onrender.com/api/v1/worker/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Example: Making a POST request with auth token
 */
export const exampleAuthenticatedPost = async (requestBody: any) => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No auth token found. Please login first.');
    }

    const response = await fetch('https://proworker.onrender.com/api/v1/worker/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
