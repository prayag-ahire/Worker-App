# Final UI Design System - Worker App

## Overview
This document defines the finalized UI design system for the Worker App, featuring a professional 70% White, 20% Sky Blue, 10% Light Blue color scheme with modern, polished components.

---

## Color System

### Primary Colors (70/20/10 Distribution)

**White - 70% Usage**
- `Colors.white` - #FFFFFF
- `Colors.backgroundPrimary` - #FFFFFF
- `Colors.backgroundSecondary` - #F8FAFC
- Used for: Main backgrounds, cards, content areas

**Sky Blue - 20% Usage**
- `Colors.accent` - #38BDF8
- `Colors.skyBlue` - #38BDF8
- `Colors.skyBlueDark` - #0EA5E9
- Used for: Headers, accents, active states, buttons

**Light Blue - 10% Usage**
- `Colors.backgroundAccent` - #E0F2FE
- `Colors.lightBlue` - #BAE6FD
- Used for: Subtle backgrounds, badges, highlights

**Text Colors**
- `Colors.textPrimary` - #000000 (Black)
- `Colors.textSecondary` - #4B5563 (Gray)
- `Colors.textWhite` - #FFFFFF (White on colored backgrounds)

---

## Component Standards

### 1. Screen Headers (ScreenHeader Component)

**Default Variant:**
```tsx
<ScreenHeader 
  title="Screen Name" 
  onBack={handleBack}
/>
```
- White background
- Black text (22px, weight 700)
- Sky blue arrow (28px)
- Minimal padding

