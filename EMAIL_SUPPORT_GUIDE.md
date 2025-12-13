# Email Support Feature - Backend Integration Guide

## Current Implementation

The "Send Email" button in the Help screen is now configured to:
- **Email Address**: `client.support@proworker.co`
- **Subject**: "Support Request - Worker App"
- **Pre-filled Template**: Includes user details and space for query

## What Works Now

✅ Opens Gmail (or default email app)
✅ Pre-fills recipient: `client.support@proworker.co`
✅ Pre-fills subject line
✅ Pre-fills email body with template
✅ User can write their query and send

## Current User Details (Placeholder)

```typescript
const userDetails = {
  name: 'Prayag Ahire',        // TODO: Get from backend
  mobile: '+91 1234567890',    // TODO: Get from backend
  address: 'Mumbai, Maharashtra' // TODO: Get from backend
};
```

## How to Integrate with Backend

### Option 1: Using User Context (Recommended)

1. **Create a UserContext** (if you don't have one):

```typescript
// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface UserData {
  name: string;
  mobile: string;
  address: string;
  email?: string;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
```

2. **Update HelpScreen.tsx**:

```typescript
import { useUser } from '../contexts/UserContext';

const HelpScreen = ({ onBack, onAIChatPress }) => {
  const { user } = useUser();
  
  const handleSendEmail = () => {
    const userDetails = {
      name: user?.name || 'User',
      mobile: user?.mobile || 'Not provided',
      address: user?.address || 'Not provided',
    };
    
    // Rest of the email code...
  };
};
```

### Option 2: Using AsyncStorage

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleSendEmail = async () => {
  // Get user data from AsyncStorage
  const userData = await AsyncStorage.getItem('@user_data');
  const user = userData ? JSON.parse(userData) : null;
  
  const userDetails = {
    name: user?.name || 'User',
    mobile: user?.mobile || 'Not provided',
    address: user?.address || 'Not provided',
  };
  
  // Rest of the email code...
};
```

### Option 3: Using Redux/State Management

```typescript
import { useSelector } from 'react-redux';

const HelpScreen = ({ onBack, onAIChatPress }) => {
  const user = useSelector((state) => state.user);
  
  const handleSendEmail = () => {
    const userDetails = {
      name: user?.name || 'User',
      mobile: user?.mobile || 'Not provided',
      address: user?.address || 'Not provided',
    };
    
    // Rest of the email code...
  };
};
```

## Email Template Structure

The email template is formatted as:

```
Dear ProWorker Support Team,

I need assistance with the following:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: [User's Name]
Contact: [User's Mobile]
Address: [User's Address]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MY QUERY/ISSUE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[User writes their query here]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Thank you for your support!

Best regards,
[User's Name]
```

## Testing

1. **Open the app**
2. **Go to Settings → Help**
3. **Click "Send Email" button**
4. **Gmail should open** with:
   - To: `client.support@proworker.co`
   - Subject: "Support Request - Worker App"
   - Body: Pre-filled template with user details
5. **User can type their query** in the designated section
6. **Click Send** in Gmail

## Additional Fields You Can Add

When you get backend data, you can easily add more fields:

```typescript
const userDetails = {
  name: user?.name || 'User',
  mobile: user?.mobile || 'Not provided',
  address: user?.address || 'Not provided',
  email: user?.email || 'Not provided',
  userId: user?.id || 'Not provided',
  registrationDate: user?.createdAt || 'Not provided',
  profession: user?.profession || 'Not provided',
};
```

Then update the email body template to include these fields.

## Notes

- ✅ Email opens in default email app (Gmail, Outlook, etc.)
- ✅ Works on both Android and iOS
- ✅ User can edit the pre-filled content before sending
- ✅ Template is clean and professional
- ⚠️ Requires user to have an email app installed
- 📝 TODO comments mark where to integrate backend data

Your email support feature is ready to use! Just integrate with your backend when available.
