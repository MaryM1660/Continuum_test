/**
 * Apple Human Interface Guidelines - Layout
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/layout
 * 
 * Система компоновки интерфейсов: контейнеры, сетки, выравнивание
 */

import { spacing, containerPadding, touchTargets } from './spacing';

// ============================================================================
// Container Sizes
// ============================================================================

/**
 * Container Sizes - Apple HIG стандарт
 * 
 * Стандартные размеры контейнеров
 */

export const containerSizes = {
  // Максимальная ширина контента
  maxContentWidth: 600,      // px (для читаемости)
  
  // Минимальная ширина
  minWidth: 320,             // px (минимальная ширина экрана iOS)
  
  // Стандартные отступы
  padding: containerPadding.default,      // 24px
  paddingHorizontal: containerPadding.horizontal, // 24px
  paddingVertical: containerPadding.vertical,     // 16px
} as const;

// ============================================================================
// Grid System (8pt Grid)
// ============================================================================

/**
 * Grid System - Apple HIG 8pt grid система
 * 
 * Используется для выравнивания и позиционирования элементов
 */

export const grid = {
  // Базовая единица сетки
  unit: 8,
  
  // Колонки (для адаптивных layout)
  columns: {
    mobile: 4,      // Мобильные устройства
    tablet: 8,      // Планшеты
    desktop: 12,    // Десктоп
  },
  
  // Gutter (промежутки между колонками)
  gutter: spacing.base,  // 16px
} as const;

// ============================================================================
// Alignment
// ============================================================================

/**
 * Alignment - Apple HIG стандарт
 * 
 * Стандартные варианты выравнивания
 */

export const alignment = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  stretch: 'stretch',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
  spaceEvenly: 'space-evenly',
} as const;

// ============================================================================
// Layout Patterns (для часто используемых случаев)
// ============================================================================

/**
 * Layout Patterns - Apple HIG стандарт
 * 
 * Паттерны компоновки для различных компонентов
 */

export const layoutPatterns = {
  // Экран (Screen)
  screen: {
    flex: 1,
    width: '100%',
    paddingHorizontal: containerSizes.paddingHorizontal,
    paddingVertical: containerSizes.paddingVertical,
  },
  
  // Контейнер контента
  contentContainer: {
    maxWidth: containerSizes.maxContentWidth,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: containerSizes.paddingHorizontal,
  },
  
  // Секция
  section: {
    width: '100%',
    marginBottom: spacing['2xl'], // 32px
    paddingHorizontal: containerSizes.paddingHorizontal,
  },
  
  // Список элементов
  list: {
    width: '100%',
    gap: spacing.base, // 16px между элементами
  },
  
  // Строка элементов (Row)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base, // 16px между элементами
  },
  
  // Колонка элементов (Column)
  column: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: spacing.base, // 16px между элементами
  },
  
  // Центрированный контент
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
} as const;

// ============================================================================
// Device Screen Dimensions
// ============================================================================

/**
 * Device Screen Dimensions - Apple HIG стандарт
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/layout#iOS-iPadOS-device-screen-dimensions
 * Размеры экранов устройств в points и pixels
 */

export interface DeviceScreenDimension {
  model: string;
  widthPt: number;
  heightPt: number;
  widthPx: number;
  heightPx: number;
  scale: number;
}

