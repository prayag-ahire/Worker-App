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
 * Handle common API error patterns
 */
const handleApiResponse = async (response: Response, errorMessage: string) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})) as ApiErrorResponse;
    if (response.status === 401) {
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(errorData.error || `${errorMessage}: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
};

/**
 * Handle common catch error patterns
 */
const handleApiError = (error: any, apiName: string) => {
  console.error(`${apiName} Error:`, error);
  
  if (error.message?.includes('Network request failed')) {
    throw new Error('Cannot connect to server. Please check your internet connection.');
  }
  if (error.message?.includes('timeout')) {
    throw new Error('Server is taking too long to respond. Please try again.');
  }
  
  throw error;
};

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

    const data = await handleApiResponse(response, 'Chat failed');

    if (!data.success) {
      throw new Error(data.error || 'Failed to get response');
    }

    return data.response;
  } catch (error: any) {
    return handleApiError(error, 'Chat API');
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

    const data = await handleApiResponse(response, 'Login failed') as LoginResponse;

    if (!data.token) {
      throw new Error('Invalid response: No token received');
    }

    return data;
  } catch (error: any) {
    return handleApiError(error, 'Login API');
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

    const data = await handleApiResponse(response, 'Signup failed') as LoginResponse;

    if (!data.token) {
      throw new Error('Invalid response: No token received');
    }

    return data;
  } catch (error: any) {
    return handleApiError(error, 'Signup API');
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

    return await handleApiResponse(response, 'Profile creation failed') as WorkerProfileResponse;
  } catch (error: any) {
    return handleApiError(error, 'Worker Profile API');
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

    return await handleApiResponse(response, 'Failed to fetch language') as LanguageResponse;
  } catch (error: any) {
    return handleApiError(error, 'Get Language API');
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

    return await handleApiResponse(response, 'Failed to update language') as LanguageResponse;
  } catch (error: any) {
    return handleApiError(error, 'Update Language API');
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

    return await handleApiResponse(response, 'Failed to fetch profile') as UserProfileResponse;
  } catch (error: any) {
    return handleApiError(error, 'Get User Profile API');
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

    return await handleApiResponse(response, 'Failed to update profile') as UpdateProfileResponse;
  } catch (error: any) {
    return handleApiError(error, 'Update User Profile API');
  }
};

/**
 * Location response interface
 */
export interface LocationResponse {
  id: number;
  latitude: number;
  longitude: number;
  workerSettingsId: number;
}

/**
 * Location update request interface
 */
export interface LocationUpdateRequest {
  latitude: number;
  longitude: number;
}

/**
 * Get user's home location
 * @param token - The authentication token
 * @returns The user's saved home location
 */
export const getUserLocation = async (token: string): Promise<LocationResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/settings/me/location`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      },
      REQUEST_TIMEOUT
    );

    return await handleApiResponse(response, 'Failed to fetch location') as LocationResponse;
  } catch (error: any) {
    return handleApiError(error, 'Get User Location API');
  }
};

/**
 * Update user's home location
 * @param token - The authentication token
 * @param locationData - The location coordinates to save
 * @returns The updated location information
 */
export const updateUserLocation = async (
  token: string,
  locationData: LocationUpdateRequest
): Promise<LocationResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/settings/me/location`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(locationData),
      },
      REQUEST_TIMEOUT
    );

    return await handleApiResponse(response, 'Failed to update location') as LocationResponse;
  } catch (error: any) {
    return handleApiError(error, 'Update User Location API');
  }
};/**
 * Weekly schedule response interface
 */
export interface WeeklyScheduleResponse {
  schedule?: {
    Start_Sunday: string | null;
    End_Sunday: string | null;
    Start_Monday: string | null;
    End_Monday: string | null;
    Start_Tuesday: string | null;
    End_Tuesday: string | null;
    Start_Wednesday: string | null;
    End_Wednesday: string | null;
    Start_Thursday: string | null;
    End_Thursday: string | null;
    Start_Friday: string | null;
    End_Friday: string | null;
    Start_Saturday: string | null;
    End_Saturday: string | null;
  };
  // In case the API returns the schedule data at the root level
  Start_Sunday?: string | null;
  End_Sunday?: string | null;
  Start_Monday?: string | null;
  End_Monday?: string | null;
  Start_Tuesday?: string | null;
  End_Tuesday?: string | null;
  Start_Wednesday?: string | null;
  End_Wednesday?: string | null;
  Start_Thursday?: string | null;
  End_Thursday?: string | null;
  Start_Friday?: string | null;
  End_Friday?: string | null;
  Start_Saturday?: string | null;
  End_Saturday?: string | null;
}

/**
 * Get worker's weekly schedule
 * @param token - The authentication token
 * @returns The worker's weekly schedule
 */
export const getWeeklySchedule = async (token: string): Promise<WeeklyScheduleResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/WorkerSchedule/weekly`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      },
      REQUEST_TIMEOUT
    );

    return await handleApiResponse(response, 'Failed to fetch schedule') as WeeklyScheduleResponse;
  } catch (error: any) {
    return handleApiError(error, 'Get Weekly Schedule API');
  }
};

