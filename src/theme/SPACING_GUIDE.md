# Spacing System Guide

## Единая система отступов на основе 4pt grid

Все отступы в приложении должны использовать значения из `theme.spacing` или `theme.spacingPatterns`.

### Базовые значения (4pt grid)

```typescript
spacing = {
  xs: 4,      // 1x grid
  sm: 8,      // 2x grid
  md: 12,     // 3x grid
  base: 16,   // 4x grid (базовый отступ)
  lg: 20,     // 5x grid
  xl: 24,     // 6x grid
  '2xl': 32,  // 8x grid
  '3xl': 40,  // 10x grid
  '4xl': 48,  // 12x grid
  '5xl': 64,  // 16x grid
  '6xl': 80,  // 20x grid
  '7xl': 96,  // 24x grid
}
```

### Паттерны отступов

Используйте `spacingPatterns` для часто используемых случаев:

- `containerPadding`: 24px (spacing.xl)
- `containerPaddingHorizontal`: 24px
- `containerPaddingVertical`: 16px
- `listItemPadding`: 24px
- `buttonPaddingHorizontal`: 40px
- `buttonPaddingVertical`: 20px
- `cardPadding`: 24px
- `headerPadding`: 24px
- `sectionGap`: 32px
- `minTouchTarget`: 48px (iOS/Android minimum)

### Использование

```typescript
import { useTheme } from '../theme/useTheme';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ 
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.base,
      gap: theme.spacing.sm 
    }}>
      {/* Используйте spacingPatterns для стандартных случаев */}
      <View style={{ padding: theme.spacingPatterns.containerPadding }}>
        {/* content */}
      </View>
    </View>
  );
};
```

### Правила

1. **Всегда используйте spacing из theme** - не хардкодите значения
2. **Следуйте 4pt grid** - все отступы должны быть кратны 4
3. **Используйте spacingPatterns** для стандартных случаев
4. **Комментируйте значения** в StyleSheet.create для ясности

### Исключения

Некоторые значения могут не строго следовать 4pt grid:
- Размеры иконок (могут быть нечетными для визуального баланса)
- Размеры шрифтов (типографика имеет свои правила)
- Специфические размеры компонентов (кнопки, карточки)

Но даже в этих случаях старайтесь использовать значения, близкие к spacing системе.


