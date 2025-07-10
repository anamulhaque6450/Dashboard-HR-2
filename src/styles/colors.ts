// Color Palette System for HR Dashboard
// This file defines the complete color system used throughout the application

export const colorPalette = {
  // Primary Colors - Main brand colors
  primary: {
    50: '#eff6ff',   // Very light blue
    100: '#dbeafe',  // Light blue
    200: '#bfdbfe',  // Lighter blue
    300: '#93c5fd',  // Light blue
    400: '#60a5fa',  // Medium blue
    500: '#3b82f6',  // Primary blue (main brand color)
    600: '#2563eb',  // Darker blue
    700: '#1d4ed8',  // Dark blue
    800: '#1e40af',  // Very dark blue
    900: '#1e3a8a',  // Darkest blue
  },

  // Secondary Colors - Supporting brand colors
  secondary: {
    50: '#f8fafc',   // Very light slate
    100: '#f1f5f9',  // Light slate
    200: '#e2e8f0',  // Lighter slate
    300: '#cbd5e1',  // Light slate
    400: '#94a3b8',  // Medium slate
    500: '#64748b',  // Secondary slate
    600: '#475569',  // Darker slate
    700: '#334155',  // Dark slate
    800: '#1e293b',  // Very dark slate
    900: '#0f172a',  // Darkest slate (sidebar)
  },

  // Success Colors - Positive actions, confirmations
  success: {
    50: '#f0fdf4',   // Very light green
    100: '#dcfce7',  // Light green
    200: '#bbf7d0',  // Lighter green
    300: '#86efac',  // Light green
    400: '#4ade80',  // Medium green
    500: '#22c55e',  // Success green
    600: '#16a34a',  // Darker green
    700: '#15803d',  // Dark green
    800: '#166534',  // Very dark green
    900: '#14532d',  // Darkest green
  },

  // Warning Colors - Cautions, pending states
  warning: {
    50: '#fffbeb',   // Very light amber
    100: '#fef3c7',  // Light amber
    200: '#fde68a',  // Lighter amber
    300: '#fcd34d',  // Light amber
    400: '#fbbf24',  // Medium amber
    500: '#f59e0b',  // Warning amber
    600: '#d97706',  // Darker amber
    700: '#b45309',  // Dark amber
    800: '#92400e',  // Very dark amber
    900: '#78350f',  // Darkest amber
  },

  // Error Colors - Errors, destructive actions
  error: {
    50: '#fef2f2',   // Very light red
    100: '#fee2e2',  // Light red
    200: '#fecaca',  // Lighter red
    300: '#fca5a5',  // Light red
    400: '#f87171',  // Medium red
    500: '#ef4444',  // Error red
    600: '#dc2626',  // Darker red
    700: '#b91c1c',  // Dark red
    800: '#991b1b',  // Very dark red
    900: '#7f1d1d',  // Darkest red
  },

  // Info Colors - Information, neutral actions
  info: {
    50: '#f0f9ff',   // Very light sky
    100: '#e0f2fe',  // Light sky
    200: '#bae6fd',  // Lighter sky
    300: '#7dd3fc',  // Light sky
    400: '#38bdf8',  // Medium sky
    500: '#0ea5e9',  // Info sky
    600: '#0284c7',  // Darker sky
    700: '#0369a1',  // Dark sky
    800: '#075985',  // Very dark sky
    900: '#0c4a6e',  // Darkest sky
  },

  // Purple Colors - Performance, analytics
  purple: {
    50: '#faf5ff',   // Very light purple
    100: '#f3e8ff',  // Light purple
    200: '#e9d5ff',  // Lighter purple
    300: '#d8b4fe',  // Light purple
    400: '#c084fc',  // Medium purple
    500: '#a855f7',  // Purple
    600: '#9333ea',  // Darker purple
    700: '#7c3aed',  // Dark purple
    800: '#6b21a8',  // Very dark purple
    900: '#581c87',  // Darkest purple
  },

  // Neutral Colors - Text, backgrounds, borders
  neutral: {
    50: '#fafafa',   // Very light gray
    100: '#f5f5f5',  // Light gray
    200: '#e5e5e5',  // Lighter gray
    300: '#d4d4d4',  // Light gray
    400: '#a3a3a3',  // Medium gray
    500: '#737373',  // Gray
    600: '#525252',  // Darker gray
    700: '#404040',  // Dark gray
    800: '#262626',  // Very dark gray
    900: '#171717',  // Darkest gray
  }
};

// Semantic Color Mappings - Use these for consistent theming
export const semanticColors = {
  // Text Colors
  text: {
    primary: colorPalette.neutral[900],     // Main text
    secondary: colorPalette.neutral[600],   // Secondary text
    muted: colorPalette.neutral[500],       // Muted text
    inverse: '#ffffff',                     // White text on dark backgrounds
  },

  // Background Colors
  background: {
    primary: '#ffffff',                     // Main background
    secondary: colorPalette.neutral[50],    // Secondary background
    muted: colorPalette.neutral[100],       // Muted background
    sidebar: '#ffffff',                     // Sidebar background (now white)
  },

  // Border Colors
  border: {
    light: colorPalette.neutral[200],       // Light borders
    medium: colorPalette.neutral[300],      // Medium borders
    dark: colorPalette.neutral[400],        // Dark borders
  },

  // Status Colors
  status: {
    success: colorPalette.success[500],     // Success states
    warning: colorPalette.warning[500],     // Warning states
    error: colorPalette.error[500],         // Error states
    info: colorPalette.info[500],           // Info states
  },

  // Department Colors - For consistent department theming
  departments: {
    engineering: colorPalette.primary[500], // Blue
    marketing: colorPalette.purple[500],    // Purple
    finance: colorPalette.success[500],     // Green
    sales: colorPalette.warning[500],       // Amber
    hr: colorPalette.info[500],             // Sky
    operations: colorPalette.error[500],    // Red
    product: colorPalette.purple[600],      // Dark purple
    analytics: colorPalette.primary[600],   // Dark blue
  }
};

// Chart Colors - For consistent data visualization
export const chartColors = {
  primary: [
    colorPalette.primary[500],   // Blue
    colorPalette.success[500],   // Green
    colorPalette.warning[500],   // Amber
    colorPalette.error[500],     // Red
    colorPalette.purple[500],    // Purple
    colorPalette.info[500],      // Sky
  ],
  gradients: {
    primary: 'from-blue-600 to-purple-600',
    success: 'from-green-500 to-emerald-600',
    warning: 'from-amber-500 to-orange-600',
    error: 'from-red-500 to-pink-600',
  }
};

export default colorPalette;