/**
 * Update weekly schedule request interface
 */
export interface UpdateWeeklyScheduleRequest {
  Start_Sunday?: string;
  End_Sunday?: string;
  Start_Monday?: string;
  End_Monday?: string;
  Start_Tuesday?: string;
  End_Tuesday?: string;
  Start_Wednesday?: string;
  End_Wednesday?: string;
  Start_Thursday?: string;
  End_Thursday?: string;
  Start_Friday?: string;
  End_Friday?: string;
  Start_Saturday?: string;
  End_Saturday?: string;
}

/**
 * Update weekly schedule response interface
 */
export interface UpdateWeeklyScheduleResponse {
  message: string;
  schedule: {
    Start_Sunday: string | null;
    End_Sunday: string | null;
    Start_Monday: string | null;
    End_Monday: string | null;
    Start_Tuesday: string | null;
    End_Tuesday: string | null;
    Start_Wednesday: string | null;
    End_Wednesday: string | null;
    Start_Thursday: string | null;
    End_Thursday: string | null;
    Start_Friday: string | null;
    End_Friday: string | null;
    Start_Saturday: string | null;
    End_Saturday: string | null;
  };
}

/**
 * Update worker's weekly schedule
 * @param token - The authentication token
 * @param scheduleData - The schedule data to update (only changed days need to be included)
 * @returns The updated schedule
 */
export const updateWeeklySchedule = async (
  token: string,
  scheduleData: UpdateWeeklyScheduleRequest
): Promise<UpdateWeeklyScheduleResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/WorkerSchedule/weekly`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleData),
      },
      REQUEST_TIMEOUT
    );

    return await handleApiResponse(response, 'Failed to update schedule') as UpdateWeeklyScheduleResponse;
  } catch (error: any) {
    return handleApiError(error, 'Update Weekly Schedule API');
  }
};

/**
 * Holiday interface
 */
export interface Holiday {
  id: number;
  workerId: number;
  date: string;
  note: string;
}

/**
 * Monthly schedule response interface
 */
export interface MonthlyScheduleResponse {
  month: string;
  holidays: Holiday[];
}

/**
 * Add holiday request interface
 */
export interface AddHolidayRequest {
  date: string;
  note: string;
}

/**
 * Add holiday response interface
 */
export interface AddHolidayResponse {
  message: string;
  holiday: Holiday;
  canceledOrders: any[];
  notifications: any[];
}

/**
 * Get worker's monthly schedule (holidays)
 * @param token - The authentication token
 * @param month - The month in YYYY-MM format (e.g., "2025-12")
 * @returns The worker's holidays for the specified month
 */
export const getMonthlySchedule = async (
  token: string,
  month: string
): Promise<MonthlyScheduleResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/WorkerSchedule/month?month=${month}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      },
      REQUEST_TIMEOUT
    );

    return await handleApiResponse(response, 'Failed to fetch monthly schedule') as MonthlyScheduleResponse;
  } catch (error: any) {
    return handleApiError(error, 'Get Monthly Schedule API');
  }
};

/**
 * Add a holiday to the monthly schedule
 * @param token - The authentication token
 * @param holidayData - The holiday data (date and note)
 * @returns The added holiday and any canceled orders/notifications
 */
export const addHoliday = async (
  token: string,
  holidayData: AddHolidayRequest
): Promise<AddHolidayResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/WorkerSchedule/month`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(holidayData),
      },
      REQUEST_TIMEOUT
    );

    return await handleApiResponse(response, 'Failed to add holiday') as AddHolidayResponse;
  } catch (error: any) {
    return handleApiError(error, 'Add Holiday API');
  }
};

/**
 * Delete holiday response interface
 */
export interface DeleteHolidayResponse {
  message: string;
  deletedDate: string;
}

/**
 * Delete a holiday from the monthly schedule
 * @param token - The authentication token
 * @param date - The date to delete in YYYY-MM-DD format
 * @returns The deletion confirmation
 */
export const deleteHoliday = async (
  token: string,
  date: string
): Promise<DeleteHolidayResponse> => {
  try {
    const response = await fetchWithTimeout(
      `${PRODUCTION_API_URL}/worker/WorkerSchedule/month?date=${date}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      },
      REQUEST_TIMEOUT
    );

    return await handleApiResponse(response, 'Failed to delete holiday') as DeleteHolidayResponse;
  } catch (error: any) {
    return handleApiError(error, 'Delete Holiday API');
  }
};
