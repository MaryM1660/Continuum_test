/**
 * Apple Human Interface Guidelines - Images
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/images
 * 
 * Спецификации для изображений: scale factors, форматы, размеры экранов
 */

// ============================================================================
// Scale Factors
// ============================================================================

/**
 * Scale Factors - Apple HIG стандарт
 * 
 * Источник: Таблица "Platform/Scale factors" из Images HIG
 * Scale factor определяет разрешение изображения (1x, 2x, 3x)
 */

export interface PlatformScaleFactor {
  platform: string;
  scaleFactors: number[];
}

export const platformScaleFactors: PlatformScaleFactor[] = [
  { platform: 'iOS', scaleFactors: [1, 2, 3] },
  { platform: 'iPadOS', scaleFactors: [1, 2] },
  { platform: 'macOS', scaleFactors: [1, 2] },
  { platform: 'tvOS', scaleFactors: [1, 2] },
  { platform: 'visionOS', scaleFactors: [1, 2] },
  { platform: 'watchOS', scaleFactors: [2] },
] as const;

// ============================================================================
// Image Formats
// ============================================================================

/**
 * Image Formats - Apple HIG стандарт
 * 
 * Источник: Таблица "Image type/Format" из Images HIG
 * Рекомендуемые форматы для различных типов изображений
 */

export interface ImageFormat {
  imageType: string;
  format: string;
  notes?: string;
}

export const imageFormats: ImageFormat[] = [
  { imageType: 'App Icon', format: 'PNG', notes: '1024x1024 for App Store' },
  { imageType: 'Launch Screen', format: 'PNG or PDF', notes: 'Vector PDF preferred' },
  { imageType: 'UI Elements', format: 'PNG or PDF', notes: 'Vector PDF for scalable elements' },
  { imageType: 'Photos', format: 'JPEG or HEIF', notes: 'HEIF for better compression' },
  { imageType: 'Illustrations', format: 'PDF or SVG', notes: 'Vector formats preferred' },
] as const;

// ============================================================================
// Screen Sizes and Image Scales
// ============================================================================

/**
 * Screen Sizes and Image Scales - Apple HIG стандарт
 * 
 * Источник: Таблица "Screen size/Image scale" из Images HIG
 * Соответствие размеров экранов и scale factors для изображений
 */

export interface ScreenImageScale {
  screenSize: string;
  imageScale: string;
  notes?: string;
}

export const screenImageScales: ScreenImageScale[] = [
  { screenSize: 'iPhone (standard)', imageScale: '@2x, @3x', notes: 'Most iPhones use @3x' },
  { screenSize: 'iPhone (Plus/Max)', imageScale: '@3x', notes: 'High resolution displays' },
  { screenSize: 'iPad', imageScale: '@2x', notes: 'All iPad models' },
  { screenSize: 'Mac (Retina)', imageScale: '@2x', notes: 'Retina displays' },
  { screenSize: 'Mac (non-Retina)', imageScale: '@1x', notes: 'Standard displays' },
  { screenSize: 'Apple TV', imageScale: '@2x', notes: '4K displays' },
  { screenSize: 'Apple Watch', imageScale: '@2x', notes: 'All watch models' },
  { screenSize: 'visionOS', imageScale: '@2x', notes: 'High resolution displays' },
] as const;

// ============================================================================
// Image Size Patterns (для часто используемых случаев)
// ============================================================================

/**
 * Image Size Patterns - Apple HIG стандарт
 * 
 * Стандартные размеры для различных типов изображений
 */

export const imageSizePatterns = {
  // App Icons
  appIcon: {
    appStore: { width: 1024, height: 1024, format: 'PNG' },
    ios: { width: 180, height: 180, format: 'PNG', scale: 3 }, // @3x
    ipados: { width: 1024, height: 1024, format: 'PNG', scale: 2 }, // @2x
    macos: { width: 1024, height: 1024, format: 'PNG', scale: 2 }, // @2x
  },
  
  // Launch Screens
  launchScreen: {
    ios: { width: 1242, height: 2688, format: 'PNG or PDF' }, // iPhone 11 Pro Max @3x
    ipados: { width: 2048, height: 2732, format: 'PNG or PDF' }, // iPad Pro 12.9 @2x
  },
  
  // UI Elements (стандартные размеры)
  uiElements: {
    button: { width: 44, height: 44, format: 'PNG or PDF', scale: 3 }, // @3x для iOS
    icon: { width: 30, height: 30, format: 'PNG or PDF', scale: 3 }, // @3x для iOS
    thumbnail: { width: 150, height: 150, format: 'JPEG or PNG', scale: 2 }, // @2x
  },
} as const;

// ============================================================================
// Image Optimization Guidelines
// ============================================================================

/**
 * Image Optimization Guidelines - Apple HIG стандарт
 * 
 * Рекомендации по оптимизации изображений
 */

export const imageOptimization = {
  // Максимальные размеры для различных типов
  maxSizes: {
    appIcon: { width: 1024, height: 1024 },
    launchScreen: { width: 2048, height: 2732 }, // iPad Pro 12.9 @2x
    uiElement: { width: 132, height: 132 }, // 44pt @3x
  },
  
  // Рекомендуемые форматы
  recommendedFormats: {
    appIcon: 'PNG',
    launchScreen: 'PDF', // Vector preferred
    uiElement: 'PDF', // Vector preferred
    photo: 'HEIF', // Better compression than JPEG
    illustration: 'PDF or SVG', // Vector formats
  },
  
  // Compression guidelines
  compression: {
    png: { quality: 'lossless', notes: 'Use for icons and UI elements' },
    jpeg: { quality: 0.8, notes: 'Use for photos, balance quality and size' },
    heif: { quality: 0.8, notes: 'Better compression than JPEG, iOS 11+' },
    pdf: { quality: 'vector', notes: 'Scalable, no quality loss' },
  },
} as const;

