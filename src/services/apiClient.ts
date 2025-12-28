import { Platform } from 'react-native';

/**
 * API client for communicating with the ProWorker backend
 */

// 10.0.2.2 is the special IP to reach the host machine from Android emulator
const DEFAULT_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
const PRODUCTION_API_URL = 'https://proworker.onrender.com/api/v1';

// Use production API for worker login, local for chat
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

/**
 * Login request interface
 */
export interface LoginRequest {
  phone_no: string;
  password: string;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  token: string;
  profileCompleted: boolean;
}

/**
 * Login to the ProWorker API
 * @param phone_no - The worker's phone number
 * @param password - The worker's password
 * @returns The authentication token and profile completion status
 */
export const loginWorker = async (
  phone_no: string,
  password: string
): Promise<LoginResponse> => {
  try {
    console.log(`Logging in to ${PRODUCTION_API_URL}/worker/login`);
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_no,
          password,
        }),
      },
      REQUEST_TIMEOUT
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as ApiErrorResponse;
      throw new Error(errorData.error || `Login failed: ${response.status}`);
    }

    const data = await response.json() as LoginResponse;

    if (!data.token) {
      throw new Error('Invalid response: No token received');
    }

    return data;
  } catch (error: any) {
    console.error('Login API Error:', error);
    
    // Provide user-friendly error messages
    if (error.message?.includes('Network request failed')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    if (error.message?.includes('timeout')) {
      throw new Error('Server is taking too long to respond. Please try again.');
    }
    
    throw error;
  }
};

/**
 * Sign up a new worker to the ProWorker API
 * @param phone_no - The worker's phone number
 * @param password - The worker's password
 * @returns The authentication token and profile completion status
 */
export const signupWorker = async (
  phone_no: string,
  password: string
): Promise<LoginResponse> => {
  try {
    console.log(`Signing up to ${PRODUCTION_API_URL}/worker/signup`);
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_no,
          password,
        }),
      },
      REQUEST_TIMEOUT
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as ApiErrorResponse;
      throw new Error(errorData.error || `Signup failed: ${response.status}`);
    }

    const data = await response.json() as LoginResponse;

    if (!data.token) {
      throw new Error('Invalid response: No token received');
    }

    return data;
  } catch (error: any) {
    console.error('Signup API Error:', error);
    
    // Provide user-friendly error messages
    if (error.message?.includes('Network request failed')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    if (error.message?.includes('timeout')) {
      throw new Error('Server is taking too long to respond. Please try again.');
    }
    
    throw error;
  }
};

/**
 * Worker profile request interface
 */
export interface WorkerProfileRequest {
  username: string;
  ImgURL?: string;
  Email: string;
  Age: number;
  gender: string;
  profession: string;
  Description: string;
  Distance_charges: number;
  Charges_PerVisit: number;
}

/**
 * Worker profile response interface
 */
export interface WorkerProfileResponse {
  id: number;
  userId: number;
  username: string;
  ImgURL: string;
  Rating: string;
  profession: string;
  Description: string;
  Charges_PerVisit: number;
  Distance_charges: number;
  ReferCode: string | null;
  ReferenceId: string | null;
  Active_Status: boolean;
  createdAt: string;
  updatedAt: string;
  Age: number;
  Email: string;
  gender: string;
}

/**
 * Create or update worker profile
 * @param token - The authentication token
 * @param profileData - The worker profile data
 * @returns The created/updated worker profile
 */
export const createWorkerProfile = async (
  token: string,
  profileData: WorkerProfileRequest
): Promise<WorkerProfileResponse> => {
  try {
    console.log(`Creating worker profile at ${PRODUCTION_API_URL}/worker/workerProfile`);
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/workerProfile`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      },
      REQUEST_TIMEOUT
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as ApiErrorResponse;
      throw new Error(errorData.error || `Profile creation failed: ${response.status}`);
    }

    const data = await response.json() as WorkerProfileResponse;

    return data;
  } catch (error: any) {
    console.error('Worker Profile API Error:', error);
    
    // Provide user-friendly error messages
    if (error.message?.includes('Network request failed')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    if (error.message?.includes('timeout')) {
      throw new Error('Server is taking too long to respond. Please try again.');
    }
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      throw new Error('Session expired. Please login again.');
    }
    
    throw error;
  }
};

/**
 * Language response interface
 */
export interface LanguageResponse {
  AppLanguage: string;
}

/**
 * Get user's app language preference
 * @param token - The authentication token
 * @returns The user's current language setting
 */
export const getUserLanguage = async (token: string): Promise<LanguageResponse> => {
  try {
    console.log(`Fetching user language from ${PRODUCTION_API_URL}/worker/settings/me/language`);
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/settings/me/language`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      },
      REQUEST_TIMEOUT
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as ApiErrorResponse;
      throw new Error(errorData.error || `Failed to fetch language: ${response.status}`);
    }

    const data = await response.json() as LanguageResponse;
    return data;
  } catch (error: any) {
    console.error('Get Language API Error:', error);
    
    if (error.message?.includes('Network request failed')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    if (error.message?.includes('timeout')) {
      throw new Error('Server is taking too long to respond. Please try again.');
    }
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      throw new Error('Session expired. Please login again.');
    }
    
    throw error;
  }
};

/**
 * Update user's app language preference
 * @param token - The authentication token
 * @param language - The language to set (e.g., "English", "Hindi")
 * @returns The updated language setting
 */