**Blue Variant:** (APPROVED DESIGN)
```tsx
<ScreenHeader 
  title="Screen Name" 
  onBack={handleBack}
  variant="blue"
/>
```
- Full-width sky blue background (#38BDF8)
- White text (22px, weight 700)
- White arrow (28px)
- Rounded bottom corners (24px)
- Subtle shadow (elevation 4)
- Padding: 20px vertical, 24px horizontal

**Specifications:**
- Arrow size: 28px
- Title size: 22px
- Font weight: 700
- Arrow margin right: 12px
- Arrow margin top: -2px (for vertical centering)
- Border radius: 24px (bottom corners only)

---

### 2. Navigation Buttons (HomeScreen)

**Style:**
```typescript
navButton: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: Colors.white,
  shadowColor: Colors.shadowDark,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.12,
  shadowRadius: 4,
  elevation: 3,
}

navButtonText: {
  fontSize: 24,
  color: Colors.accent,
  fontWeight: '700',
  textAlign: 'center',
  marginTop: -2, // For vertical centering
}
```

**Features:**
- Size: 44x44px (good touch target)
- White background with shadow
- Sky blue arrows (24px)
- Active opacity: 0.6
- Perfect vertical centering

---

### 3. Tab Buttons (Day/Week/Month)

**Container:**
```typescript
tabsContainer: {
  flexDirection: 'row',
  backgroundColor: Colors.backgroundSecondary,
  borderRadius: 12,
  padding: 4,
  marginBottom: 24,
}
```

**Tab Styles:**
```typescript
tab: {
  flex: 1,
  paddingVertical: 10,
  alignItems: 'center',
  borderRadius: 8,
  backgroundColor: 'transparent',
}

tabActive: {
  backgroundColor: Colors.white,
  shadowColor: Colors.shadowDark,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
}
```

**Features:**
- Active tab: White with shadow
- Inactive tab: Transparent
- Active text: Sky blue, weight 700
- Active opacity: 0.7

---

### 4. Work Cards

**Style:**
```typescript
workCard: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: Colors.white,
  borderRadius: 14,
  padding: 20,
  marginBottom: 14,
  shadowColor: Colors.accent,
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.12,
  shadowRadius: 10,
  elevation: 4,
  borderLeftWidth: 5,
  borderLeftColor: Colors.accent,
}
```

**Features:**
- 5px sky blue left border
- Sky blue shadow for subtle glow
- 20px padding
- 14px border radius
- Client name: 18px, weight 700
- Status badge: Light blue background

---

### 5. Dropdown Menu

**Style:**
```typescript
dropdown: {
  position: 'absolute',
  top: 100,
  right: 24,
  backgroundColor: Colors.white,
  borderRadius: 16,
  paddingVertical: 8,
  paddingHorizontal: 4,
  shadowColor: Colors.shadowDark,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.2,
  shadowRadius: 16,
  elevation: 10,
  minWidth: 200,
}

dropdownItem: {
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderRadius: 10,
  marginHorizontal: 4,
}
```

**Features:**
- Width: 200px minimum
- Text: 16px, weight 600
- Padding: 16px vertical, 20px horizontal
- Active opacity: 0.7
- Strong shadow for visibility

---

### 6. Settings Card

**Style:**
```typescript
settingsCard: {
  padding: 0,
  overflow: 'hidden',
  backgroundColor: Colors.white,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: Colors.borderLight,
}
```

**Features:**
- 16px border radius
- Subtle border (no shadow)
- Clean white background
- Overflow hidden for rounded corners

---

## Typography Scale

### Headings
- **H1 (Page Title):** 22px, weight 700, letter-spacing -0.3
- **H2 (Section):** 18px, weight 700, letter-spacing -0.3
- **H3 (Card Title):** 18px, weight 700, letter-spacing -0.3

### Body Text
- **Primary:** 16px, weight 600
- **Secondary:** 14px, weight 500
- **Tertiary:** 13px, weight 500

### UI Elements
- **Tab Text:** 15px, weight 600
- **Button Text:** 16px, weight 600
- **Badge Text:** 13px, weight 700
- **Navigation Arrows:** 24px, weight 700

---

## Spacing Scale

**Padding:**
- XS: 4px
- S: 8px
- M: 12px
- L: 16px
- XL: 20px
- XXL: 24px

**Margins:**
- S: 8px
- M: 12px
- L: 14px
- XL: 16px
- XXL: 24px

**Border Radius:**
- Small: 8px
- Medium: 12px
- Large: 14px
- XLarge: 16px
- XXLarge: 20px, 22px, 24px

---

## Shadow Levels

**Light (Elevation 2):**
```typescript
shadowColor: Colors.shadowDark,
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.1,
shadowRadius: 3,
elevation: 2,
```

**Medium (Elevation 3-4):**
```typescript
shadowColor: Colors.accent,
shadowOffset: { width: 0, height: 2-3 },
shadowOpacity: 0.12,
shadowRadius: 4-10,
elevation: 3-4,
```

**Strong (Elevation 8-10):**
```typescript
shadowColor: Colors.shadowDark,
shadowOffset: { width: 0, height: 6 },
shadowOpacity: 0.2,
shadowRadius: 16,
elevation: 10,
```

---

## Interactive States

**All TouchableOpacity Components:**
- Navigation buttons: `activeOpacity={0.6}`
- Tab buttons: `activeOpacity={0.7}`
- Cards/List items: `activeOpacity={0.7}`
- Dropdown items: `activeOpacity={0.7}`

---

## Screen-Specific Patterns

### Settings Screen (APPROVED DESIGN)

**Structure:**
1. Blue header with rounded bottom corners
2. White background
3. Settings card with border
4. StatusBar: light-content, blue background

**Code Pattern:**
```tsx
<View style={styles.container}>
  <StatusBar barStyle="light-content" backgroundColor={Colors.accent} />
  <ScrollView>
    <ScreenHeader 
      title={t('settings.settings')} 
      onBack={onBack}
      variant="blue"
    />
    <Card style={styles.settingsCard}>
      {/* List items */}
    </Card>
  </ScrollView>
</View>
```

### Home Screen

**Structure:**
1. White header with greeting
2. Tab navigation (Day/Week/Month)
3. Date navigation with light blue background
4. Work cards with sky blue accent

**Key Features:**
- Navigation panel: Light blue background (#E0F2FE)
- Work cards: 5px sky blue left border
- Tabs: Modern pill style

---

## Implementation Checklist

To apply this design system to a new screen:

- [ ] Use ScreenHeader component (blue variant for main screens)
- [ ] Set StatusBar to light-content if using blue header
- [ ] Apply proper spacing (use scale above)
- [ ] Use activeOpacity on all TouchableOpacity
- [ ] Add shadows to elevated elements
- [ ] Use sky blue for accents and active states
- [ ] Ensure text uses proper hierarchy
- [ ] Add proper border radius to cards/buttons
- [ ] Test touch targets (minimum 44x44px)

---

## Files Modified

1. **`src/styles/colors.ts`** - Color system with backward compatibility
2. **`src/components/ScreenHeader.tsx`** - Reusable header with blue variant
3. **`src/screens/HomeScreen.tsx`** - Complete redesign with new patterns
4. **`src/screens/SettingsScreen.tsx`** - Blue header implementation
5. **`src/screens/HelpScreen.tsx`** - Color updates

---

## Next Steps

**To Apply to All Screens:**

1. Update all screens using ScreenHeader to use blue variant
2. Ensure consistent spacing across all screens
3. Apply activeOpacity to all interactive elements
4. Use the approved shadow levels
5. Maintain 70/20/10 color distribution

**Screens to Update:**
- Help Screen
- User Profile Screen
- Location Screen
- App Language Screen
- Tutorial Videos Screen
- Order Screens
- Schedule Screens

---

**Status:** ✅ Design System Finalized and Approved
**Date:** 2025-12-14
**Version:** 1.0
