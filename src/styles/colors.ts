export const Colors = {
  // ===== PRIMARY PALETTE (Modern Professional Blue) =====
  
  // White - Primary (70% usage)
  white: '#FFFFFF',
  offWhite: '#FAFBFC',
  
  // Rich Blue - Secondary (20% usage) - UPDATED TO MODERN BLUE
  richBlue: '#2563EB',           // Primary rich blue (like reference image)
  richBlueDark: '#1D4ED8',       // Darker rich blue
  richBlueLight: '#3B82F6',      // Lighter rich blue
  richBluePale: '#DBEAFE',       // Very pale blue
  
  // Light Blue - Tertiary (10% usage)
  lightBlue: '#93C5FD',          // Light blue accent
  lightBlueSoft: '#DBEAFE',      // Soft light blue
  
  // Black - Text
  black: '#000000',
  blackSoft: '#1F2937',          // Slightly softer black
  
  // ===== FUNCTIONAL COLORS =====
  
  // Backgrounds
  backgroundPrimary: '#FFFFFF',     // Main white background (70%)
  backgroundSecondary: '#F8FAFC',   // Subtle off-white
  backgroundAccent: '#DBEAFE',      // Light blue background (10%)
  backgroundCard: '#FFFFFF',        // Card backgrounds
  
  // Text Hierarchy
  textPrimary: '#000000',           // Primary black text
  textSecondary: '#4B5563',         // Secondary gray text
  textTertiary: '#6B7280',          // Tertiary lighter gray
  textWhite: '#FFFFFF',             // White text on colored backgrounds
  textBlue: '#2563EB',              // Blue accent text
  
  // Accents & Actions - UPDATED TO RICH BLUE
  accent: '#2563EB',                // Rich blue accent (20%)
  accentHover: '#1D4ED8',           // Darker on hover
  accentPressed: '#1E40AF',         // Even darker when pressed
  accentLight: '#93C5FD',           // Light blue accent (10%)
  
  // Status Colors
  success: '#10B981',               // Green
  warning: '#F59E0B',               // Orange
  error: '#EF4444',                 // Red
  info: '#2563EB',                  // Rich blue
  
  // Borders
  border: '#E5E7EB',                // Light gray border
  borderLight: '#F3F4F6',           // Very light border
  borderFocus: '#2563EB',           // Rich blue focus border
  borderDark: '#D1D5DB',            // Darker border
  
  // Shadows - ENHANCED FOR MODERN LOOK
  shadowLight: 'rgba(37, 99, 235, 0.08)',     // Rich blue shadow
  shadowMedium: 'rgba(37, 99, 235, 0.15)',    // Medium shadow
  shadowDark: 'rgba(0, 0, 0, 0.1)',           // Dark shadow
  shadowCard: 'rgba(0, 0, 0, 0.08)',          // Card shadow
  
  // Gradients
  gradientBlue: '#2563EB',          // Rich blue gradient start
  gradientLight: '#3B82F6',         // Light blue gradient end
  
  // ===== BACKWARD COMPATIBILITY ALIASES =====
  // These allow old screens to continue working while we migrate
  textDark: '#000000',              // Alias for textPrimary
  textMedium: '#4B5563',            // Alias for textSecondary
  textLight: '#6B7280',             // Alias for textTertiary
  backgroundWhite: '#FFFFFF',       // Alias for backgroundPrimary
  backgroundLight: '#F8FAFC',       // Alias for backgroundSecondary
  backgroundSoft: '#DBEAFE',        // Alias for backgroundAccent
  primaryDark: '#1D4ED8',           // Alias for richBlueDark
  primaryMedium: '#2563EB',         // Alias for richBlue
  primaryLight: '#3B82F6',          // Alias for richBlueLight
  primaryPale: '#DBEAFE',           // Alias for richBluePale
  gray: '#6B7280',                  // Alias for textTertiary
  lightGray: '#F3F4F6',             // Alias for borderLight
  darkGray: '#374151',              // Darker gray
  gradientStart: '#2563EB',         // Alias for gradientBlue
  gradientMiddle: '#1D4ED8',        // Alias for richBlueDark
  gradientEnd: '#1E40AF',           // Alias for accentPressed
  
  // Legacy sky blue aliases (for gradual migration)
  skyBlue: '#2563EB',               // Now points to rich blue
  skyBlueDark: '#1D4ED8',           // Now points to rich blue dark
  skyBlueLight: '#3B82F6',          // Now points to rich blue light
  skyBluePale: '#DBEAFE',           // Now points to rich blue pale
};
