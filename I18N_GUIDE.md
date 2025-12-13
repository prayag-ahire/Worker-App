# Internationalization (i18n) Implementation Guide

## Overview
Your app now has a complete internationalization system that makes it easy to add new languages and translate all text throughout the app.

## Structure

### 1. Translation Files
**Location**: `src/utils/translations.ts`

This file contains all translations organized by language. Currently supports:
- English
- Hindi (हिंदी)
- Gujarati (ગુજરાતી)
- Marathi (मराठी)
- Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi, Urdu (using English as fallback)

### 2. Language Context
**Location**: `src/contexts/LanguageContext.tsx`

Manages language state across the app and provides the `useLanguage()` hook.

## How to Use Translations in Your Screens

### Step 1: Import the hook
```typescript
import { useLanguage } from '../contexts/LanguageContext';
```

### Step 2: Use the hook in your component
```typescript
const MyScreen = () => {
  const { t } = useLanguage();
  
  return (
    <Text>{t.greeting}</Text>  // Will show "Hello" or "नमस्ते" based on selected language
  );
};
```

### Step 3: Replace all hardcoded text
**Before:**
```typescript
<Text>Location</Text>
<Button title="Get Current Location" />
Alert.alert('Error', 'Location permission denied');
```

**After:**
```typescript
<Text>{t.location}</Text>
<Button title={t.getCurrentLocation} />
Alert.alert(t.locationError, t.permissionDeniedMessage);
```

## Available Translation Keys

### Common
- `ok`, `cancel`, `save`, `delete`, `edit`, `confirm`, `back`, `next`, `submit`
- `loading`, `error`, `success`, `search`, `verify`, `retry`, `close`, `update`

### Location Screen
- `getCurrentLocation` - "📍 Get Current Location"
- `setHomeLocation` - "Set Home Location"
- `gettingAddress` - "Getting address..."
- `mapPlaceholder` - "Tap \"Get Current Location\" to view your position"
- `locationInfoText` - Info text for the screen
- `permissionDenied` - "Permission Denied"
- `permissionDeniedMessage` - Permission error message
- `locationError` - "Location Error"
- `locationErrorMessage` - Location error message
- `noLocationSelected` - "No Location Selected"
- `noLocationSelectedMessage` - No location error message
- `homeLocationSet` - "Home Location Set"
- `homeLocationSetMessage` - Success message
- `yourLocation` - "Your Location"

### Home Screen
- `greeting`, `activeOrders`, `completedOrders`, `noOrders`, `viewDetails`

### Orders
- `orders`, `active`, `completed`, `cancelled`, `orderDetails`, `orderNumber`
- `customerName`, `serviceType`, `scheduledDate`, `scheduledTime`, `address`
- `status`, `reschedule`, `cancel`, `complete`, `viewOnMap`, `callCustomer`

### Schedule
- `schedule`, `daily`, `weekly`, `monthly`, `today`, `tomorrow`
- `selectDate`, `selectTime`, `noScheduledWork`, `workScheduled`

### Settings
- `settings`, `userProfile`, `location`, `appLanguage`, `inviteFriend`
- `tutorialVideos`, `help`, `darkMode`, `notifications`

### Days & Months
- Days: `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`
- Months: `january`, `february`, `march`, `april`, `may`, `june`, `july`, `august`, `september`, `october`, `november`, `december`

## How to Add a New Language

### Step 1: Add language to the type
In `src/utils/translations.ts`, update the Language type:
```typescript
export type Language = 'English' | 'Hindi' | 'Gujarati' | 'Marathi' | 'YourNewLanguage';
```

### Step 2: Add translations
Add a new object in the `translations` record:
```typescript
YourNewLanguage: {
  greeting: 'Translated greeting',
  day: 'Translated day',
  // ... all other keys
}
```

### Step 3: Update the language selector
In `AppLanguageScreen.tsx`, add your new language to the list.

## How to Add New Translation Keys

### Step 1: Add to interface
In `src/utils/translations.ts`, add to the `Translations` interface:
```typescript
export interface Translations {
  // ... existing keys
  myNewKey: string;
}
```

### Step 2: Add translations for all languages
Add the key to each language object:
```typescript
English: {
  // ... existing translations
  myNewKey: 'My new text',
},
Hindi: {
  // ... existing translations
  myNewKey: 'मेरा नया पाठ',
},
// ... for all languages
```

### Step 3: Use in your component
```typescript
<Text>{t.myNewKey}</Text>
```

## Example: Updating LocationScreen

Here's how the LocationScreen should be updated to use translations:

```typescript
import { useLanguage } from '../contexts/LanguageContext';

const LocationScreen = ({ onBack }) => {
  const { t } = useLanguage();
  
  return (
    <>
      <ScreenHeader title={t.location} onBack={onBack} />
      
      <SecondaryButton
        title={t.getCurrentLocation}
        onPress={handleGetCurrentLocation}
      />
      
      <PrimaryButton
        title={t.setHomeLocation}
        onPress={handleSetHomeLocation}
      />
      
      <Text>{t.locationInfoText}</Text>
      
      {/* In alerts */}
      Alert.alert(t.permissionDenied, t.permissionDeniedMessage);
      Alert.alert(t.locationError, t.locationErrorMessage);
    </>
  );
};
```

## Benefits

1. **Easy to maintain**: All translations in one place
2. **Type-safe**: TypeScript ensures you don't miss any translations
3. **Scalable**: Add new languages by just adding a new object
4. **Consistent**: Same translation keys used across the app
5. **No hardcoded text**: Everything is translatable (except login/signup/onboarding as requested)

## Next Steps

To complete the LocationScreen translation:
1. Replace all hardcoded text with `t.keyName`
2. Test language switching
3. Verify all text changes when language changes

The system is now ready to use! Just replace hardcoded strings with translation keys using the `t` object from `useLanguage()`.
