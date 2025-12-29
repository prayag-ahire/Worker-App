# Error Screen Usage Guide

This guide explains how to use the ErrorScreen component when API calls fail in your Worker App.

## Overview

The ErrorScreen displays a friendly error illustration when:
- API calls fail
- Backend server is down
- Network connection issues occur
- Any other error that should show a full-screen error instead of a toast notification

## Features

- **Beautiful Error Illustration**: Shows the `Erro_img.jpg` image with a worker holding disconnected plugs
- **Multilingual Support**: Error messages in both English and Hindi
- **Smart Navigation**: Automatically returns to the previous screen when user taps "Go Back"
- **Retry Functionality**: Optional retry button to attempt the operation again
- **Custom Error Messages**: Display specific error messages for different scenarios

## How to Use

### 1. In App.tsx (Already Integrated)

The ErrorScreen is already integrated into your navigation system. You can trigger it using the `handleShowError` function:

```typescript
// Show error from any screen
handleShowError('userProfile', 'Custom error message here');

// Or use default error message
handleShowError('settings');
```

### 2. In Your Screen Components

When making API calls in your screens, catch errors and navigate to the error screen instead of showing toasts:

#### Example: UserProfileScreen.tsx

```typescript
import { useState, useEffect } from 'react';

const UserProfileScreen = ({ onBack, onShowError }) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await fetch('YOUR_API_URL/profile');
      
      if (!response.ok) {
        // Show error screen instead of toast
        onShowError('userProfile', 'Failed to load profile. Please try again.');
        return;
      }

      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      // Network error or server down
      onShowError('userProfile', 'Unable to connect to server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

### 3. Updating App.tsx to Pass Error Handler

You need to pass the `handleShowError` function to screens that make API calls:

```typescript
{currentScreen === 'userProfile' && (
  <UserProfileScreen
    onBack={handleUserProfileBack}
    onEdit={handleUserProfileEdit}
    onShowError={handleShowError}  // Add this
    shouldRefresh={shouldRefreshProfile}
  />
)}
```

### 4. Common Error Scenarios

#### Scenario 1: Profile Loading Failed
```typescript
// In UserProfileScreen.tsx
try {
  const response = await apiClient.getProfile();
  setProfile(response.data);
} catch (error) {
  onShowError('userProfile', 'Failed to load profile data.');
}
```

#### Scenario 2: Order History Failed
```typescript
// In OrderHistoryScreen.tsx
try {
  const orders = await apiClient.getOrders();
  setOrders(orders);
} catch (error) {
  onShowError('orderHistory', 'Unable to fetch your orders. Please try again later.');
}
```

#### Scenario 3: Settings Update Failed
```typescript
// In SettingsScreen.tsx
try {
  await apiClient.updateSettings(newSettings);
  Toast.show({ type: 'success', text1: 'Settings updated!' });
} catch (error) {
  onShowError('settings', 'Failed to update settings. Please try again.');
}
```

## Navigation Flow Example

```
User in Settings → Clicks User Profile → API Call Fails
                                           ↓
                                    Error Screen Displays
                                           ↓
                              User Clicks "Go Back"
                                           ↓
                                  Returns to Settings
```

## Customization

### Custom Error Messages

You can provide custom error messages for different scenarios:

```typescript
// Network error
onShowError('home', 'No internet connection. Please check your network settings.');

// Server error
onShowError('orderHistory', 'Server is temporarily unavailable. Please try again in a few minutes.');

// Authentication error
onShowError('login', 'Your session has expired. Please login again.');

// Data not found
onShowError('orderDetails', 'Order not found. It may have been deleted.');
```

### Using Default Message

If you don't provide a custom message, the default message will be used:

**English**: "We're having trouble connecting to the server. Please check your internet connection and try again."

**Hindi**: "हमें सर्वर से कनेक्ट करने में समस्या हो रही है। कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।"

## Best Practices

1. **Use Error Screen for Critical Failures**: Use the error screen when the user cannot continue without the data (e.g., profile loading, order details).

2. **Use Toasts for Minor Errors**: Use toast notifications for non-critical errors (e.g., failed to copy referral code, failed to share).

3. **Provide Specific Messages**: Give users clear information about what went wrong and what they can do.

4. **Always Provide Go Back**: The error screen should always have a way to go back to the previous screen.

5. **Optional Retry**: Only show retry button if retrying makes sense (e.g., network errors, not validation errors).

## Implementation Checklist

- [x] ErrorScreen component created
- [x] Translations added (English & Hindi)
- [x] Error screen integrated into App.tsx navigation
- [x] Back navigation configured
- [ ] Update screens to use error screen instead of toasts for critical errors
- [ ] Pass `onShowError` handler to screens that need it
- [ ] Test error screen navigation from different screens

## Example: Complete Integration

Here's a complete example of integrating error handling in a screen:

```typescript
// PersonalDetailsScreen.tsx
interface PersonalDetailsScreenProps {
  onComplete: () => void;
  onShowError: (fromScreen: Screen, message?: string) => void;
  referralCode: string;
}

const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({
  onComplete,
  onShowError,
  referralCode,
}) => {
  const handleCreateProfile = async () => {
    try {
      setLoading(true);
      
      const response = await apiClient.createProfile({
        name,
        age,
        email,
        phone,
        gender,
        referralCode,
      });

      if (response.success) {
        onComplete();
      } else {
        onShowError('personalDetails', response.message || 'Failed to create profile.');
      }
    } catch (error) {
      onShowError('personalDetails', 'Unable to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

## Testing

To test the error screen:

1. Navigate to Settings → User Profile
2. Simulate an API failure (disconnect network or use invalid API endpoint)
3. Verify error screen appears
4. Tap "Go Back" and verify you return to Settings
5. Test with different screens to ensure navigation works correctly

## Troubleshooting

**Error screen doesn't appear**: Make sure you're calling `onShowError` with the correct screen name.

**Back navigation goes to wrong screen**: Verify the `fromScreen` parameter matches the current screen name.

**Custom message not showing**: Check that you're passing the message as the second parameter to `onShowError`.