export const deviceScreenDimensions: DeviceScreenDimension[] = [
  // iPad Pro
  { model: 'iPad Pro 12.9-inch', widthPt: 1024, heightPt: 1366, widthPx: 2048, heightPx: 2732, scale: 2 },
  { model: 'iPad Pro 11-inch', widthPt: 834, heightPt: 1194, widthPx: 1668, heightPx: 2388, scale: 2 },
  { model: 'iPad Pro 10.5-inch', widthPt: 834, heightPt: 1194, widthPx: 1668, heightPx: 2388, scale: 2 },
  { model: 'iPad Pro 9.7-inch', widthPt: 768, heightPt: 1024, widthPx: 1536, heightPx: 2048, scale: 2 },
  
  // iPad Air
  { model: 'iPad Air 13-inch', widthPt: 1024, heightPt: 1366, widthPx: 2048, heightPx: 2732, scale: 2 },
  { model: 'iPad Air 11-inch', widthPt: 820, heightPt: 1180, widthPx: 1640, heightPx: 2360, scale: 2 },
  { model: 'iPad Air 10.9-inch', widthPt: 820, heightPt: 1180, widthPx: 1640, heightPx: 2360, scale: 2 },
  { model: 'iPad Air 10.5-inch', widthPt: 834, heightPt: 1112, widthPx: 1668, heightPx: 2224, scale: 2 },
  { model: 'iPad Air 9.7-inch', widthPt: 768, heightPt: 1024, widthPx: 1536, heightPx: 2048, scale: 2 },
  
  // iPad
  { model: 'iPad 11-inch', widthPt: 820, heightPt: 1180, widthPx: 1640, heightPx: 2360, scale: 2 },
  { model: 'iPad 10.2-inch', widthPt: 810, heightPt: 1080, widthPx: 1620, heightPx: 2160, scale: 2 },
  { model: 'iPad 9.7-inch', widthPt: 768, heightPt: 1024, widthPx: 1536, heightPx: 2048, scale: 2 },
  
  // iPad mini
  { model: 'iPad mini 8.3-inch', widthPt: 744, heightPt: 1133, widthPx: 1488, heightPx: 2266, scale: 2 },
  { model: 'iPad mini 7.9-inch', widthPt: 768, heightPt: 1024, widthPx: 1536, heightPx: 2048, scale: 2 },
  
  // iPhone (новые модели)
  { model: 'iPhone 17 Pro Max', widthPt: 440, heightPt: 956, widthPx: 1320, heightPx: 2868, scale: 3 },
  { model: 'iPhone 17 Pro', widthPt: 402, heightPt: 874, widthPx: 1206, heightPx: 2622, scale: 3 },
  { model: 'iPhone Air', widthPt: 420, heightPt: 912, widthPx: 1260, heightPx: 2736, scale: 3 },
  { model: 'iPhone 17', widthPt: 402, heightPt: 874, widthPx: 1206, heightPx: 2622, scale: 3 },
  { model: 'iPhone 16 Pro Max', widthPt: 440, heightPt: 956, widthPx: 1320, heightPx: 2868, scale: 3 },
  { model: 'iPhone 16 Pro', widthPt: 402, heightPt: 874, widthPx: 1206, heightPx: 2622, scale: 3 },
  { model: 'iPhone 16 Plus', widthPt: 430, heightPt: 932, widthPx: 1290, heightPx: 2796, scale: 3 },
  { model: 'iPhone 16', widthPt: 393, heightPt: 852, widthPx: 1179, heightPx: 2556, scale: 3 },
  { model: 'iPhone 16e', widthPt: 390, heightPt: 844, widthPx: 1170, heightPx: 2532, scale: 3 },
  { model: 'iPhone 15 Pro Max', widthPt: 430, heightPt: 932, widthPx: 1290, heightPx: 2796, scale: 3 },
  { model: 'iPhone 15 Pro', widthPt: 393, heightPt: 852, widthPx: 1179, heightPx: 2556, scale: 3 },
  { model: 'iPhone 15 Plus', widthPt: 430, heightPt: 932, widthPx: 1290, heightPx: 2796, scale: 3 },
  { model: 'iPhone 15', widthPt: 393, heightPt: 852, widthPx: 1179, heightPx: 2556, scale: 3 },
  { model: 'iPhone 14 Pro Max', widthPt: 430, heightPt: 932, widthPx: 1290, heightPx: 2796, scale: 3 },
  { model: 'iPhone 14 Pro', widthPt: 393, heightPt: 852, widthPx: 1179, heightPx: 2556, scale: 3 },
  { model: 'iPhone 14 Plus', widthPt: 428, heightPt: 926, widthPx: 1284, heightPx: 2778, scale: 3 },
  { model: 'iPhone 14', widthPt: 390, heightPt: 844, widthPx: 1170, heightPx: 2532, scale: 3 },
  { model: 'iPhone 13 Pro Max', widthPt: 428, heightPt: 926, widthPx: 1284, heightPx: 2778, scale: 3 },
  { model: 'iPhone 13 Pro', widthPt: 390, heightPt: 844, widthPx: 1170, heightPx: 2532, scale: 3 },
  { model: 'iPhone 13', widthPt: 390, heightPt: 844, widthPx: 1170, heightPx: 2532, scale: 3 },
  { model: 'iPhone 13 mini', widthPt: 375, heightPt: 812, widthPx: 1125, heightPx: 2436, scale: 3 },
  { model: 'iPhone 12 Pro Max', widthPt: 428, heightPt: 926, widthPx: 1284, heightPx: 2778, scale: 3 },
  { model: 'iPhone 12 Pro', widthPt: 390, heightPt: 844, widthPx: 1170, heightPx: 2532, scale: 3 },
  { model: 'iPhone 12', widthPt: 390, heightPt: 844, widthPx: 1170, heightPx: 2532, scale: 3 },
  { model: 'iPhone 12 mini', widthPt: 375, heightPt: 812, widthPx: 1125, heightPx: 2436, scale: 3 },
  { model: 'iPhone 11 Pro Max', widthPt: 414, heightPt: 896, widthPx: 1242, heightPx: 2688, scale: 3 },
  { model: 'iPhone 11 Pro', widthPt: 375, heightPt: 812, widthPx: 1125, heightPx: 2436, scale: 3 },
  { model: 'iPhone 11', widthPt: 414, heightPt: 896, widthPx: 828, heightPx: 1792, scale: 2 },
  { model: 'iPhone XS Max', widthPt: 414, heightPt: 896, widthPx: 1242, heightPx: 2688, scale: 3 },
  { model: 'iPhone XS', widthPt: 375, heightPt: 812, widthPx: 1125, heightPx: 2436, scale: 3 },
  { model: 'iPhone XR', widthPt: 414, heightPt: 896, widthPx: 828, heightPx: 1792, scale: 2 },
  { model: 'iPhone X', widthPt: 375, heightPt: 812, widthPx: 1125, heightPx: 2436, scale: 3 },
  { model: 'iPhone 8 Plus', widthPt: 414, heightPt: 736, widthPx: 1080, heightPx: 1920, scale: 3 },
  { model: 'iPhone 8', widthPt: 375, heightPt: 667, widthPx: 750, heightPx: 1334, scale: 2 },
  { model: 'iPhone 7 Plus', widthPt: 414, heightPt: 736, widthPx: 1080, heightPx: 1920, scale: 3 },
  { model: 'iPhone 7', widthPt: 375, heightPt: 667, widthPx: 750, heightPx: 1334, scale: 2 },
  { model: 'iPhone 6s Plus', widthPt: 414, heightPt: 736, widthPx: 1080, heightPx: 1920, scale: 3 },
  { model: 'iPhone 6s', widthPt: 375, heightPt: 667, widthPx: 750, heightPx: 1334, scale: 2 },
  { model: 'iPhone 6 Plus', widthPt: 414, heightPt: 736, widthPx: 1080, heightPx: 1920, scale: 3 },
  { model: 'iPhone 6', widthPt: 375, heightPt: 667, widthPx: 750, heightPx: 1334, scale: 2 },
  { model: 'iPhone SE 4.7-inch', widthPt: 375, heightPt: 667, widthPx: 750, heightPx: 1334, scale: 2 },
  { model: 'iPhone SE 4-inch', widthPt: 320, heightPt: 568, widthPx: 640, heightPx: 1136, scale: 2 },
  { model: 'iPod touch 5th generation and later', widthPt: 320, heightPt: 568, widthPx: 640, heightPx: 1136, scale: 2 },
] as const;

