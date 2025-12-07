# Testing the ProWorker Sign Up Screen

## Quick Start

The Metro bundler is already running. To see your new Sign Up screen:

### For Android:
1. Make sure your Android emulator is running or device is connected
2. In a new terminal, run:
   ```bash
   npm run android
   ```
3. Or press 'a' in the Metro bundler terminal

### For iOS (Mac only):
1. Make sure you have Xcode installed
2. In a new terminal, run:
   ```bash
   npm run ios
   ```
3. Or press 'i' in the Metro bundler terminal

### Reload the App:
If the app is already running and you want to see the changes:
- **Android**: Press 'R' twice quickly (or Cmd+M / Ctrl+M → Reload)
- **iOS**: Press Cmd+R

## What You'll See:

1. **Splash Screen** (3 seconds)
   - Dark blue background
   - "ProWorker" title in white
   - "Make Your Skills Visible" tagline
   - Smooth fade-in animation

2. **Sign Up Screen** (after splash)
   - Dark blue background
   - "ProWorker" header
   - "Sign Up" subtitle
   - Three input fields with white borders:
     - Phone No
     - Password
     - Re-Password
   - White "SignUp" button at the bottom

## Testing Interactions:

- **Tap on input fields**: They will show a blue glow effect when focused
- **Type in fields**: Phone field shows number keyboard, password fields hide text
- **Tap SignUp button**: Currently logs to console (check Metro bundler output)

## Troubleshooting:

If you see errors:
1. Stop Metro bundler (Ctrl+C)
2. Clear cache: `npx react-native start --reset-cache`
3. Rebuild the app: `npm run android` or `npm run ios`
