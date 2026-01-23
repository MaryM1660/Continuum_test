/**
 * Apple Human Interface Guidelines - Complete Theme
 * 
 * Главный файл темы, объединяющий все стили из Apple HIG
 * Создан строго по официальным гайдлайнам Apple
 */

import {
  systemColorsLight,
  systemColorsDark,
  labelColorsLight,
  labelColorsDark,
  backgroundColorsLight,
  backgroundColorsDark,
  separatorColorsLight,
  separatorColorsDark,
  liquidGlassColors,
  semanticColorsLight,
  semanticColorsDark,
} from './colors';
import {
  textStyles,
  emphasizedTextStyles,
  fontFamilies,
  fontWeights,
} from './typography';
import {
  spacing,
  containerPadding,
  touchTargets,
  spacingPatterns,
} from './spacing';
import {
  borderRadius,
  borderRadiusPatterns,
} from './borderRadius';
import {
  liquidGlass,
  materialTypes,
  materialPatterns,
} from './materials';
import {
  externalShadows,
  internalShadows,
  combinedShadows,
  shadowPatterns,
} from './shadows';
import {
  containerSizes,
  grid,
  alignment,
  layoutPatterns,
  safeArea,
  deviceScreenDimensions,
  deviceSizeClasses,
  watchScreenDimensions,
  tvOSSafeArea,
  tvOSGrids,
  type DeviceScreenDimension,
  type DeviceSizeClass,
  type WatchScreenDimension,
  type TVOSGrid,
  type SizeClass,
} from './layout';

// ============================================================================
// Theme Type
// ============================================================================

export type ColorScheme = 'light' | 'dark' | 'auto';

export interface AppleHIGTheme {
  // Color Scheme
  colorScheme: ColorScheme;
  isDark: boolean;
  
  // Colors
  colors: {
    // System Colors
    system: typeof systemColorsLight;
    
    // Label Colors
    label: typeof labelColorsLight;
    
    // Background Colors
    background: typeof backgroundColorsLight;
    
    // Separator Colors
    separator: typeof separatorColorsLight;
    
    // Semantic Colors (для удобства)
    primary: string;
    primaryDark: string;
    primaryLight: string;
    primaryContrast: string;
    error: string;
    errorLight: string;
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    info: string;
    infoLight: string;
    
    // Text Colors (алиасы для удобства)
    text: string;
    textSecondary: string;
    textTertiary: string;
    textDisabled: string;
    
    // Background Colors (алиасы для удобства)
    background: string;
    surface: string;
    surfaceElevated: string;
    surfaceHover: string;
    
    // Border Colors (алиасы для удобства)
    border: string;
    divider: string;
    borderLight: string;
  };
  
  // Typography
  typography: {
    // Text Styles
    largeTitle: typeof textStyles.largeTitle;
    title1: typeof textStyles.title1;
    title2: typeof textStyles.title2;
    title3: typeof textStyles.title3;
    headline: typeof textStyles.headline;
    body: typeof textStyles.body;
    callout: typeof textStyles.callout;
    subheadline: typeof textStyles.subheadline;
    footnote: typeof textStyles.footnote;
    caption1: typeof textStyles.caption1;
    caption2: typeof textStyles.caption2;
    
    // Emphasized Variants
    emphasized: typeof emphasizedTextStyles;
    
    // Font Families
    fontFamilies: typeof fontFamilies;
    
    // Font Weights
    fontWeights: typeof fontWeights;
  };
  
  // Spacing
  spacing: typeof spacing;
  containerPadding: typeof containerPadding;
  touchTargets: typeof touchTargets;
  spacingPatterns: typeof spacingPatterns;
  
  // Border Radius
  borderRadius: typeof borderRadius;
  borderRadiusPatterns: typeof borderRadiusPatterns;
  
  // Materials
  materials: {
    liquidGlass: typeof liquidGlass;
    materialTypes: typeof materialTypes;
    materialPatterns: typeof materialPatterns;
  };
  
  // Shadows
  shadows: {
    external: typeof externalShadows;
    internal: typeof internalShadows;
    combined: typeof combinedShadows;
    patterns: typeof shadowPatterns;
  };
  