// ============================================================================
// Size Classes
// ============================================================================

/**
 * Size Classes - Apple HIG стандарт
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/layout#iOS-iPadOS-device-size-classes
 * Size classes определяют, является ли ширина/высота Regular или Compact
 */

export type SizeClass = 'regular' | 'compact';

export interface DeviceSizeClass {
  model: string;
  portrait: {
    width: SizeClass;
    height: SizeClass;
  };
  landscape: {
    width: SizeClass;
    height: SizeClass;
  };
}

export const deviceSizeClasses: DeviceSizeClass[] = [
  // iPad - все Regular
  { model: 'iPad Pro 12.9-inch', portrait: { width: 'regular', height: 'regular' }, landscape: { width: 'regular', height: 'regular' } },
  { model: 'iPad Pro 11-inch', portrait: { width: 'regular', height: 'regular' }, landscape: { width: 'regular', height: 'regular' } },
  { model: 'iPad Pro 10.5-inch', portrait: { width: 'regular', height: 'regular' }, landscape: { width: 'regular', height: 'regular' } },
  { model: 'iPad Air 13-inch', portrait: { width: 'regular', height: 'regular' }, landscape: { width: 'regular', height: 'regular' } },
  { model: 'iPad Air 11-inch', portrait: { width: 'regular', height: 'regular' }, landscape: { width: 'regular', height: 'regular' } },
  { model: 'iPad 11-inch', portrait: { width: 'regular', height: 'regular' }, landscape: { width: 'regular', height: 'regular' } },
  { model: 'iPad 9.7-inch', portrait: { width: 'regular', height: 'regular' }, landscape: { width: 'regular', height: 'regular' } },
  { model: 'iPad mini 7.9-inch', portrait: { width: 'regular', height: 'regular' }, landscape: { width: 'regular', height: 'regular' } },
  
  // iPhone - большинство Compact, но некоторые Plus/Max имеют Regular width в landscape
  { model: 'iPhone 17 Pro Max', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone 17 Pro', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone Air', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone 17', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 16 Pro Max', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone 16 Pro', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 16 Plus', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone 16', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 16e', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 15 Pro Max', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone 15 Pro', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 15 Plus', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone 15', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 14 Pro Max', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone 14 Pro', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 14 Plus', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone 14', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 13 Pro Max', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone 13 Pro', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 13', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 13 mini', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 12 Pro Max', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone 12 Pro', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 12', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 12 mini', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 11 Pro Max', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone 11 Pro', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 11', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone XS Max', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone XS', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone XR', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone X', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 8 Plus', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone 8', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 7 Plus', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone 7', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone 6s Plus', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'regular', height: 'compact' } },
  { model: 'iPhone 6s', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPhone SE', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
  { model: 'iPod touch 5th generation and later', portrait: { width: 'compact', height: 'regular' }, landscape: { width: 'compact', height: 'compact' } },
] as const;

