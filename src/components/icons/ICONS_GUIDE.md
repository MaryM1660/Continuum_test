# Icons Guide

## Heroicons Solid - Единственный источник иконок

Приложение использует **только** иконки из пакета **Heroicons Solid** (официальный пакет от Tailwind CSS).

**Важно:** Никаких emoji! Используйте только компонент `<Icon />`.

## Использование

```typescript
import { Icon } from '../components/icons';

// Базовое использование
<Icon name="Microphone" size={24} />

// С цветом
<Icon name="Bars3" size={28} color={theme.primary} />

// С кастомным стилем
<Icon name="ArrowLeft" size={24} style={{ marginRight: 8 }} />
```

## Доступные иконки

### Навигация
- `Bars3` - меню (гамбургер)
- `ArrowLeft` - стрелка влево (назад)
- `ArrowRight` - стрелка вправо
- `XMark` - закрыть

### Микрофон и звук
- `Microphone` - микрофон активный
- `MicrophoneSlash` - микрофон отключен (использует NoSymbol)
- `SpeakerWave` - звук
- `AdjustmentsHorizontal` - настройки звука

### Тема
- `Sun` - светлая тема
- `Moon` - темная тема

### Документы и заметки
- `DocumentText` - документ с текстом
- `ClipboardDocumentList` - список документов

### Настройки и аккаунт
- `Cog6Tooth` - настройки
- `User` - пользователь
- `CreditCard` - карта/подписка
- `QuestionMarkCircle` - помощь
- `Envelope` - почта
- `ChatBubbleLeftRight` - обратная связь
- `LockClosed` - приватность
- `Document` - документ

## Добавление новых иконок

Если нужна новая иконка:

1. Проверьте, есть ли она в Heroicons: https://heroicons.com/
2. Добавьте в `iconMap` в `src/components/icons/Icon.tsx`:
```typescript
'NewIconName': HeroIconsSolid.NewIconNameIcon,
```
3. Используйте в компонентах:
```typescript
<Icon name="NewIconName" size={24} />
```

## Правила

1. **Только Heroicons Solid** - никаких других источников иконок
2. **Никаких emoji** - используйте только компонент Icon
3. **Консистентность** - используйте одинаковые иконки для одинаковых действий
4. **Размеры** - следуйте типографической системе (обычно 24px для стандартных, 28px для заголовков)

## Размеры иконок

- **Маленькие**: 20px - для мелких элементов
- **Стандартные**: 24px - для обычных кнопок и элементов
- **Средние**: 26-28px - для меню и навигации
- **Большие**: 36px - для основных CTA кнопок

