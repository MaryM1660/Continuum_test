# Полное справочное руководство по Apple Human Interface Guidelines

Этот документ содержит краткое содержание всех статей из официальных гайдлайнов Apple Human Interface Guidelines с указанием ключевых значений, полей для кода и прямых ссылок.

**Источник:** https://developer.apple.com/design/human-interface-guidelines/

**Дата создания:** 2026-01-23

---

## Содержание

1. [Design Fundamentals](#design-fundamentals)
2. [Getting Started](#getting-started)
3. [Foundations](#foundations)
4. [Patterns](#patterns)
5. [Components](#components)
6. [Inputs](#inputs)
7. [Technologies](#technologies)
8. [New and Updated](#new-and-updated)

---

## Design Fundamentals

### App icons
**URL:** https://developer.apple.com/design/human-interface-guidelines/app-icons

**Описание:** Руководство по созданию иконок приложений для всех платформ Apple.

**Ключевые значения:**
- Размеры иконок для разных платформ
- Требования к прозрачности и форматам
- Динамические свойства иконок
- Адаптация для светлой и темной темы

**Поля для кода:**
- `appIconSize`: размеры иконок (1024x1024 для App Store, различные для устройств)
- `iconCornerRadius`: радиус скругления углов
- `iconFormat`: формат файла (PNG, PDF, SVG)
- `dynamicProperties`: динамические свойства (цвет, форма)

---

### Color
**URL:** https://developer.apple.com/design/human-interface-guidelines/color

**Описание:** Принципы использования цвета в приложениях Apple, включая системные цвета, адаптацию для светлой/темной темы и Liquid Glass.

**Ключевые значения:**

**System Colors (Light Mode):**
- `System Blue`: `#007AFF`
- `System Green`: `#34C759`
- `System Indigo`: `#5856D6`
- `System Orange`: `#FF9500`
- `System Pink`: `#FF2D55`
- `System Purple`: `#AF52DE`
- `System Red`: `#FF3B30`
- `System Teal`: `#5AC8FA`
- `System Yellow`: `#FFCC00`
- `System Gray`: `#8E8E93`
- `System Gray 2`: `#AEAEB2`
- `System Gray 3`: `#C7C7CC`
- `System Gray 4`: `#D1D1D6`
- `System Gray 5`: `#E5E5EA`
- `System Gray 6`: `#F2F2F7`

**System Colors (Dark Mode):**
- `System Blue`: `#0A84FF`
- `System Green`: `#32D74B`
- `System Indigo`: `#5E5CE6`
- `System Orange`: `#FF9F0A`
- `System Pink`: `#FF375F`
- `System Purple`: `#BF5AF2`
- `System Red`: `#FF453A`
- `System Teal`: `#64D2FF`
- `System Yellow`: `#FFD60A`
- `System Gray`: `#8E8E93`
- `System Gray 2`: `#636366`
- `System Gray 3`: `#48484A`
- `System Gray 4`: `#3A3A3C`
- `System Gray 5`: `#2C2C2E`
- `System Gray 6`: `#1C1C1E`

**Label Colors:**
- `Label`: основной текст (`#000000` light, `#FFFFFF` dark)
- `Secondary Label`: вторичный текст (60% opacity от Label)
- `Tertiary Label`: третичный текст (30% opacity от Label)
- `Quaternary Label`: четвертичный текст (18% opacity от Label)

**Background Colors:**
- `System Background`: `#FFFFFF` (light), `#000000` (dark)
- `Secondary System Background`: `#F2F2F7` (light), `#1C1C1E` (dark)
- `Tertiary System Background`: `#FFFFFF` (light), `#2C2C2E` (dark)

**Separator Colors:**
- `Separator`: `#C6C6C8` (light), `#38383A` (dark)
- `Opaque Separator`: `#C6C6C8` (light), `#38383A` (dark)

**Liquid Glass:**
- `backdropFilter`: `blur(18px) saturate(180%)`
- `backgroundColor`: `rgba(255, 255, 255, 0.12-0.2)` для светлой темы
- `borderColor`: `rgba(255, 255, 255, 0.2)`
- `borderWidth`: `1.5px`
- `boxShadow`: внутренние и внешние тени для глубины
- `highlight`: `rgba(255, 255, 255, 0.3)` верхний блик

**Поля для кода:**
```typescript
// System Colors
primary: '#007AFF' | '#0A84FF'
error: '#FF3B30' | '#FF453A'
success: '#34C759' | '#32D74B'
warning: '#FF9500' | '#FF9F0A'

// Backgrounds
background: '#FFFFFF' | '#000000'
surface: '#F2F2F7' | '#1C1C1E'
surfaceElevated: '#FFFFFF' | '#2C2C2E'

// Text Colors
text: '#000000' | '#FFFFFF'
textSecondary: '#3C3C43' | '#EBEBF5' (60% opacity)
textTertiary: '#3C3C43' | '#EBEBF5' (30% opacity)

// Separators
divider: '#C6C6C8' | '#38383A'
border: '#C6C6C8' | '#38383A'

// Liquid Glass
backdropFilter: 'blur(18px) saturate(180%)'
glassBackground: 'rgba(255, 255, 255, 0.12-0.2)'
glassBorder: 'rgba(255, 255, 255, 0.2)'
glassHighlight: 'rgba(255, 255, 255, 0.3)'
```

---

### Materials
**URL:** https://developer.apple.com/design/human-interface-guidelines/materials

**Описание:** Руководство по использованию материалов (Materials) в интерфейсах, включая Liquid Glass и другие эффекты прозрачности.

**Ключевые значения:**
- Типы материалов: Liquid Glass, Blur, Translucency
- Параметры размытия и прозрачности
- Адаптация материалов для разных контекстов

**Поля для кода:**
- `materialType`: тип материала (liquidGlass, blur, translucent)
- `blurRadius`: радиус размытия (18px для Liquid Glass)
- `saturation`: насыщенность (180% для Liquid Glass)
- `opacity`: прозрачность фона (0.12-0.2)
- `vibrancy`: вибрация цвета

---

### Layout
**URL:** https://developer.apple.com/design/human-interface-guidelines/layout

**Описание:** Принципы компоновки интерфейсов, включая сетки, отступы, выравнивание и адаптивность.

**Ключевые значения:**

**Spacing Grid (8pt система):**
- `xs`: 4px (0.5x grid)
- `sm`: 8px (1x grid)
- `md`: 12px (1.5x grid)
- `base`: 16px (2x grid)
- `lg`: 20px (2.5x grid)
- `xl`: 24px (3x grid)
- `2xl`: 32px (4x grid)
- `3xl`: 40px (5x grid)
- `4xl`: 48px (6x grid - минимальный touch target)
- `5xl`: 64px (8x grid)
- `6xl`: 80px (10x grid)
- `7xl`: 96px (12x grid)

**Container Padding:**
- `containerPadding`: 24px
- `containerPaddingHorizontal`: 24px
- `containerPaddingVertical`: 16px

**Touch Targets:**
- `minTouchTarget`: 48px (iOS/Android minimum)
- `recommendedTouchTarget`: 44px (iOS)

**Border Radius:**
- `small`: 8px
- `medium`: 12px
- `large`: 16px
- `xlarge`: 20px
- `round`: 50% (круглые элементы)

**Поля для кода:**
```typescript
// Spacing
spacing: {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
  '7xl': 96,
}

// Touch Targets
minTouchTarget: 48
recommendedTouchTarget: 44

// Border Radius
borderRadius: {
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 20,
  round: '50%',
}
```

---

### Icons
**URL:** https://developer.apple.com/design/human-interface-guidelines/icons

**Описание:** Руководство по созданию и использованию иконок в приложениях, включая SF Symbols.

**Ключевые значения:**
- Размеры иконок для разных контекстов
- Стили иконок (filled, outlined)
- Цвета иконок
- SF Symbols библиотека

**Поля для кода:**
- `iconSize`: размеры (16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96, 128)
- `iconStyle`: стиль (filled, outlined)
- `iconWeight`: толщина (ultralight, thin, light, regular, medium, semibold, bold, heavy, black)
- `iconColor`: цвет иконки (system colors или custom)

---

### Accessibility
**URL:** https://developer.apple.com/design/human-interface-guidelines/accessibility

**Описание:** Руководство по обеспечению доступности приложений для всех пользователей.

**Ключевые значения:**
- Минимальные размеры touch targets (44x44pt)
- Контрастность текста (WCAG AA: 4.5:1 для обычного текста, 3:1 для крупного)
- Динамический тип (Dynamic Type)
- VoiceOver поддержка
- Цветовая доступность (не полагаться только на цвет)

**Поля для кода:**
- `minTouchTarget`: 44x44pt
- `textContrastRatio`: 4.5:1 (обычный текст), 3:1 (крупный текст)
- `dynamicTypeSizes`: поддержка всех размеров Dynamic Type
- `accessibilityLabel`: метки для VoiceOver
- `accessibilityHint`: подсказки для VoiceOver
- `accessibilityTraits`: характеристики элементов

---

## Getting Started

### Designing for iOS
**URL:** https://developer.apple.com/design/human-interface-guidelines/designing-for-ios

**Описание:** Специфические рекомендации по дизайну для iOS приложений.

**Ключевые значения:**
- Размеры экранов iOS
- Safe Area insets
- Navigation patterns
- Gesture support

---

### Designing for iPadOS
**URL:** https://developer.apple.com/design/human-interface-guidelines/designing-for-ipados

**Описание:** Специфические рекомендации по дизайну для iPadOS приложений.

**Ключевые значения:**
- Размеры экранов iPad
- Multitasking support
- Pointer support
- Keyboard shortcuts

---

### Designing for macOS
**URL:** https://developer.apple.com/design/human-interface-guidelines/designing-for-macos

**Описание:** Специфические рекомендации по дизайну для macOS приложений.

**Ключевые значения:**
- Window management
- Menu bar integration
- Keyboard navigation
- Mouse and trackpad support

---

### Designing for tvOS
**URL:** https://developer.apple.com/design/human-interface-guidelines/designing-for-tvos

**Описание:** Специфические рекомендации по дизайну для tvOS приложений.

**Ключевые значения:**
- Focus management
- Remote control support
- Large screen layouts
- Parallax effects

---

### Designing for visionOS
**URL:** https://developer.apple.com/design/human-interface-guidelines/designing-for-visionos

**Описание:** Специфические рекомендации по дизайну для visionOS приложений.

**Ключевые значения:**
- 3D пространство
- Hand tracking
- Eye tracking
- Spatial audio

---

### Designing for watchOS
**URL:** https://developer.apple.com/design/human-interface-guidelines/designing-for-watchos

**Описание:** Специфические рекомендации по дизайну для watchOS приложений.

**Ключевые значения:**
- Маленькие экраны
- Digital Crown support
- Complications
- Quick interactions

---

### Designing for games
**URL:** https://developer.apple.com/design/human-interface-guidelines/designing-for-games

**Описание:** Специфические рекомендации по дизайну игр для платформ Apple.

**Ключевые значения:**
- Game Center integration
- Controller support
- Performance optimization
- Immersive experiences

---

## Foundations

**URL:** https://developer.apple.com/design/human-interface-guidelines/foundations

**Описание:** Основные принципы и фундаментальные элементы дизайна. Поймите, как фундаментальные элементы дизайна помогают создавать богатые впечатления.

**Статьи:**

1. **Accessibility** - https://developer.apple.com/design/human-interface-guidelines/accessibility
2. **App icons** - https://developer.apple.com/design/human-interface-guidelines/app-icons
3. **Branding** - https://developer.apple.com/design/human-interface-guidelines/branding
4. **Color** - https://developer.apple.com/design/human-interface-guidelines/color (уже описано выше в Design Fundamentals)
5. **Dark Mode** - https://developer.apple.com/design/human-interface-guidelines/dark-mode
6. **Icons** - https://developer.apple.com/design/human-interface-guidelines/icons (уже описано выше в Design Fundamentals)
7. **Images** - https://developer.apple.com/design/human-interface-guidelines/images
8. **Immersive experiences** - https://developer.apple.com/design/human-interface-guidelines/immersive-experiences
9. **Inclusion** - https://developer.apple.com/design/human-interface-guidelines/inclusion
10. **Layout** - https://developer.apple.com/design/human-interface-guidelines/layout (уже описано выше в Design Fundamentals)
11. **Materials** - https://developer.apple.com/design/human-interface-guidelines/materials (уже описано выше в Design Fundamentals)
12. **Motion** - https://developer.apple.com/design/human-interface-guidelines/motion
13. **Privacy** - https://developer.apple.com/design/human-interface-guidelines/privacy
14. **Right to left** - https://developer.apple.com/design/human-interface-guidelines/right-to-left
15. **SF Symbols** - https://developer.apple.com/design/human-interface-guidelines/sf-symbols
16. **Spatial layout** - https://developer.apple.com/design/human-interface-guidelines/spatial-layout
17. **Typography** - https://developer.apple.com/design/human-interface-guidelines/typography (уже описано выше с детальными значениями)
18. **Writing** - https://developer.apple.com/design/human-interface-guidelines/writing

*[Требуется детальное изучение каждой статьи]*

---

### Typography
**URL:** https://developer.apple.com/design/human-interface-guidelines/typography

**Описание:** Руководство по типографике в приложениях Apple, включая системные шрифты, Dynamic Type, размеры и веса шрифтов.

**Ключевые значения:**

**Минимальные размеры шрифтов по платформам:**
- **iOS, iPadOS**: Default: 17pt, Minimum: 11pt
- **macOS**: Default: 13pt, Minimum: 10pt
- **tvOS**: Default: 29pt, Minimum: 23pt
- **visionOS**: Default: 17pt, Minimum: 12pt
- **watchOS**: Default: 16pt, Minimum: 12pt

**iOS/iPadOS Dynamic Type Text Styles (xSmall - xxxLarge):**

**xSmall:**
- Large Title: 31pt / 38pt leading / Regular / Bold (emphasized)
- Title 1: 25pt / 31pt leading / Regular / Bold (emphasized)
- Title 2: 19pt / 24pt leading / Regular / Bold (emphasized)
- Title 3: 17pt / 22pt leading / Regular / Semibold (emphasized)
- Headline: 14pt / 19pt leading / Semibold / Semibold (emphasized)
- Body: 14pt / 19pt leading / Regular / Semibold (emphasized)
- Callout: 13pt / 18pt leading / Regular / Semibold (emphasized)
- Subhead: 12pt / 16pt leading / Regular / Semibold (emphasized)
- Footnote: 12pt / 16pt leading / Regular / Semibold (emphasized)
- Caption 1: 11pt / 13pt leading / Regular / Semibold (emphasized)
- Caption 2: 11pt / 13pt leading / Regular / Semibold (emphasized)

*[Размеры увеличиваются для Small, Medium, Large, xLarge, xxLarge, xxxLarge - см. полную таблицу в документации]*

**watchOS Text Styles:**
- Large Title: 26pt / 32pt leading / Regular / Bold (emphasized)
- Title 1: 22pt / 26pt leading / Regular / Bold (emphasized)
- Title 2: 17pt / 22pt leading / Regular / Bold (emphasized)
- Title 3: 15pt / 20pt leading / Regular / Semibold (emphasized)
- Headline: 13pt / 16pt leading / Bold / Heavy (emphasized)
- Body: 13pt / 16pt leading / Regular / Semibold (emphasized)
- Callout: 12pt / 15pt leading / Regular / Semibold (emphasized)
- Subheadline: 11pt / 14pt leading / Regular / Semibold (emphasized)
- Footnote: 10pt / 13pt leading / Regular / Semibold (emphasized)
- Caption 1: 10pt / 13pt leading / Regular / Medium (emphasized)
- Caption 2: 10pt / 13pt leading / Medium / Semibold (emphasized)

**tvOS Text Styles:**
- Title 1: 76pt / 96pt leading / Medium / Bold (emphasized)
- Title 2: 57pt / 66pt leading / Medium / Bold (emphasized)
- Title 3: 48pt / 56pt leading / Medium / Bold (emphasized)
- Headline: 38pt / 46pt leading / Medium / Bold (emphasized)
- Subtitle 1: 38pt / 46pt leading / Regular / Medium (emphasized)
- Callout: 31pt / 38pt leading / Medium / Bold (emphasized)
- Body: 29pt / 36pt leading / Medium / Bold (emphasized)
- Caption 1: 25pt / 32pt leading / Medium / Bold (emphasized)
- Caption 2: 23pt / 30pt leading / Medium / Bold (emphasized)

**visionOS Text Styles (xSmall - xxxLarge):**
- Large Title: 30-46pt / 32.5-48.5pt leading / Regular / Bold (emphasized)
- Title 1: 28-44pt / 30.5-47pt leading / Regular / Semibold (emphasized)
- Title 2: 24-36pt / 26.5-38.5pt leading / Regular / Semibold (emphasized)
- Title 3: 17-26pt / 19.5-28.5pt leading / Regular / Semibold (emphasized)
- Headline: 14-23pt / 16.5-25.5pt leading / Semibold / Semibold (emphasized)
- Body: 14-23pt / 16.5-25.5pt leading / Regular / Semibold (emphasized)
- Caption 1: 13-20pt / 15.5-22.5pt leading / Regular / Semibold (emphasized)
- Caption 2: 12-19pt / 14.5-21.5pt leading / Regular / Semibold (emphasized)
- Footnote 1: 11-18pt / 13.5-20.5pt leading / Regular / Semibold (emphasized)
- Footnote 2: 10-17pt / 12.5-19.5pt leading / Regular / Semibold (emphasized)

**SF Pro Tracking (Letter Spacing):**
*[Полная таблица tracking для разных размеров шрифта доступна в документации]*

**Системные шрифты:**
- **SF Pro**: основной системный шрифт (iOS, iPadOS, macOS, tvOS, visionOS)
- **SF Compact**: системный шрифт для watchOS
- **SF Compact Rounded**: используется в complications для watchOS
- **New York (NY)**: serif шрифт, доступен на всех платформах

**Font Weights:**
- Ultralight, Thin, Light (избегать для основного текста)
- Regular (рекомендуется)
- Medium (рекомендуется)
- Semibold (рекомендуется)
- Bold (рекомендуется)
- Heavy, Black

**Поля для кода:**
```typescript
// Text Styles
textStyles: {
  largeTitle: { fontSize: 31-60, lineHeight: 38-70, fontWeight: 'Regular', emphasized: 'Bold' },
  title1: { fontSize: 25-58, lineHeight: 31-68, fontWeight: 'Regular', emphasized: 'Bold' },
  title2: { fontSize: 19-56, lineHeight: 24-66, fontWeight: 'Regular', emphasized: 'Bold' },
  title3: { fontSize: 17-55, lineHeight: 22-65, fontWeight: 'Regular', emphasized: 'Semibold' },
  headline: { fontSize: 14-53, lineHeight: 19-62, fontWeight: 'Semibold', emphasized: 'Semibold' },
  body: { fontSize: 14-53, lineHeight: 19-62, fontWeight: 'Regular', emphasized: 'Semibold' },
  callout: { fontSize: 13-51, lineHeight: 18-60, fontWeight: 'Regular', emphasized: 'Semibold' },
  subhead: { fontSize: 12-49, lineHeight: 16-58, fontWeight: 'Regular', emphasized: 'Semibold' },
  footnote: { fontSize: 12-44, lineHeight: 16-52, fontWeight: 'Regular', emphasized: 'Semibold' },
  caption1: { fontSize: 11-43, lineHeight: 13-51, fontWeight: 'Regular', emphasized: 'Semibold' },
  caption2: { fontSize: 11-40, lineHeight: 13-48, fontWeight: 'Regular', emphasized: 'Semibold' },
}

// Platform Defaults
platformDefaults: {
  ios: { default: 17, minimum: 11 },
  macos: { default: 13, minimum: 10 },
  tvos: { default: 29, minimum: 23 },
  visionos: { default: 17, minimum: 12 },
  watchos: { default: 16, minimum: 12 },
}

// Font Families
fontFamilies: {
  sfPro: 'SF Pro',
  sfCompact: 'SF Compact',
  sfCompactRounded: 'SF Compact Rounded',
  newYork: 'New York',
}

// Font Weights
fontWeights: {
  ultralight: '100',
  thin: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
}
```

---

### Dark Mode
**URL:** https://developer.apple.com/design/human-interface-guidelines/dark-mode

**Описание:** Руководство по поддержке темной темы в приложениях.

*[Требуется детальное изучение]*

---

### Motion
**URL:** https://developer.apple.com/design/human-interface-guidelines/motion

**Описание:** Руководство по анимациям и движениям в интерфейсах.

*[Требуется детальное изучение]*

---

### SF Symbols
**URL:** https://developer.apple.com/design/human-interface-guidelines/sf-symbols

**Описание:** Руководство по использованию SF Symbols - библиотеки иконок Apple.

*[Требуется детальное изучение]*

---

### Writing
**URL:** https://developer.apple.com/design/human-interface-guidelines/writing

**Описание:** Руководство по написанию текстов для интерфейсов.

*[Требуется детальное изучение]*

---

### Branding
**URL:** https://developer.apple.com/design/human-interface-guidelines/branding

**Описание:** Руководство по брендингу в приложениях.

*[Требуется детальное изучение]*

---

### Images
**URL:** https://developer.apple.com/design/human-interface-guidelines/images

**Описание:** Руководство по использованию изображений в приложениях.

*[Требуется детальное изучение]*

---

### Immersive experiences
**URL:** https://developer.apple.com/design/human-interface-guidelines/immersive-experiences

**Описание:** Руководство по созданию иммерсивных впечатлений.

*[Требуется детальное изучение]*

---

### Inclusion
**URL:** https://developer.apple.com/design/human-interface-guidelines/inclusion

**Описание:** Руководство по обеспечению инклюзивности в приложениях.

*[Требуется детальное изучение]*

---

### Privacy
**URL:** https://developer.apple.com/design/human-interface-guidelines/privacy

**Описание:** Руководство по обеспечению приватности в приложениях.

*[Требуется детальное изучение]*

---

### Right to left
**URL:** https://developer.apple.com/design/human-interface-guidelines/right-to-left

**Описание:** Руководство по поддержке языков с направлением справа налево.

*[Требуется детальное изучение]*

---

### Spatial layout
**URL:** https://developer.apple.com/design/human-interface-guidelines/spatial-layout

**Описание:** Руководство по пространственной компоновке для visionOS.

*[Требуется детальное изучение]*

---

## Patterns

**URL:** https://developer.apple.com/design/human-interface-guidelines/patterns

**Описание:** Паттерны дизайна для общих пользовательских действий и задач.

**Статьи:**

1. **Charting data** - https://developer.apple.com/design/human-interface-guidelines/charting-data
2. **Collaboration and sharing** - https://developer.apple.com/design/human-interface-guidelines/collaboration-and-sharing
3. **Drag and drop** - https://developer.apple.com/design/human-interface-guidelines/drag-and-drop
4. **Entering data** - https://developer.apple.com/design/human-interface-guidelines/entering-data
5. **Feedback** - https://developer.apple.com/design/human-interface-guidelines/feedback
6. **File management** - https://developer.apple.com/design/human-interface-guidelines/file-management
7. **Going full screen** - https://developer.apple.com/design/human-interface-guidelines/going-full-screen
8. **Launching** - https://developer.apple.com/design/human-interface-guidelines/launching
9. **Live-viewing apps** - https://developer.apple.com/design/human-interface-guidelines/live-viewing-apps
10. **Loading** - https://developer.apple.com/design/human-interface-guidelines/loading
11. **Managing accounts** - https://developer.apple.com/design/human-interface-guidelines/managing-accounts
12. **Managing notifications** - https://developer.apple.com/design/human-interface-guidelines/managing-notifications
13. **Modality** - https://developer.apple.com/design/human-interface-guidelines/modality
14. **Multitasking** - https://developer.apple.com/design/human-interface-guidelines/multitasking
15. **Offering help** - https://developer.apple.com/design/human-interface-guidelines/offering-help
16. **Onboarding** - https://developer.apple.com/design/human-interface-guidelines/onboarding
17. **Playing audio** - https://developer.apple.com/design/human-interface-guidelines/playing-audio
18. **Playing haptics** - https://developer.apple.com/design/human-interface-guidelines/playing-haptics
19. **Playing video** - https://developer.apple.com/design/human-interface-guidelines/playing-video
20. **Printing** - https://developer.apple.com/design/human-interface-guidelines/printing
21. **Ratings and reviews** - https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews
22. **Searching** - https://developer.apple.com/design/human-interface-guidelines/searching
23. **Settings** - https://developer.apple.com/design/human-interface-guidelines/settings
24. **Undo and redo** - https://developer.apple.com/design/human-interface-guidelines/undo-and-redo
25. **Workouts** - https://developer.apple.com/design/human-interface-guidelines/workouts

*[Требуется детальное изучение каждой статьи]*

---

## Components

**URL:** https://developer.apple.com/design/human-interface-guidelines/components

**Описание:** Системные компоненты и их использование.

### Категории компонентов:

#### 1. Content
**URL:** https://developer.apple.com/design/human-interface-guidelines/content

**Статьи:**
- **Alerts** - https://developer.apple.com/design/human-interface-guidelines/alerts
- **Images** - https://developer.apple.com/design/human-interface-guidelines/images
- **Text fields** - https://developer.apple.com/design/human-interface-guidelines/text-fields
- **Text views** - https://developer.apple.com/design/human-interface-guidelines/text-views

*[Требуется детальное изучение каждой статьи]*

---

#### 2. Layout and organization
**URL:** https://developer.apple.com/design/human-interface-guidelines/layout-and-organization

**Статьи:**
- **Boxes** - https://developer.apple.com/design/human-interface-guidelines/boxes
- **Collections** - https://developer.apple.com/design/human-interface-guidelines/collections
- **Column views** - https://developer.apple.com/design/human-interface-guidelines/column-views
- **Disclosure controls** - https://developer.apple.com/design/human-interface-guidelines/disclosure-controls
- **Labels** - https://developer.apple.com/design/human-interface-guidelines/labels
- **Lists and tables** - https://developer.apple.com/design/human-interface-guidelines/lists-and-tables
- **Lockups** - https://developer.apple.com/design/human-interface-guidelines/lockups
- **Outline views** - https://developer.apple.com/design/human-interface-guidelines/outline-views
- **Split views** - https://developer.apple.com/design/human-interface-guidelines/split-views
- **Tab views** - https://developer.apple.com/design/human-interface-guidelines/tab-views

*[Требуется детальное изучение каждой статьи]*

---

#### 3. Menus and actions
**URL:** https://developer.apple.com/design/human-interface-guidelines/menus-and-actions

**Статьи:**
- **Activity views** - https://developer.apple.com/design/human-interface-guidelines/activity-views
- **Buttons** - https://developer.apple.com/design/human-interface-guidelines/buttons
- **Context menus** - https://developer.apple.com/design/human-interface-guidelines/context-menus
- **Dock menus** - https://developer.apple.com/design/human-interface-guidelines/dock-menus
- **Edit menus** - https://developer.apple.com/design/human-interface-guidelines/edit-menus
- **Home Screen quick actions** - https://developer.apple.com/design/human-interface-guidelines/home-screen-quick-actions
- **Menus** - https://developer.apple.com/design/human-interface-guidelines/menus
- **Ornaments** - https://developer.apple.com/design/human-interface-guidelines/ornaments
- **Pop-up buttons** - https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons
- **Pull-down buttons** - https://developer.apple.com/design/human-interface-guidelines/pull-down-buttons
- **The menu bar** - https://developer.apple.com/design/human-interface-guidelines/the-menu-bar
- **Toolbars** - https://developer.apple.com/design/human-interface-guidelines/toolbars

*[Требуется детальное изучение каждой статьи]*

---

#### 4. Navigation and search
**URL:** https://developer.apple.com/design/human-interface-guidelines/navigation-and-search

**Статьи:**
- **Path controls** - https://developer.apple.com/design/human-interface-guidelines/path-controls
- **Search fields** - https://developer.apple.com/design/human-interface-guidelines/search-fields
- **Sidebars** - https://developer.apple.com/design/human-interface-guidelines/sidebars
- **Tab bars** - https://developer.apple.com/design/human-interface-guidelines/tab-bars
- **Token fields** - https://developer.apple.com/design/human-interface-guidelines/token-fields

*[Требуется детальное изучение каждой статьи]*

---

#### 5. Presentation
**URL:** https://developer.apple.com/design/human-interface-guidelines/presentation

**Статьи:**
- **Action sheets** - https://developer.apple.com/design/human-interface-guidelines/action-sheets
- **Alerts** - https://developer.apple.com/design/human-interface-guidelines/alerts
- **Page controls** - https://developer.apple.com/design/human-interface-guidelines/page-controls
- **Panels** - https://developer.apple.com/design/human-interface-guidelines/panels
- **Popovers** - https://developer.apple.com/design/human-interface-guidelines/popovers
- **Scroll views** - https://developer.apple.com/design/human-interface-guidelines/scroll-views
- **Sheets** - https://developer.apple.com/design/human-interface-guidelines/sheets
- **Windows** - https://developer.apple.com/design/human-interface-guidelines/windows

*[Требуется детальное изучение каждой статьи]*

---

#### 6. Selection and input
**URL:** https://developer.apple.com/design/human-interface-guidelines/selection-and-input

**Статьи:**
- **Color wells** - https://developer.apple.com/design/human-interface-guidelines/color-wells
- **Combo boxes** - https://developer.apple.com/design/human-interface-guidelines/combo-boxes
- **Digit entry views** - https://developer.apple.com/design/human-interface-guidelines/digit-entry-views
- **Image wells** - https://developer.apple.com/design/human-interface-guidelines/image-wells
- **Pickers** - https://developer.apple.com/design/human-interface-guidelines/pickers
- **Segmented controls** - https://developer.apple.com/design/human-interface-guidelines/segmented-controls
- **Sliders** - https://developer.apple.com/design/human-interface-guidelines/sliders
- **Steppers** - https://developer.apple.com/design/human-interface-guidelines/steppers
- **Text fields** - https://developer.apple.com/design/human-interface-guidelines/text-fields
- **Toggles** - https://developer.apple.com/design/human-interface-guidelines/toggles
- **Virtual keyboards** - https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards

*[Требуется детальное изучение каждой статьи]*

---

#### 7. Status
**URL:** https://developer.apple.com/design/human-interface-guidelines/status

**Статьи:**
- **Activity rings** - https://developer.apple.com/design/human-interface-guidelines/activity-rings
- **Gauges** - https://developer.apple.com/design/human-interface-guidelines/gauges
- **Progress indicators** - https://developer.apple.com/design/human-interface-guidelines/progress-indicators
- **Rating indicators** - https://developer.apple.com/design/human-interface-guidelines/rating-indicators

*[Требуется детальное изучение каждой статьи]*

---

#### 8. System experiences
**URL:** https://developer.apple.com/design/human-interface-guidelines/system-experiences

**Статьи:**
- **App Shortcuts** - https://developer.apple.com/design/human-interface-guidelines/app-shortcuts
- **Complications** - https://developer.apple.com/design/human-interface-guidelines/complications
- **Controls** - https://developer.apple.com/design/human-interface-guidelines/controls
- **Live Activities** - https://developer.apple.com/design/human-interface-guidelines/live-activities
- **Notifications** - https://developer.apple.com/design/human-interface-guidelines/notifications
- **Status bars** - https://developer.apple.com/design/human-interface-guidelines/status-bars
- **Top Shelf** - https://developer.apple.com/design/human-interface-guidelines/top-shelf
- **Watch faces** - https://developer.apple.com/design/human-interface-guidelines/watch-faces
- **Widgets** - https://developer.apple.com/design/human-interface-guidelines/widgets

*[Требуется детальное изучение каждой статьи]*

---

## Inputs

**URL:** https://developer.apple.com/design/human-interface-guidelines/inputs

**Описание:** Методы ввода данных и управления приложением. Изучите различные способы, которыми люди управляют вашим приложением или игрой и вводят данные.

**Статьи:**

1. **Action button** - https://developer.apple.com/design/human-interface-guidelines/action-button
2. **Apple Pencil and Scribble** - https://developer.apple.com/design/human-interface-guidelines/apple-pencil-and-scribble
3. **Camera Control** - https://developer.apple.com/design/human-interface-guidelines/camera-control
4. **Digital Crown** - https://developer.apple.com/design/human-interface-guidelines/digital-crown
5. **Eyes** - https://developer.apple.com/design/human-interface-guidelines/eyes
6. **Focus and selection** - https://developer.apple.com/design/human-interface-guidelines/focus-and-selection
7. **Game controls** - https://developer.apple.com/design/human-interface-guidelines/game-controls
8. **Gestures** - https://developer.apple.com/design/human-interface-guidelines/gestures
9. **Gyroscope and accelerometer** - https://developer.apple.com/design/human-interface-guidelines/gyro-and-accelerometer
10. **Keyboards** - https://developer.apple.com/design/human-interface-guidelines/keyboards
11. **Nearby interactions** - https://developer.apple.com/design/human-interface-guidelines/nearby-interactions
12. **Pointing devices** - https://developer.apple.com/design/human-interface-guidelines/pointing-devices
13. **Remotes** - https://developer.apple.com/design/human-interface-guidelines/remotes

*[Требуется детальное изучение каждой статьи]*

---

## Technologies

**URL:** https://developer.apple.com/design/human-interface-guidelines/technologies

**Описание:** Технологии, функции и сервисы Apple для интеграции в приложения.

### Статьи в разделе Technologies:

1. **AirPlay** - https://developer.apple.com/design/human-interface-guidelines/airplay
2. **Always On** - https://developer.apple.com/design/human-interface-guidelines/always-on
3. **App Clips** - https://developer.apple.com/design/human-interface-guidelines/app-clips
4. **Apple Pay** - https://developer.apple.com/design/human-interface-guidelines/apple-pay
5. **Augmented reality** - https://developer.apple.com/design/human-interface-guidelines/augmented-reality
6. **CareKit** - https://developer.apple.com/design/human-interface-guidelines/carekit
7. **CarPlay** - https://developer.apple.com/design/human-interface-guidelines/carplay
8. **Game Center** - https://developer.apple.com/design/human-interface-guidelines/game-center
9. **Generative AI** - https://developer.apple.com/design/human-interface-guidelines/generative-ai
10. **HealthKit** - https://developer.apple.com/design/human-interface-guidelines/healthkit
11. **HomeKit** - https://developer.apple.com/design/human-interface-guidelines/homekit
12. **iCloud** - https://developer.apple.com/design/human-interface-guidelines/icloud
13. **ID Verifier** - https://developer.apple.com/design/human-interface-guidelines/id-verifier
14. **iMessage apps and stickers** - https://developer.apple.com/design/human-interface-guidelines/imessage-apps-and-stickers
15. **In-app purchase** - https://developer.apple.com/design/human-interface-guidelines/in-app-purchase
16. **Live Photos** - https://developer.apple.com/design/human-interface-guidelines/live-photos
17. **Mac Catalyst** - https://developer.apple.com/design/human-interface-guidelines/mac-catalyst
18. **Machine learning** - https://developer.apple.com/design/human-interface-guidelines/machine-learning
19. **Maps** - https://developer.apple.com/design/human-interface-guidelines/maps
20. **NFC** - https://developer.apple.com/design/human-interface-guidelines/nfc
21. **Photo editing** - https://developer.apple.com/design/human-interface-guidelines/photo-editing
22. **ResearchKit** - https://developer.apple.com/design/human-interface-guidelines/researchkit
23. **SharePlay** - https://developer.apple.com/design/human-interface-guidelines/shareplay
24. **ShazamKit** - https://developer.apple.com/design/human-interface-guidelines/shazamkit
25. **Sign in with Apple** - https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple
26. **Siri** - https://developer.apple.com/design/human-interface-guidelines/siri
27. **Tap to Pay on iPhone** - https://developer.apple.com/design/human-interface-guidelines/tap-to-pay-on-iphone
28. **VoiceOver** - https://developer.apple.com/design/human-interface-guidelines/voiceover
29. **Wallet** - https://developer.apple.com/design/human-interface-guidelines/wallet

*[Требуется детальное изучение каждой статьи]*

---

## New and Updated

### Multitasking
**URL:** https://developer.apple.com/design/human-interface-guidelines/multitasking

**Описание:** Руководство по поддержке многозадачности в приложениях.

*[Требуется детальное изучение]*

---

### The menu bar
**URL:** https://developer.apple.com/design/human-interface-guidelines/the-menu-bar

**Описание:** Руководство по использованию menu bar в macOS приложениях.

*[Требуется детальное изучение]*

---

### Toolbars
**URL:** https://developer.apple.com/design/human-interface-guidelines/toolbars

**Описание:** Руководство по созданию и использованию toolbars.

*[Требуется детальное изучение]*

---

### Search fields
**URL:** https://developer.apple.com/design/human-interface-guidelines/search-fields

**Описание:** Руководство по созданию и использованию полей поиска.

*[Требуется детальное изучение]*

---

### Game Center
**URL:** https://developer.apple.com/design/human-interface-guidelines/game-center

**Описание:** Руководство по интеграции Game Center в игры.

*[Требуется детальное изучение]*

---

### Generative AI
**URL:** https://developer.apple.com/design/human-interface-guidelines/generative-ai

**Описание:** Руководство по интеграции генеративного AI в приложения.

*[Требуется детальное изучение]*

---

## Примечания

Этот документ находится в процессе заполнения. Систематическое изучение всех разделов HIG продолжается.

**Следующие шаги:**
1. Детальное изучение раздела Foundations
2. Детальное изучение раздела Patterns
3. Детальное изучение раздела Components
4. Детальное изучение раздела Inputs
5. Детальное изучение раздела Technologies
6. Заполнение всех подразделов в каждом разделе

---

**Последнее обновление:** 2026-01-23
**Статус:** В процессе заполнения

