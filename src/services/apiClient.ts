import { Platform } from 'react-native';

/**
 * API client for communicating with the ProWorker backend
 */

// 10.0.2.2 is the special IP to reach the host machine from Android emulator
const DEFAULT_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
const API_BASE_URL = DEFAULT_URL; 

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 10000; // 10 seconds

export interface ChatResponse {
  success: boolean;
  response: string;
  timestamp: string;
  error?: string;
}

export interface ApiErrorResponse {
  error?: string;
}

/**
 * Fetch with timeout
 */
const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal as any, // Type assertion for React Native compatibility
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server is not responding');
    }
    throw error;
  }
};

/**
 * Send a chat message to the backend API
 * @param userQuestion - The user's question
 * @param workerContext - The worker's data context
 * @returns The AI response
 */
export const sendChatMessage = async (
  userQuestion: string,
  workerContext: any
): Promise<string> => {
  try {
    console.log(`Sending message to ${API_BASE_URL}/api/chat`);
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userQuestion,
          workerContext,
        }),
      },
      REQUEST_TIMEOUT
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as ApiErrorResponse;
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json() as ChatResponse;

    if (!data.success) {
      throw new Error(data.error || 'Failed to get response');
    }

    return data.response;
  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    // Provide user-friendly error messages
    if (error.message?.includes('Network request failed')) {
      throw new Error('Cannot connect to server. Please check if the server is running.');
    }
    if (error.message?.includes('timeout')) {
      throw new Error('Server is taking too long to respond. Please try again.');
    }
    
    throw error;
  }
};

/**
 * Check if the API is running
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/health`,
      {
        method: 'GET',
      },
      5000 // 5 second timeout for health check
    );
    return response.ok;
  } catch (err) {
    console.warn('API Health Check Failed:', err);
    return false;
  }
};
