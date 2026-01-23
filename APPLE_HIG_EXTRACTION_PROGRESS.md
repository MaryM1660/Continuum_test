# Прогресс извлечения данных из Apple HIG

## Статус работы

**Начато:** 2026-01-23
**Метод:** Систематическое извлечение всех спецификаций из всех статей

---

## План работы

### Этап 1: Foundations - Основные статьи ✅ (в процессе)

#### 1.1 Color ✅ (частично)
- [x] Основная структура файла создана
- [x] System Colors (Light/Dark, Default) - обновлено с точными RGB
- [x] System Colors (Increased Contrast) - добавлено
- [x] iOS/iPadOS System Gray Colors - добавлено
- [ ] Проверить все ссылки на связанные статьи
- [ ] Извлечь спецификации из Developer Documentation ссылок

#### 1.2 Typography ✅ (завершено)
- [x] Извлечь все 33 таблицы со спецификациями
- [x] iOS/iPadOS Dynamic Type sizes (xSmall-xxxLarge) - 7 таблиц
- [x] iOS/iPadOS Accessibility sizes (AX1-AX5) - 5 таблиц
- [x] macOS built-in text styles - 1 таблица
- [x] tvOS built-in text styles - 1 таблица
- [x] watchOS Dynamic Type sizes - 6 таблиц
- [x] watchOS Accessibility sizes - 5 таблиц
- [x] Tracking values для всех шрифтов - 7 таблиц
- [ ] Обновить typography.ts с извлеченными данными

#### 1.3 Layout ✅ (завершено)
- [x] Извлечь все таблицы из Specifications
- [x] iOS/iPadOS device screen dimensions (58 строк)
- [x] iOS/iPadOS device size classes (49 строк)
- [x] watchOS device screen dimensions (11 строк)
- [x] visionOS Unfocused content width (8 таблиц)
- [ ] Обновить layout.ts с извлеченными данными

#### 1.4 Materials ⏳ (ожидает)
- [ ] Проверить наличие спецификаций
- [ ] Извлечь параметры Liquid Glass
- [ ] Извлечь параметры Standard materials
- [ ] Обновить materials.ts

#### 1.5 Остальные Foundations статьи ✅ (завершено извлечение таблиц)
- [x] Accessibility (4 таблицы извлечены)
- [x] App icons (1 таблица извлечена)
- [x] Branding (таблиц не найдено)
- [x] Dark Mode (1 таблица найдена - Change log, не требует извлечения)
- [x] Icons (10 таблиц извлечены)
- [x] Images (4 таблицы извлечены)
- [x] Immersive experiences (1 таблица найдена - Change log, не требует извлечения)
- [x] Inclusion (таблиц не найдено)
- [x] Motion (1 таблица найдена - Change log, не требует извлечения)
- [x] Privacy (2 таблицы извлечены)
- [x] Right to left (таблиц не найдено)
- [x] SF Symbols (1 таблица найдена - Change log, не требует извлечения)
- [x] Spatial layout (1 таблица найдена - Change log, не требует извлечения)
- [x] Writing (1 таблица найдена - Change log, не требует извлечения)

---

### Этап 2: Связанные статьи из основных разделов

#### 2.1 Статьи, связанные с Layout
- [ ] scroll-views
- [ ] spatial-layout
- [ ] right-to-left
- [ ] disclosure-controls
- [ ] toolbars
- [ ] tab-bars
- [ ] windows
- [ ] split-views
- [ ] buttons
- [ ] multitasking

#### 2.2 Статьи, связанные с Typography
- [ ] sf-symbols

#### 2.3 Статьи, связанные с Materials
- [ ] sliders
- [ ] toggles

---

### Этап 3: Patterns, Components, Inputs, Technologies ⏳ (начато)

После завершения Foundations и связанных статей, перейти к систематическому изучению:
- [x] Patterns (25 статей) - начато, проверено 3/25
- [ ] Components (63+ статей)
- [ ] Inputs (13 статей)
- [ ] Technologies (29 статей)

---

## Текущая работа

**Сейчас:** Завершено извлечение всех таблиц из статей Foundations

**Следующий шаг:** Обновить файлы стилей (typography.ts, layout.ts, colors.ts) с извлеченными данными

**Завершено извлечение таблиц:**
- ✅ Typography: 33 таблицы извлечены
- ✅ Layout: 12 таблиц извлечены
- ✅ App icons: 1 таблица извлечена
- ✅ Icons: 10 таблиц извлечены
- ✅ Images: 4 таблицы извлечены
- ✅ Privacy: 2 таблицы извлечены
- ✅ Accessibility: 4 таблицы извлечены
- ✅ Materials: 2 таблицы извлечены

**Всего извлечено: 68 таблиц из статей Foundations**

**В процессе:**
- ⏳ Patterns: проверено 3/25 статей

