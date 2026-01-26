# Typography System Guide

## Современная система типографики

Система типографики основана на **iOS Human Interface Guidelines** и **Material Design**, оптимизирована для серьезных тех специалистов с хорошей читаемостью.

### Основные принципы

1. **Не слишком мелко** - минимальный размер 12px, основной текст 17px
2. **Высокая читаемость** - оптимальные line-height (1.2-1.4x)
3. **Четкая иерархия** - от h1 (34px) до caption (12px)
4. **Консистентность** - единая система для всего приложения

### Варианты типографики

#### Заголовки (Headings)

```typescript
h1: 34px / 40px line-height / Bold (700)      // Заголовки экранов
h2: 28px / 34px line-height / Bold (700)      // Заголовки секций
h3: 22px / 28px line-height / Semibold (600)  // Подзаголовки
h4: 20px / 26px line-height / Semibold (600)  // Заголовки карточек
```

#### Основной текст (Body)

```typescript
bodyLarge: 17px / 24px / Regular (400)  // Основной текст (рекомендуется)
body: 17px / 24px / Regular (400)        // Стандартный текст
bodyMedium: 16px / 22px / Regular (400)  // Вторичный контент
bodySmall: 15px / 20px / Regular (400)   // Мелкий текст
```

#### Вспомогательный текст

```typescript
caption: 13px / 18px / Regular (400)     // Подписи, метки
captionSmall: 12px / 16px / Regular (400) // Мелкие подписи
```

#### Кнопки

```typescript
buttonLarge: 18px / 24px / Semibold (600) // Большие CTA
button: 17px / 22px / Semibold (600)      // Стандартные кнопки
buttonSmall: 15px / 20px / Semibold (600) // Маленькие кнопки
```

#### Специальные

```typescript
label: 13px / 18px / Medium (500)        // Лейблы форм
overline: 11px / 16px / Medium (500)     // Uppercase метки
```

### Использование

#### Через компонент Text

```typescript
import { Text } from '../components/typography';

// Базовое использование
<Text variant="body">Основной текст</Text>

// С цветом
<Text variant="h1" color="primary">Заголовок</Text>
<Text variant="body" color="secondary">Вторичный текст</Text>

// С выравниванием
<Text variant="bodyLarge" align="center">Центрированный текст</Text>
```

#### Через theme напрямую

```typescript
import { useTheme } from '../theme/useTheme';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <TextInput
      style={theme.typography.body}
      // ...
    />
  );
};
```

### Цвета текста

Доступные цвета через prop `color`:

- `primary` - основной акцентный цвет
- `secondary` - вторичный текст (60% opacity)
- `tertiary` - третичный текст (40% opacity)
- `disabled` - отключенный текст
- `error` - ошибки
- `success` - успех
- `warning` - предупреждения
- `info` - информация

### Паттерны типографики

Используйте `typographyPatterns` для стандартных случаев:

```typescript
theme.typographyPatterns.screenTitle  // h1 для заголовков экранов
theme.typographyPatterns.sectionTitle // h3 для заголовков секций
theme.typographyPatterns.bodyText     // body для основного текста
theme.typographyPatterns.primaryButton // buttonLarge для CTA
```

### Правила

1. **Всегда используйте variant** - не хардкодите fontSize
2. **Следуйте иерархии** - h1 > h2 > h3 > body > caption
3. **Используйте правильные цвета** - не хардкодите цвета текста
4. **Оптимизируйте для чтения** - используйте bodyLarge для длинных текстов

### Accessibility

Все размеры соответствуют минимальным требованиям:
- Минимальный размер: 12px (captionSmall)
- Рекомендуемый размер: 17px (body)
- Высокий контраст: соответствует WCAG AA