// ============================================================================
// watchOS Device Screen Dimensions
// ============================================================================

/**
 * watchOS Device Screen Dimensions - Apple HIG стандарт
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/layout#watchOS-device-screen-dimensions
 * Размеры экранов Apple Watch в pixels
 */

export interface WatchScreenDimension {
  series: string;
  size: string;
  widthPx: number;
  heightPx: number;
}

export const watchScreenDimensions: WatchScreenDimension[] = [
  { series: 'Apple Watch Ultra (3rd generation)', size: '49mm', widthPx: 422, heightPx: 514 },
  { series: '10, 11', size: '42mm', widthPx: 374, heightPx: 446 },
  { series: '10, 11', size: '46mm', widthPx: 416, heightPx: 496 },
  { series: 'Apple Watch Ultra (1st and 2nd generations)', size: '49mm', widthPx: 410, heightPx: 502 },
  { series: '7, 8, and 9', size: '41mm', widthPx: 352, heightPx: 430 },
  { series: '7, 8, and 9', size: '45mm', widthPx: 396, heightPx: 484 },
  { series: '4, 5, 6, and SE (all generations)', size: '40mm', widthPx: 324, heightPx: 394 },
  { series: '4, 5, 6, and SE (all generations)', size: '44mm', widthPx: 368, heightPx: 448 },
  { series: '1, 2, and 3', size: '38mm', widthPx: 272, heightPx: 340 },
  { series: '1, 2, and 3', size: '42mm', widthPx: 312, heightPx: 390 },
] as const;

// ============================================================================
// tvOS Safe Area
// ============================================================================

/**
 * tvOS Safe Area - Apple HIG стандарт
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/layout#tvOS
 * Inset primary content 60 points from the top and bottom of the screen,
 * and 80 points from the sides.
 */

export const tvOSSafeArea = {
  top: 60,      // pt
  bottom: 60,   // pt
  left: 80,     // pt
  right: 80,    // pt
} as const;

// ============================================================================
// tvOS Grids
// ============================================================================

/**
 * tvOS Grids - Apple HIG стандарт
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/layout#Grids
 * Grid layouts для Apple TV (two-column through nine-column)
 */

export interface TVOSGrid {
  name: string;
  unfocusedContentWidth: number;  // pt
  horizontalSpacing: number;      // pt
  minimumVerticalSpacing: number; // pt
}

export const tvOSGrids: TVOSGrid[] = [
  { name: 'two-column', unfocusedContentWidth: 860, horizontalSpacing: 40, minimumVerticalSpacing: 100 },
  { name: 'three-column', unfocusedContentWidth: 560, horizontalSpacing: 40, minimumVerticalSpacing: 100 },
  { name: 'four-column', unfocusedContentWidth: 410, horizontalSpacing: 40, minimumVerticalSpacing: 100 },
  { name: 'five-column', unfocusedContentWidth: 320, horizontalSpacing: 40, minimumVerticalSpacing: 100 },
  { name: 'six-column', unfocusedContentWidth: 260, horizontalSpacing: 40, minimumVerticalSpacing: 100 },
  { name: 'seven-column', unfocusedContentWidth: 217, horizontalSpacing: 40, minimumVerticalSpacing: 100 },
  { name: 'eight-column', unfocusedContentWidth: 184, horizontalSpacing: 40, minimumVerticalSpacing: 100 },
  { name: 'nine-column', unfocusedContentWidth: 160, horizontalSpacing: 40, minimumVerticalSpacing: 100 },
] as const;

// ============================================================================
// Safe Area
// ============================================================================

/**
 * Safe Area - Apple HIG стандарт
 * 
 * Отступы для безопасных зон (notch, status bar, etc.)
 * Для iOS/iPadOS/macOS/visionOS
 * Для tvOS используйте tvOSSafeArea
 */

export const safeArea = {
  // Стандартные отступы для safe area (iOS/iPadOS/macOS/visionOS)
  top: spacing.xl,      // 24px
  bottom: spacing.xl,   // 24px
  left: spacing.xl,     // 24px
  right: spacing.xl,    // 24px
} as const;

