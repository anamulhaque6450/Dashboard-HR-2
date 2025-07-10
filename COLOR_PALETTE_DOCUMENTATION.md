# HR Dashboard Color Palette Documentation

## Overview
This document outlines the comprehensive color system used throughout the HR Dashboard application. The color palette is designed to be professional, accessible, and consistent across all components.

## Primary Color Palette

### 1. Primary Colors (Blue) - Main Brand Colors
- **Purpose**: Primary actions, links, main branding
- **Usage**: Buttons, links, active states, primary navigation
- **Hex Values**:
  - `primary-50`: #eff6ff (Very light blue - backgrounds)
  - `primary-100`: #dbeafe (Light blue - hover states)
  - `primary-200`: #bfdbfe (Lighter blue - disabled states)
  - `primary-300`: #93c5fd (Light blue - borders)
  - `primary-400`: #60a5fa (Medium blue - secondary actions)
  - `primary-500`: #3b82f6 (Primary blue - main brand color) ⭐
  - `primary-600`: #2563eb (Darker blue - hover states)
  - `primary-700`: #1d4ed8 (Dark blue - active states)
  - `primary-800`: #1e40af (Very dark blue - text)
  - `primary-900`: #1e3a8a (Darkest blue - headings)

### 2. Secondary Colors (Slate) - Supporting Colors
- **Purpose**: Text, backgrounds, neutral elements
- **Usage**: Sidebar, text colors, borders, backgrounds
- **Hex Values**:
  - `secondary-50`: #f8fafc (Very light slate - page backgrounds)
  - `secondary-100`: #f1f5f9 (Light slate - card backgrounds)
  - `secondary-200`: #e2e8f0 (Lighter slate - borders)
  - `secondary-300`: #cbd5e1 (Light slate - dividers)
  - `secondary-400`: #94a3b8 (Medium slate - placeholder text)
  - `secondary-500`: #64748b (Secondary slate - body text)
  - `secondary-600`: #475569 (Darker slate - headings)
  - `secondary-700`: #334155 (Dark slate - important text)
  - `secondary-800`: #1e293b (Very dark slate - navigation)
  - `secondary-900`: #0f172a (Darkest slate - sidebar background) ⭐

## Status Colors

### 3. Success Colors (Green)
- **Purpose**: Success states, positive metrics, confirmations
- **Usage**: Success messages, positive trends, completed tasks
- **Main Color**: `success-500`: #22c55e ⭐
- **Background**: `success-50`: #f0fdf4
- **Text**: `success-800`: #166534

### 4. Warning Colors (Amber)
- **Purpose**: Warning states, pending actions, cautions
- **Usage**: Warning messages, pending reviews, attention needed
- **Main Color**: `warning-500`: #f59e0b ⭐
- **Background**: `warning-50`: #fffbeb
- **Text**: `warning-800`: #92400e

### 5. Error Colors (Red)
- **Purpose**: Error states, destructive actions, critical alerts
- **Usage**: Error messages, delete actions, critical issues
- **Main Color**: `error-500`: #ef4444 ⭐
- **Background**: `error-50`: #fef2f2
- **Text**: `error-800`: #991b1b

### 6. Info Colors (Sky Blue)
- **Purpose**: Information states, neutral notifications
- **Usage**: Info messages, tips, general notifications
- **Main Color**: `info-500`: #0ea5e9 ⭐
- **Background**: `info-50`: #f0f9ff
- **Text**: `info-800`: #075985

## Specialized Colors

### 7. Purple Colors
- **Purpose**: Performance metrics, analytics, premium features
- **Usage**: Performance charts, analytics dashboards, special features
- **Main Color**: `purple-500`: #a855f7 ⭐
- **Background**: `purple-50`: #faf5ff
- **Text**: `purple-800`: #6b21a8

### 8. Neutral Colors (Gray)
- **Purpose**: General text, backgrounds, borders
- **Usage**: Body text, subtle backgrounds, borders
- **Main Color**: `neutral-500`: #737373
- **Light Background**: `neutral-50`: #fafafa
- **Dark Text**: `neutral-900`: #171717

## Department-Specific Colors

Each department has a designated color for consistency:

- **Engineering**: Blue (`#3b82f6`) - Primary blue
- **Marketing**: Purple (`#a855f7`) - Purple
- **Finance**: Green (`#22c55e`) - Success green
- **Sales**: Amber (`#f59e0b`) - Warning amber
- **HR**: Sky (`#0ea5e9`) - Info sky
- **Operations**: Red (`#ef4444`) - Error red
- **Product**: Dark Purple (`#9333ea`) - Purple-600
- **Analytics**: Dark Blue (`#2563eb`) - Primary-600

## Usage Guidelines

### Text Colors
- **Primary Text**: `#171717` (neutral-900)
- **Secondary Text**: `#525252` (neutral-600)
- **Muted Text**: `#737373` (neutral-500)
- **Inverse Text**: `#ffffff` (white on dark backgrounds)

### Background Colors
- **Primary Background**: `#ffffff` (white)
- **Secondary Background**: `#fafafa` (neutral-50)
- **Muted Background**: `#f5f5f5` (neutral-100)
- **Sidebar Background**: `#ffffff` (white) - Clean white sidebar

### Border Colors
- **Light Borders**: `#e5e5e5` (neutral-200)
- **Medium Borders**: `#d4d4d4` (neutral-300)
- **Dark Borders**: `#a3a3a3` (neutral-400)

## Accessibility Considerations

- All color combinations meet WCAG 2.1 AA contrast requirements
- Colors are distinguishable for users with color vision deficiencies
- Important information is not conveyed by color alone
- Focus states use high contrast colors for visibility

## Implementation

Colors are implemented through:
1. **Tailwind CSS classes** - Standard utility classes
2. **CSS custom properties** - For dynamic theming
3. **TypeScript constants** - For programmatic use in components
4. **Semantic color mappings** - For consistent theming across components

## Chart Colors

For data visualization, use this color sequence:
1. Primary Blue (`#3b82f6`)
2. Success Green (`#22c55e`)
3. Warning Amber (`#f59e0b`)
4. Error Red (`#ef4444`)
5. Purple (`#a855f7`)
6. Info Sky (`#0ea5e9`)

## Gradients

Common gradient combinations:
- **Primary**: `from-blue-600 to-purple-600`
- **Success**: `from-green-500 to-emerald-600`
- **Warning**: `from-amber-500 to-orange-600`
- **Error**: `from-red-500 to-pink-600`

## Best Practices

1. **Consistency**: Always use the defined color palette
2. **Hierarchy**: Use color to establish visual hierarchy
3. **Accessibility**: Ensure sufficient contrast ratios
4. **Context**: Use semantic colors appropriately (success for positive actions, error for destructive actions)
5. **Restraint**: Don't overuse bright colors; maintain balance with neutrals

## File Locations

- **Color definitions**: `src/styles/colors.ts`
- **Tailwind config**: `tailwind.config.js`
- **Component usage**: Throughout `src/components/`

This color system ensures a cohesive, professional, and accessible user interface across the entire HR Dashboard application.