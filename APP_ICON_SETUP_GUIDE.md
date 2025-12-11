# ProWorker App Icon Setup Guide

## 🎨 Your Selected Logo
You've chosen the **blue gradient ProWorker logo** with the worker holding hammer and wrench.

## 📋 Steps to Set Up App Icon

### Method 1: Using Online Icon Generator (Easiest)

1. **Save your logo image** (the first blue gradient version)

2. **Visit one of these free online tools:**
   - [AppIcon.co](https://www.appicon.co/) - Generates for both iOS and Android
   - [MakeAppIcon](https://makeappicon.com/) - Easy to use
   - [Icon Kitchen](https://icon.kitchen/) - Android focused

3. **Upload your logo** and download the generated icon pack

4. **For Android:**
   - Extract the downloaded files
   - Copy the `mipmap-*` folders to: `android/app/src/main/res/`
   - Replace the existing folders

5. **For iOS:**
   - Extract the downloaded files
   - Open Xcode
   - Navigate to `ios/WorkerApp/Images.xcassets/AppIcon.appiconset/`
   - Replace the icon files

### Method 2: Manual Resize and Replace

#### Android Icon Sizes Needed:
- `mipmap-mdpi/ic_launcher.png` - 48x48px
- `mipmap-hdpi/ic_launcher.png` - 72x72px
- `mipmap-xhdpi/ic_launcher.png` - 96x96px
- `mipmap-xxhdpi/ic_launcher.png` - 144x144px
- `mipmap-xxxhdpi/ic_launcher.png` - 192x192px

Also create round versions:
- `ic_launcher_round.png` in each folder (same sizes)

#### iOS Icon Sizes Needed:
- 20x20, 29x29, 40x40, 58x58, 60x60, 76x76, 80x80, 87x87, 120x120, 152x152, 167x167, 180x180, 1024x1024

### After Replacing Icons:

#### For Android:
```bash
# Clean the build
cd android
./gradlew clean

# Rebuild
cd ..
npx react-native run-android
```

#### For iOS:
```bash
# Clean the build
cd ios
rm -rf build
pod install

# Rebuild
cd ..
npx react-native run-ios
```

## 🎯 Icon Design Specifications

Your ProWorker icon features:
- **Background**: Blue gradient (#1E88E5 to #1565C0)
- **Icon**: White construction worker with hard hat
- **Tools**: Hammer and wrench
- **Style**: Modern, minimalist line art

## ✅ Checklist

- [ ] Generate all required icon sizes
- [ ] Replace Android icons in `android/app/src/main/res/mipmap-*/`
- [ ] Replace iOS icons in `ios/WorkerApp/Images.xcassets/AppIcon.appiconset/`
- [ ] Clean and rebuild Android app
- [ ] Clean and rebuild iOS app
- [ ] Test on device to verify icon appears correctly

## 📱 Testing

After setup, your app icon should appear on:
- Home screen
- App drawer
- Recent apps
- Splash screen (if configured)

## 🔧 Troubleshooting

**Icon not updating on Android:**
- Uninstall the app completely
- Clear cache: `cd android && ./gradlew clean`
- Reinstall the app

**Icon not updating on iOS:**
- Delete the app from simulator/device
- Clean build folder in Xcode
- Rebuild and reinstall

## 💡 Pro Tips

1. **Keep your source logo** at 1024x1024px for best quality
2. **Use PNG format** with transparency if needed
3. **Test on multiple devices** to ensure icon looks good at all sizes
4. **Consider adaptive icons** for Android 8.0+ (separate foreground and background layers)

---

**Need help?** If you encounter any issues, let me know and I'll assist you further!
