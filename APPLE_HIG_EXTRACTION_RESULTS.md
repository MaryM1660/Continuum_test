# Результаты извлечения данных из Apple HIG

**Дата:** 2026-01-23  
**Статус:** В процессе систематического извлечения

---

## ✅ Завершено

### Typography
- ✅ **33 таблицы** извлечены из раздела Specifications
- ✅ Данные сохранены в `APPLE_HIG_TYPOGRAPHY_SPECIFICATIONS.md`
- ✅ Включает:
  - iOS/iPadOS Dynamic Type sizes (xSmall-xxxLarge) - 7 таблиц
  - iOS/iPadOS Accessibility sizes (AX1-AX5) - 5 таблиц
  - macOS built-in text styles - 1 таблица
  - tvOS built-in text styles - 1 таблица
  - watchOS Dynamic Type sizes - 6 таблиц
  - watchOS Accessibility sizes - 5 таблиц
  - Tracking values для всех шрифтов - 7 таблиц

### Color
- ✅ Основная структура создана
- ✅ System Colors (Light/Dark, Default) - обновлено с точными RGB
- ✅ System Colors (Increased Contrast) - добавлено
- ✅ iOS/iPadOS System Gray Colors - добавлено

---

## ⏳ Проверено (структура)

### Layout
- ⏳ Проверена структура статьи
- ⏳ Найдено 12 таблиц (требуется извлечение данных)
- ⏳ Секция Specifications найдена
- ⏳ Секция Grids найдена (Two-column, Three-column, Four-column, Five-column, Six-column, Seven-column, Eight-column, Nine-column)

### Accessibility
- ✅ Проверена структура статьи
- ✅ Найдено 4 таблицы:
  1. Platform Default and Minimum Sizes
  2. Text size, Text weight, Minimum contrast ratio
  3. Platform Default control size, Minimum control size
  4. Change log
- ✅ Найдено 21 ссылка на другие статьи HIG
- ✅ Найдено 13 заголовков (H2-H4)
- ❌ Секция Specifications не найдена (таблицы в основном тексте)

### Dark Mode
- ✅ Проверена структура статьи
- ✅ Найдено 1 таблица (Change log)
- ✅ Найдено 17 ссылок на другие статьи HIG
- ✅ Найдено 12 заголовков (H2-H4)
- ✅ Ссылка на `color#Specifications` найдена
- ❌ Секция Specifications не найдена (ссылается на Color#Specifications)

### SF Symbols
- ✅ Проверена структура статьи
- ✅ Найдено 1 таблица (Change log)
- ✅ Найдено 18 ссылок на другие статьи HIG
- ✅ Найдено 14 заголовков (H2-H4)
- ✅ Разделы: Rendering modes, Gradients, Variable color, Weights and scales, Design variants, Animations, Custom symbols
- ❌ Секция Specifications не найдена

---

## 📋 Следующие статьи для проверки

### Foundations (остальные)
1. App icons
2. Branding
3. Icons
4. Images
5. Immersive experiences
6. Inclusion
7. Motion
8. Privacy
9. Right to left
10. Spatial layout
11. Writing

### Связанные статьи (из найденных ссылок)
- voiceover
- playing-haptics
- siri
- keyboards
- inclusion
- right-to-left#Images
- branding
- icons

---

## 📝 Заметки

- Не все статьи имеют секцию Specifications - некоторые ссылаются на другие статьи
- Таблицы могут находиться в основном тексте, а не в отдельной секции
- Нужно проверять все подразделы внутри каждой статьи
- Нужно извлекать все ссылки на Developer Documentation для проверки спецификаций