export const updateUserLanguage = async (
  token: string,
  language: string
): Promise<LanguageResponse> => {
  try {
    console.log(`Updating user language to ${language} at ${PRODUCTION_API_URL}/worker/settings/me/language`);
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/settings/me/language`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          App_Language: language,
        }),
      },
      REQUEST_TIMEOUT
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as ApiErrorResponse;
      throw new Error(errorData.error || `Failed to update language: ${response.status}`);
    }

    const data = await response.json() as LanguageResponse;
    return data;
  } catch (error: any) {
    console.error('Update Language API Error:', error);
    
    if (error.message?.includes('Network request failed')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    if (error.message?.includes('timeout')) {
      throw new Error('Server is taking too long to respond. Please try again.');
    }
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      throw new Error('Session expired. Please login again.');
    }
    
    throw error;
  }
};

/**
 * Referral code response interface
 */
export interface ReferralCodeResponse {
  ReferCode: number;
}

/**
 * Get user's referral code
 * @param token - The authentication token
 * @returns The user's referral code
 */
export const getReferralCode = async (token: string): Promise<ReferralCodeResponse> => {
  try {
    console.log(`Fetching referral code from ${PRODUCTION_API_URL}/worker/settings/me/invite`);
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/settings/me/invite`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      },
      REQUEST_TIMEOUT
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as ApiErrorResponse;
      throw new Error(errorData.error || `Failed to fetch referral code: ${response.status}`);
    }

    const data = await response.json() as ReferralCodeResponse;
    return data;
  } catch (error: any) {
    console.error('Get Referral Code API Error:', error);
    
    if (error.message?.includes('Network request failed')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    if (error.message?.includes('timeout')) {
      throw new Error('Server is taking too long to respond. Please try again.');
    }
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      throw new Error('Session expired. Please login again.');
    }
    
    throw error;
  }
};

/**
 * Worker image interface
 */
export interface WorkerImage {
  id: number;
  name: string;
  img_URL: string;
}

/**
 * Worker video interface
 */
export interface WorkerVideo {
  id: number;
  Name: string;
  Video_URL: string;
}

/**
 * Review image interface
 */
export interface ReviewImage {
  id: number;
  name: string;
  img_URL: string;
}

/**
 * Review video interface
 */
export interface ReviewVideo {
  id: number;
  name: string;
  video_URL: string;
}

/**
 * Review interface
 */
export interface Review {
  images: ReviewImage[];
  videos: ReviewVideo[];
}

/**
 * User profile response interface
 */
export interface UserProfileResponse {
  id: number;
  username: string;
  ImgURL: string;
  Rating: string;
  Email?: string;
  Age?: number;
  gender?: string;
  profession?: string;
  Description: string;
  Charges_PerVisit: number;
  Distance_charges?: number;
  worker_image: WorkerImage[];
  Worker_video: WorkerVideo[];
  review: Review[];
}

/**
 * Get user's profile data
 * @param token - The authentication token
 * @returns The user's complete profile information
 */
export const getUserProfile = async (token: string): Promise<UserProfileResponse> => {
  try {
    console.log(`Fetching user profile from ${PRODUCTION_API_URL}/worker/Profile/me`);
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/Profile/me`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      },
      REQUEST_TIMEOUT
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as ApiErrorResponse;
      throw new Error(errorData.error || `Failed to fetch profile: ${response.status}`);
    }

    const data = await response.json() as UserProfileResponse;
    return data;
  } catch (error: any) {
    console.error('Get User Profile API Error:', error);
    
    if (error.message?.includes('Network request failed')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    if (error.message?.includes('timeout')) {
      throw new Error('Server is taking too long to respond. Please try again.');
    }
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      throw new Error('Session expired. Please login again.');
    }
    
    throw error;
  }
};

/**
 * Update profile request interface (all fields optional for partial updates)
 */
export interface UpdateProfileRequest {
  Name?: string;
  ImgURL?: string;
  Email?: string;
  Age?: number;
  gender?: string;
  profession?: string;
  Description?: string;
  Distance_charges?: number;
  Charges_PerVisit?: number;
}

/**
 * Update profile response interface
 */
export interface UpdateProfileResponse {
  username: string;
  ImgURL: string;
  Email: string;
  Age: number;
  gender: string;
  profession: string;
  Rating: string;
  Description: string;
  Distance_charges: number;
  Charges_PerVisit: number;
}

/**
 * Update user's profile data
 * @param token - The authentication token
 * @param profileData - The profile data to update (partial updates supported)
 * @returns The updated profile information
 */
export const updateUserProfile = async (
  token: string,
  profileData: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  try {
    console.log(`Updating user profile at ${PRODUCTION_API_URL}/worker/Profile/me`);
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/Profile/me`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      },
      REQUEST_TIMEOUT
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as ApiErrorResponse;
      throw new Error(errorData.error || `Failed to update profile: ${response.status}`);
    }

    const data = await response.json() as UpdateProfileResponse;
    return data;
  } catch (error: any) {
    console.error('Update User Profile API Error:', error);
    
    if (error.message?.includes('Network request failed')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    if (error.message?.includes('timeout')) {
      throw new Error('Server is taking too long to respond. Please try again.');
    }
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      throw new Error('Session expired. Please login again.');
    }
    
    throw error;
  }
};







