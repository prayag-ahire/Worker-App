# Apply Blue Header to All Screens - Quick Reference

## Screens Updated:

✅ 1. SettingsScreen
✅ 2. TutorialVideosScreen  
✅ 3. ScheduleMainScreen
⏳ 4. OrderHistoryScreen
⏳ 5. LocationScreen
⏳ 6. InviteFriendScreen
⏳ 7. CommentScreen
⏳ 8. AppLanguageScreen

## Changes Needed for Each Screen:

### 1. Update StatusBar:
```tsx
// FROM:
<StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

// TO:
<StatusBar barStyle="light-content" backgroundColor={Colors.accent} />
```

### 2. Update ScreenHeader:
```tsx
// FROM:
<ScreenHeader title={t('...')} onBack={onBack} />

// TO:
<ScreenHeader title={t('...')} onBack={onBack} variant="blue" />
```

## File Locations:

- OrderHistoryScreen: `src/screens/OrderHistoryScreen.tsx` (line 46)
- LocationScreen: `src/screens/LocationScreen.tsx` (line 198)
- InviteFriendScreen: `src/screens/InviteFriendScreen.tsx` (line 44)
- CommentScreen: `src/screens/CommentScreen.tsx` (line 51)
- AppLanguageScreen: `src/screens/AppLanguageScreen.tsx` (line 52)

## Summary:

This will give all screens a consistent, modern look with:
- Sky blue header with rounded bottom corners
- White text and arrow
- Professional appearance
- Consistent design language across the entire app
