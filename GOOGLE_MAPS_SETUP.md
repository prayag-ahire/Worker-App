# Google Maps Setup Guide

## Getting Your Google Maps API Key

Follow these steps to get a free Google Maps API key for your React Native app:

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown at the top
4. Click "New Project"
5. Enter a project name (e.g., "Worker App")
6. Click "Create"

### 2. Enable Google Maps SDK for Android

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Maps SDK for Android"
3. Click on it and press "Enable"

### 3. Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Your API key will be created and displayed
4. **Important**: Click "Restrict Key" to secure it
5. Under "Application restrictions", select "Android apps"
6. Click "Add an item" under "Restrict usage to your Android apps"
7. Add your package name: `com.workerapp` (or your actual package name)
8. For SHA-1, you can get it by running:
   ```bash
   cd android
   ./gradlew signingReport
   ```
9. Copy the SHA-1 fingerprint from the debug variant
10. Click "Save"

### 4. Configure Your App

1. Open `android/app/src/main/AndroidManifest.xml`
2. Find the line with `YOUR_GOOGLE_MAPS_API_KEY_HERE`
3. Replace it with your actual API key:
   ```xml
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"/>
   ```

### 5. Rebuild Your App

After adding the API key, rebuild your app:

```bash
# Clean the build
cd android
./gradlew clean
cd ..

# Rebuild and run
npx react-native run-android
```

## Free Tier Limits

Google Maps Platform offers a generous free tier:
- $200 free credit per month
- This covers approximately 28,000 map loads per month
- More than enough for development and small-scale apps

## Alternative: OpenStreetMap (Completely Free)

If you prefer a completely free solution without API keys, you can use OpenStreetMap with `react-native-maps`. The current implementation already supports this - just remove the `PROVIDER_GOOGLE` prop from the MapView component.

## Troubleshooting

### Map shows blank/gray screen
- Verify your API key is correct
- Make sure "Maps SDK for Android" is enabled
- Check that your package name matches in the API restrictions
- Ensure you've added the SHA-1 fingerprint

### Location permission denied
- Make sure you've granted location permissions when prompted
- Check Settings > Apps > Worker App > Permissions > Location

### Location not updating
- Ensure GPS is enabled on your device
- Try testing on a physical device instead of emulator
- Check that location services are enabled in device settings

## Testing

Once configured, test the location feature:
1. Open the app and navigate to Settings > Location
2. Tap "Get Current Location"
3. Grant location permission when prompted
4. The map should animate to your current location
5. A marker should appear at your position
6. Tap "Set Home Location" to save it
