# Quick Start: Adding Error Screen to UserProfileScreen

This is a step-by-step guide to add error screen functionality to the UserProfileScreen as an example. You can follow the same pattern for other screens.

## Step 1: Update UserProfileScreen Props

**File:** `src/screens/UserProfileScreen.tsx`

**Change line 20-24 from:**
```typescript
interface UserProfileScreenProps {
  onBack?: () => void;
  onEdit?: () => void;
  shouldRefresh?: boolean;
}
```

**To:**
```typescript
interface UserProfileScreenProps {
  onBack?: () => void;
  onEdit?: () => void;
  onShowError?: (fromScreen: 'userProfile', message?: string) => void;
  shouldRefresh?: boolean;
}
```

## Step 2: Update Component Function Signature

**Change line 26 from:**
```typescript
const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ onBack, onEdit, shouldRefresh = false }) => {
```

**To:**
```typescript
const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ onBack, onEdit, onShowError, shouldRefresh = false }) => {
```

## Step 3: Replace Toast with Error Screen

**Find this code (around lines 55-63):**
```typescript
} catch (error: any) {
  console.error('Error fetching profile:', error);
  Toast.show({
    type: 'error',
    text1: 'Failed to Load Profile',
    text2: error.message || 'Could not fetch profile data',
    position: 'top',
    visibilityTime: 3000,
  });
} finally {
```

**Replace with:**
```typescript
} catch (error: any) {
  console.error('Error fetching profile:', error);
  
  // Show error screen instead of toast
  if (onShowError) {
    const errorMessage = error.message === 'No authentication token found. Please login again.'
      ? 'Your session has expired. Please login again.'
      : 'Unable to load your profile. Please check your internet connection and try again.';
    
    onShowError('userProfile', errorMessage);
  }
} finally {
```

## Step 4: Update App.tsx to Pass onShowError

**File:** `App.tsx`

**Find this code (around line 444-450):**
```typescript
{currentScreen === 'userProfile' && (
  <UserProfileScreen
    onBack={handleUserProfileBack}
    onEdit={handleUserProfileEdit}
    shouldRefresh={shouldRefreshProfile}
  />
)}
```

**Replace with:**
```typescript
{currentScreen === 'userProfile' && (
  <UserProfileScreen
    onBack={handleUserProfileBack}
    onEdit={handleUserProfileEdit}
    onShowError={handleShowError}
    shouldRefresh={shouldRefreshProfile}
  />
)}
```

## Step 5: Test the Implementation

### Test Scenario 1: Network Error
1. Open the app
2. Navigate to Settings → User Profile
3. Turn off WiFi/Mobile data
4. Pull to refresh or navigate away and back
5. **Expected:** Error screen should appear with the error illustration
6. Tap "Go Back"
7. **Expected:** Should return to Settings screen

### Test Scenario 2: Server Error
1. Modify the API endpoint to an invalid URL (temporarily)
2. Navigate to Settings → User Profile
3. **Expected:** Error screen should appear
4. Tap "Try Again"
5. **Expected:** Should return to User Profile and attempt to reload

### Test Scenario 3: Hardware Back Button
1. Navigate to Settings → User Profile
2. Trigger an error (disconnect network)
3. Error screen appears
4. Press hardware back button (Android)
5. **Expected:** Should return to Settings screen

## Complete Modified Code Sections

### UserProfileScreen.tsx - Complete Error Handling

```typescript
useEffect(() => {
  const fetchProfile = async () => {
    // Skip if already loaded and not forced to refresh
    if (hasLoadedOnce && !shouldRefresh) {
      console.log('Using cached profile data');
      return;
    }

    setIsLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      console.log('Fetching fresh profile data...');
      const data = await getUserProfile(token);
      setProfileData(data);
      setHasLoadedOnce(true);
      console.log('Fetched user profile:', data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      
      // Show error screen instead of toast
      if (onShowError) {
        const errorMessage = error.message === 'No authentication token found. Please login again.'
          ? 'Your session has expired. Please login again.'
          : 'Unable to load your profile. Please check your internet connection and try again.';
        
        onShowError('userProfile', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  fetchProfile();
}, [shouldRefresh]);
```

## What Happens Now?

### Before (with Toast):
```
User Profile → API Fails → Small toast appears at top → Disappears after 3 seconds
                          → User sees empty/loading screen
                          → Confusing UX
```

### After (with Error Screen):
```
User Profile → API Fails → Full error screen with illustration
                          → Clear "Go Back" button
                          → Clear "Try Again" button
                          → User knows exactly what to do
                          → Better UX
```

## Visual Flow

```
┌─────────────────────┐
│                     │
│    Settings         │
│                     │
│  • User Profile ←─┐ │
│  • Location       │ │
│  • Language       │ │
│                   │ │
└───────────────────│─┘
                    │
                    │ (User taps)
                    ↓
┌───────────────────────┐
│                       │
│   User Profile        │
│   [Loading...]        │
│                       │
│   (API Call Fails)    │
│                       │
└───────────────────────┘
                    │
                    │ (Error occurs)
                    ↓
┌───────────────────────────┐
│                           │
│   [Error Illustration]    │
│                           │
│ Oops! Something Went      │
│ Wrong                     │
│                           │
│ Unable to load your       │
│ profile. Please check     │
│ your internet connection  │
│ and try again.            │
│                           │
│  ┌─────────────────┐     │
│  │  Try Again      │     │
│  └─────────────────┘     │
│                           │
│  ┌─────────────────┐     │
│  │  Go Back        │ ────┼─→ Returns to Settings
│  └─────────────────┘     │
│                           │
└───────────────────────────┘
```

## Benefits of This Approach

✅ **User-Friendly**: Full-screen error is impossible to miss
✅ **Clear Actions**: Users know they can go back or retry
✅ **Professional**: Looks polished with the illustration
✅ **Consistent**: Same error handling across all screens
✅ **Informative**: Custom messages explain the specific error
✅ **Recoverable**: Easy to navigate back and try again

## Common Mistakes to Avoid

❌ **Don't forget to add `onShowError` prop** to the interface
❌ **Don't forget to pass `handleShowError`** in App.tsx
❌ **Don't use error screen for minor errors** (use toasts for those)
❌ **Don't forget to remove Toast.show()** when replacing with error screen
❌ **Don't use generic error messages** - be specific about what failed

## Next Screens to Update

After UserProfileScreen works, apply the same pattern to:

1. **OrderDetailsScreen** - Critical order information
2. **ActiveOrderScreen** - Active work details
3. **HomeScreen** - Dashboard data
4. **PersonalDetailsScreen** - Profile creation during signup
5. **OrderHistoryScreen** - Order list

## Need Help?

Refer to:
- `ERROR_SCREEN_USAGE.md` - Comprehensive usage guide
- `ERROR_SCREEN_SUMMARY.md` - Implementation summary
- `src/screens/ErrorScreen.tsx` - The component itself
