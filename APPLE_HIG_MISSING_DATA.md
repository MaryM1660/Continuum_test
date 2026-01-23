# Упущенные данные из Apple HIG

## Результаты глубокого анализа

### Color
- ✅ **25 ссылок** на другие статьи HIG (включая `dark-mode`, `accessibility`, `materials#Liquid-Glass`, `sidebars`, `complications`)
- ✅ **75 ссылок** на Developer Documentation (UIKit, SwiftUI, AppKit APIs)
- ✅ **9 H2 разделов** (Best practices, Inclusive color, System colors, Liquid Glass color, Color management, Platform considerations, Specifications, Resources, Change log)
- ✅ **7 H3 разделов** (iOS/iPadOS, macOS, tvOS, visionOS, watchOS, System colors, iOS/iPadOS system gray colors)
- ✅ **1 H4 раздел** (App accent colors)
- ✅ **Раздел Specifications** с таблицами точных RGB значений для:
  - System Colors (Default light/dark, Increased contrast light/dark)
  - iOS/iPadOS System Gray Colors (Default light/dark, Increased contrast light/dark)

**Упущено:**
- ❌ Ссылки на `dark-mode`, `accessibility`, `sidebars`, `complications` - нужно проверить эти статьи
- ❌ Раздел "App accent colors" (H4) - специфично для macOS, но может быть полезно
- ❌ Все 75 ссылок на Developer Documentation - могут содержать важные API спецификации

### Typography
- ✅ **51 ссылка** на другие статьи HIG
- ✅ **33 таблицы** со спецификациями!
- ✅ **9 H2 разделов**
- ✅ **12 H3 разделов** (включая iOS/iPadOS Dynamic Type sizes, Tracking values, Accessibility sizes)
- ✅ **30+ H4 разделов** (xSmall, Small, Medium, Large, xLarge, xxLarge, xxxLarge, AX1-AX5, SF Pro, SF Pro Rounded, New York, SF Compact, SF Compact Rounded)

**Упущено:**
- ❌ **33 таблицы** с точными значениями fontSize, lineHeight, fontWeight, letterSpacing для всех размеров Dynamic Type
- ❌ Таблицы Tracking values (letter spacing) для всех шрифтов (SF Pro, SF Pro Rounded, New York, SF Compact, SF Compact Rounded)
- ❌ Accessibility sizes (AX1-AX5) для iOS/iPadOS и watchOS
- ❌ macOS built-in text styles
- ❌ tvOS built-in text styles
- ❌ watchOS Dynamic Type sizes (xSmall, Small, Large, xLarge, xxLarge, xxxLarge)
- ❌ Ссылка на `sf-symbols` - нужно проверить

### Layout
- ✅ **47 ссылок** на другие статьи HIG (включая `scroll-views`, `spatial-layout`, `right-to-left`, `disclosure-controls`, `toolbars`, `multitasking`, `windows`, `split-views`, `tab-bars`, `ornaments`, `eyes`, `buttons`)
- ✅ **12 таблиц** со спецификациями
- ✅ **8 H2 разделов**
- ✅ **9 H3 разделов** (включая iOS/iPadOS device screen dimensions, device size classes, watchOS device screen dimensions)
- ✅ **9 H4 разделов** (Grids: Two-column, Three-column, Four-column, Five-column, Six-column, Seven-column, Eight-column, Nine-column)

**Упущено:**
- ❌ Таблицы device screen dimensions для iOS/iPadOS
- ❌ Таблицы device size classes
- ❌ Таблицы watchOS device screen dimensions
- ❌ Спецификации Grids (Two-column, Three-column, Four-column, Five-column, Six-column, Seven-column, Eight-column, Nine-column)
- ❌ Ссылки на `scroll-views`, `spatial-layout`, `right-to-left`, `disclosure-controls`, `toolbars`, `multitasking`, `windows`, `split-views`, `tab-bars`, `ornaments`, `eyes`, `buttons` - нужно проверить эти статьи

### Materials
- ✅ **21 ссылка** на другие статьи HIG
- ✅ **5 H2 разделов** (Liquid Glass, Standard materials, Platform considerations, Resources, Change log)
- ✅ **5 H3 разделов** (iOS/iPadOS, macOS, tvOS, visionOS, watchOS)

**Упущено:**
- ❌ Ссылка на `color#Liquid-Glass-color` - уже проверена, но нужно убедиться, что все спецификации извлечены
- ❌ Ссылки на `sliders`, `toggles` - нужно проверить эти статьи
- ❌ Раздел "Standard materials" - может содержать спецификации

## План действий

### Приоритет 1: Критичные спецификации для стилей

1. **Typography - извлечь все 33 таблицы:**
   - iOS/iPadOS Dynamic Type sizes (xSmall-xxxLarge) - 7 таблиц
   - iOS/iPadOS Accessibility sizes (AX1-AX5) - 5 таблиц
   - macOS built-in text styles - 1 таблица
   - tvOS built-in text styles - 1 таблица
   - watchOS Dynamic Type sizes - 6 таблиц
   - watchOS Accessibility sizes - 5 таблиц
   - Tracking values для всех шрифтов - 7 таблиц

2. **Layout - извлечь таблицы:**
   - iOS/iPadOS device screen dimensions
   - iOS/iPadOS device size classes
   - watchOS device screen dimensions
   - Grid specifications (если есть)

3. **Color - завершить:**
   - Проверить все значения из таблиц Specifications
   - Убедиться, что все Increased Contrast варианты включены

### Приоритет 2: Связанные статьи для проверки

1. **Из Layout:**
   - `scroll-views` - может содержать спецификации spacing
   - `spatial-layout` - может содержать спецификации для visionOS
   - `right-to-left` - может содержать спецификации layout
   - `toolbars` - может содержать спецификации spacing и размеров
   - `tab-bars` - может содержать спецификации spacing и размеров
   - `windows` - может содержать спецификации размеров
   - `split-views` - может содержать спецификации layout
   - `buttons` - может содержать спецификации размеров и spacing

2. **Из Typography:**
   - `sf-symbols` - может содержать спецификации размеров иконок

3. **Из Materials:**
   - `sliders` - может содержать спецификации размеров
   - `toggles` - может содержать спецификации размеров

### Приоритет 3: Developer Documentation ссылки

Проверить ключевые API ссылки, которые могут содержать спецификации:
- UIKit UIColor APIs
- SwiftUI Color APIs
- Typography APIs
- Layout APIs

## Следующие шаги

1. ✅ Создать систематический план извлечения данных
2. ⏳ Извлечь все таблицы из Typography Specifications
3. ⏳ Извлечь все таблицы из Layout Specifications
4. ⏳ Проверить связанные статьи на наличие спецификаций
5. ⏳ Обновить файлы стилей с извлеченными данными

