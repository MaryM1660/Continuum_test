# Правила типографики для мобильных приложений

## Источники
- **iOS Human Interface Guidelines** (Apple, 2024)
- **Material Design 3** (Google, 2024)

## Основные принципы

### Минимальные размеры шрифтов
- **iOS/iPadOS**: Default 17pt, Minimum 11pt
- **Android (Material)**: Минимум 12sp для читаемости
- **WCAG Accessibility**: Минимум 16px (12pt) для основного текста

### Рекомендации по читаемости
1. **Избегайте тонких начертаний** (Ultralight, Thin, Light) — они плохо читаются, особенно на маленьких размерах
2. **Используйте Regular, Medium, Semibold, Bold** для лучшей читаемости
3. **Тестируйте на разных размерах экранов** и при разных условиях освещения
4. **Поддерживайте Dynamic Type** (iOS) и масштабирование текста (Android)

## iOS Human Interface Guidelines - Размеры шрифтов

### Dynamic Type (Large - default размер)

| Стиль | Размер (pt) | Line Height (pt) | Weight | Emphasized Weight |
|-------|-------------|------------------|--------|-------------------|
| Large Title | 34 | 41 | Regular | Bold |
| Title 1 | 28 | 34 | Regular | Bold |
| Title 2 | 22 | 28 | Regular | Bold |
| Title 3 | 20 | 26 | Regular | Semibold |
| Headline | 17 | 22 | Semibold | Semibold |
| Body | 17 | 24 | Regular | Semibold |
| Callout | 15 | 20 | Regular | Semibold |
| Subhead | 15 | 20 | Regular | Semibold |
| Footnote | 13 | 18 | Regular | Semibold |
| Caption 1 | 12 | 16 | Regular | Semibold |
| Caption 2 | 12 | 16 | Regular | Semibold |

### Важные правила iOS
- **Default size**: 17pt для основного текста
- **Minimum size**: 11pt (не рекомендуется для основного контента)
- **Line Height**: Обычно 1.2-1.5x от размера шрифта для комфортного чтения
- **Letter Spacing (Tracking)**: Автоматически настраивается системой в зависимости от размера

## Material Design 3 - Размеры шрифтов

### Type Scale (15 baseline + 15 emphasized стилей)

**Роли типографики:**
- **Display**: Крупные заголовки (96sp, 64sp, 48sp)
- **Headline**: Заголовки разделов (32sp, 28sp, 24sp)
- **Title**: Заголовки карточек и секций (22sp, 20sp, 18sp, 16sp, 14sp)
- **Body**: Основной текст (16sp, 14sp)
- **Label**: Лейблы и подписи (14sp, 12sp, 11sp)

### Важные правила Material Design
- Используются **sp (scalable pixels)** вместо pt
- **Минимум 12sp** для читаемости
- **Line Height**: 1.2-1.5x от размера шрифта
- **Letter Spacing**: Зависит от размера и веса шрифта

## Текущая система типографики проекта

### Соответствие стандартам

✅ **Соответствует iOS HIG:**
- `h1` (34pt) = iOS Large Title (34pt)
- `h2` (28pt) = iOS Title 1 (28pt)
- `h3` (22pt) = iOS Title 2 (22pt)
- `h4` (20pt) = iOS Title 3 (20pt)
- `body` (17pt) = iOS Body (17pt) ✅ Default size
- `bodySmall` (15pt) = iOS Callout/Subhead (15pt)
- `caption` (13pt) = iOS Footnote (13pt)
- `captionSmall` (12pt) = iOS Caption (12pt)

✅ **Соответствует Material Design:**
- Заголовки соответствуют Headline и Title ролям
- Body текст соответствует Body роли
- Caption соответствует Label роли

### Рекомендации для улучшения

1. **Минимальный размер**: Текущий минимум 11pt (overline) соответствует стандартам ✅
2. **Line Height**: Все значения в диапазоне 1.2-1.5x ✅
3. **Font Weight**: Используются только безопасные веса (400, 500, 600, 700) ✅
4. **Letter Spacing**: Значения соответствуют iOS tracking для соответствующих размеров ✅

## Практические рекомендации

### Для основного контента
- **Минимум 16-17pt** для основного текста
- **Line Height 1.4-1.5x** для длинных текстов
- **Regular weight (400)** для основного текста

### Для заголовков
- **28-34pt** для главных заголовков экранов
- **20-24pt** для заголовков секций
- **Bold (700) или Semibold (600)** для акцента

### Для кнопок
- **17-18pt** для основных кнопок
- **Semibold (600)** для лучшей видимости
- **Компактный line height** (1.2-1.3x) для экономии места

### Для вспомогательного текста
- **12-13pt** для подписей и меток
- **Regular (400)** или **Medium (500)** для выделения
- **Минимум 11pt** только для специальных случаев (overline)

## Accessibility (Доступность)

### WCAG 2.1 рекомендации
- **Минимум 16px (12pt)** для основного текста
- **Контрастность**: Минимум 4.5:1 для обычного текста, 3:1 для крупного текста (18pt+)
- **Поддержка масштабирования**: Текст должен масштабироваться до 200% без потери функциональности

### Dynamic Type (iOS)
- Поддержка всех размеров Dynamic Type (от xSmall до xxxLarge)
- Адаптация layout при увеличении размера текста
- Приоритизация важного контента при масштабировании

## Заключение

Текущая система типографики проекта **полностью соответствует** официальным гайдлайнам iOS и Material Design. Все размеры, line heights, и font weights выбраны правильно и обеспечивают хорошую читаемость для целевой аудитории (senior tech specialists).


