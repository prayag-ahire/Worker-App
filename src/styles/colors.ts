export const Colors = {
  // ===== PRIMARY PALETTE (70% White, 20% Sky Blue, 10% Light Blue) =====
  
  // White - Primary (70% usage)
  white: '#FFFFFF',
  offWhite: '#FAFBFC',
  
  // Sky Blue - Secondary (20% usage)
  skyBlue: '#38BDF8',           // Primary sky blue
  skyBlueDark: '#0EA5E9',       // Darker sky blue
  skyBlueLight: '#7DD3FC',      // Lighter sky blue
  skyBluePale: '#E0F2FE',       // Very pale sky blue
  
  // Light Blue - Tertiary (10% usage)
  lightBlue: '#BAE6FD',         // Light blue accent
  lightBlueSoft: '#E0F2FE',     // Soft light blue
  
  // Black - Text
  black: '#000000',
  blackSoft: '#1F2937',         // Slightly softer black
  
  // ===== FUNCTIONAL COLORS =====
  
  // Backgrounds
  backgroundPrimary: '#FFFFFF',     // Main white background (70%)
  backgroundSecondary: '#F8FAFC',   // Subtle off-white
  backgroundAccent: '#E0F2FE',      // Light blue background (10%)
  backgroundCard: '#FFFFFF',        // Card backgrounds
  
  // Text Hierarchy
  textPrimary: '#000000',           // Primary black text
  textSecondary: '#4B5563',         // Secondary gray text
  textTertiary: '#6B7280',          // Tertiary lighter gray
  textWhite: '#FFFFFF',             // White text on colored backgrounds
  textBlue: '#0EA5E9',              // Blue accent text
  
  // Accents & Actions
  accent: '#38BDF8',                // Sky blue accent (20%)
  accentHover: '#0EA5E9',           // Darker on hover
  accentPressed: '#0284C7',         // Even darker when pressed
  accentLight: '#BAE6FD',           // Light blue accent (10%)
  
  // Status Colors
  success: '#10B981',               // Green
  warning: '#F59E0B',               // Orange
  error: '#EF4444',                 // Red
  info: '#38BDF8',                  // Sky blue
  
  // Borders
  border: '#E5E7EB',                // Light gray border
  borderLight: '#F3F4F6',           // Very light border
  borderFocus: '#38BDF8',           // Sky blue focus border
  borderDark: '#D1D5DB',            // Darker border
  
  // Shadows
  shadowLight: 'rgba(56, 189, 248, 0.08)',    // Sky blue shadow
  shadowMedium: 'rgba(56, 189, 248, 0.15)',   // Medium shadow
  shadowDark: 'rgba(0, 0, 0, 0.1)',           // Dark shadow
  
  // Gradients
  gradientSky: '#38BDF8',           // Sky blue gradient start
  gradientLight: '#7DD3FC',         // Light blue gradient end
  
  // ===== BACKWARD COMPATIBILITY ALIASES =====
  // These allow old screens to continue working while we migrate
  textDark: '#000000',              // Alias for textPrimary
  textMedium: '#4B5563',            // Alias for textSecondary
  textLight: '#6B7280',             // Alias for textTertiary
  backgroundWhite: '#FFFFFF',       // Alias for backgroundPrimary
  backgroundLight: '#F8FAFC',       // Alias for backgroundSecondary
  backgroundSoft: '#E0F2FE',        // Alias for backgroundAccent
  primaryDark: '#0EA5E9',           // Alias for skyBlueDark
  primaryMedium: '#38BDF8',         // Alias for skyBlue
  primaryLight: '#7DD3FC',          // Alias for skyBlueLight
  primaryPale: '#E0F2FE',           // Alias for skyBluePale
  gray: '#6B7280',                  // Alias for textTertiary
  lightGray: '#F3F4F6',             // Alias for borderLight
  darkGray: '#374151',              // Darker gray
  gradientStart: '#38BDF8',         // Alias for gradientSky
  gradientMiddle: '#0EA5E9',        // Alias for skyBlueDark
  gradientEnd: '#0284C7',           // Alias for accentPressed
};
