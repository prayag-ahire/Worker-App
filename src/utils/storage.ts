import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage utility for managing auth tokens and user data
 */

const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  PROFILE_COMPLETED: '@profile_completed',
};

/**
 * Save auth token to storage
 */
export const saveAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error saving auth token:', error);
    throw error;
  }
};

/**
 * Get auth token from storage
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Remove auth token from storage
 */
export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error removing auth token:', error);
    throw error;
  }
};

/**
 * Save profile completion status
 */
export const saveProfileCompleted = async (completed: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_COMPLETED, JSON.stringify(completed));
  } catch (error) {
    console.error('Error saving profile completed status:', error);
    throw error;
  }
};

/**
 * Get profile completion status
 */
export const getProfileCompleted = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE_COMPLETED);
    return value ? JSON.parse(value) : false;
  } catch (error) {
    console.error('Error getting profile completed status:', error);
    return false;
  }
};

/**
 * Save user profile data to cache
 */
export const saveUserProfile = async (profileData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(profileData));
    console.log('User profile cached successfully');
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

/**
 * Get cached user profile data
 */
export const getUserProfile = async (): Promise<any | null> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Clear all auth data
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.PROFILE_COMPLETED,
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};