  // Layout
  layout: {
    containerSizes: typeof containerSizes;
    grid: typeof grid;
    alignment: typeof alignment;
    patterns: typeof layoutPatterns;
    safeArea: typeof safeArea;
    deviceScreenDimensions: typeof deviceScreenDimensions;
    deviceSizeClasses: typeof deviceSizeClasses;
    watchScreenDimensions: typeof watchScreenDimensions;
    tvOSSafeArea: typeof tvOSSafeArea;
    tvOSGrids: typeof tvOSGrids;
  };
}

// ============================================================================
// Create Theme Function
// ============================================================================

/**
 * Создает тему на основе Apple HIG
 * 
 * @param colorScheme - 'light', 'dark' или 'auto'
 * @param systemColorScheme - системная цветовая схема (для 'auto' режима)
 * @returns Полная тема Apple HIG
 */
export function createAppleHIGTheme(
  colorScheme: ColorScheme = 'auto',
  systemColorScheme?: 'light' | 'dark' | null
): AppleHIGTheme {
  // Определяем, используется ли темная тема
  const isDark = colorScheme === 'auto' 
    ? (systemColorScheme === 'dark')
    : colorScheme === 'dark';
  
  // Выбираем цвета в зависимости от темы
  const systemColors = isDark ? systemColorsDark : systemColorsLight;
  const labelColors = isDark ? labelColorsDark : labelColorsLight;
  const backgroundColors = isDark ? backgroundColorsDark : backgroundColorsLight;
  const separatorColors = isDark ? separatorColorsDark : separatorColorsLight;
  const semanticColors = isDark ? semanticColorsDark : semanticColorsLight;
  
  return {
    colorScheme,
    isDark,
    
    colors: {
      // System Colors
      system: systemColors,
      
      // Label Colors
      label: labelColors,
      
      // Background Colors
      background: backgroundColors,
      
      // Separator Colors
      separator: separatorColors,
      
      // Semantic Colors
      primary: semanticColors.primary,
      primaryDark: isDark ? '#0066CC' : '#005BCC',
      primaryLight: '#3399FF',
      primaryContrast: '#FFFFFF',
      error: semanticColors.error,
      errorLight: isDark ? '#660000' : '#FFCCCB',
      success: semanticColors.success,
      successLight: isDark ? '#004D00' : '#D4EDDA',
      warning: semanticColors.warning,
      warningLight: isDark ? '#4D3900' : '#FFF3CD',
      info: semanticColors.info,
      infoLight: isDark ? '#003366' : '#CCE0FF',
      
      // Text Colors (алиасы)
      text: labelColors.label,
      textSecondary: labelColors.secondaryLabel,
      textTertiary: labelColors.tertiaryLabel,
      textDisabled: labelColors.quaternaryLabel,
      
      // Background Colors (алиасы)
      background: backgroundColors.systemBackground,
      surface: backgroundColors.secondarySystemBackground,
      surfaceElevated: backgroundColors.tertiarySystemBackground,
      surfaceHover: isDark ? '#3A3A3C' : '#E5E5EA',
      
      // Border Colors (алиасы)
      border: separatorColors.separator,
      divider: separatorColors.separator,
      borderLight: separatorColors.opaqueSeparator,
    },
    
    typography: {
      largeTitle: textStyles.largeTitle,
      title1: textStyles.title1,
      title2: textStyles.title2,
      title3: textStyles.title3,
      headline: textStyles.headline,
      body: textStyles.body,
      callout: textStyles.callout,
      subheadline: textStyles.subheadline,
      footnote: textStyles.footnote,
      caption1: textStyles.caption1,
      caption2: textStyles.caption2,
      
      emphasized: emphasizedTextStyles,
      
      fontFamilies,
      fontWeights,
    },
    
    spacing,
    containerPadding,
    touchTargets,
    spacingPatterns,
    
    borderRadius,
    borderRadiusPatterns,
    
    materials: {
      liquidGlass,
      materialTypes,
      materialPatterns,
    },
    
    shadows: {
      external: externalShadows,
      internal: internalShadows,
      combined: combinedShadows,
      patterns: shadowPatterns,
    },
    
    layout: {
      containerSizes,
      grid,
      alignment,
      patterns: layoutPatterns,
      safeArea,
      deviceScreenDimensions,
      deviceSizeClasses,
      watchScreenDimensions,
      tvOSSafeArea,
      tvOSGrids,
    },
  };
}

