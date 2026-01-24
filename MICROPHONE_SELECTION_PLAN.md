# План реализации выбора микрофона на мобильных устройствах

## Текущее состояние

### Стек:
- **React Native** 0.72.10
- **Expo** ~49.0.21
- **expo-av** ~13.4.1 (для аудио)
- **Web Speech API** (для web-платформы)

### Текущая реализация:
- **Web**: Используется `navigator.mediaDevices.getUserMedia()` и `navigator.mediaDevices.enumerateDevices()` для получения списка устройств
- **Mobile**: Текущая реализация работает только на web, для мобильных платформ нет функционала выбора микрофона

---

## План реализации

### Этап 1: Исследование и выбор подхода

#### 1.1. Варианты реализации для мобильных:

**Вариант A: expo-av (текущая библиотека)**
- ✅ Уже установлена в проекте
- ❌ Ограниченная поддержка выбора устройства ввода
- ❌ В Expo 49 `expo-av` не предоставляет прямого API для выбора микрофона

**Вариант B: expo-audio (новая библиотека)**
- ✅ Более современный API
- ✅ Лучшая поддержка выбора устройств
- ❌ Требует обновления Expo до версии 50+
- ❌ Может потребовать миграции кода

**Вариант C: Нативный модуль (Custom Native Module)**
- ✅ Полный контроль над выбором устройств
- ✅ Поддержка всех возможностей платформы
- ❌ Требует написания нативного кода (Swift/Kotlin)
- ❌ Сложнее в поддержке

**Вариант D: react-native-audio-recorder-player или аналоги**
- ✅ Специализированные библиотеки для работы с микрофоном
- ❌ Требуют дополнительной установки
- ❌ Могут конфликтовать с Expo managed workflow

#### 1.2. Рекомендуемый подход:
**Для Expo 49**: Использовать комбинацию `expo-av` + нативные возможности через `expo-modules-core` или создать простой нативный модуль.

**Для будущего**: Рассмотреть миграцию на `expo-audio` при обновлении Expo.

---

### Этап 2: Реализация для iOS

#### 2.1. Использование AVAudioSession
```swift
// iOS нативный код (если создаем custom module)
import AVFoundation

func getAvailableInputDevices() -> [AVAudioSessionPortDescription] {
    let session = AVAudioSession.sharedInstance()
    return session.availableInputs ?? []
}

func selectInputDevice(deviceUID: String) {
    let session = AVAudioSession.sharedInstance()
    if let input = session.availableInputs?.first(where: { $0.uid == deviceUID }) {
        try? session.setPreferredInput(input)
    }
}
```

#### 2.2. Типы устройств на iOS:
- **Built-in Microphone** (встроенный микрофон)
- **Bluetooth Headset** (Bluetooth наушники)
- **Wired Headset** (проводные наушники)
- **USB Microphone** (USB микрофон)

#### 2.3. Интеграция через Expo Module:
- Создать Expo Module для доступа к `AVAudioSession`
- Или использовать существующие библиотеки типа `expo-audio` (если обновим Expo)

---

### Этап 3: Реализация для Android

#### 3.1. Использование AudioManager и MediaRecorder
```kotlin
// Android нативный код (если создаем custom module)
import android.media.AudioManager
import android.media.MediaRecorder

fun getAvailableInputDevices(): List<AudioDeviceInfo> {
    val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    return audioManager.getDevices(AudioManager.GET_DEVICES_INPUTS)
}

fun selectInputDevice(deviceId: Int) {
    val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    // На Android выбор устройства происходит через MediaRecorder.setPreferredDevice()
}
```

#### 3.2. Типы устройств на Android:
- **Built-in Microphone** (встроенный микрофон)
- **Bluetooth Headset** (Bluetooth наушники)
- **Wired Headset** (проводные наушники)
- **USB Microphone** (USB микрофон)

#### 3.3. Интеграция через Expo Module:
- Создать Expo Module для доступа к `AudioManager`
- Использовать `MediaRecorder` для выбора устройства

---

### Этап 4: Создание сервиса выбора микрофона

#### 4.1. Структура сервиса:
```typescript
// src/services/audioDeviceSelection.ts

interface AudioInputDevice {
  id: string;
  label: string;
  type: 'builtin' | 'bluetooth' | 'wired' | 'usb';
  isDefault: boolean;
}

class AudioDeviceSelectionService {
  // Получить список доступных устройств
  async getAvailableDevices(): Promise<AudioInputDevice[]>
  
  // Выбрать устройство
  async selectDevice(deviceId: string): Promise<boolean>
  
  // Получить текущее выбранное устройство
  async getCurrentDevice(): Promise<AudioInputDevice | null>
  
  // Сохранить выбор пользователя
  async saveDevicePreference(deviceId: string): Promise<void>
  
  // Загрузить сохраненный выбор
  async loadDevicePreference(): Promise<string | null>
}
```

#### 4.2. Платформенная логика:
- **Web**: Использовать `navigator.mediaDevices.enumerateDevices()` (уже реализовано частично)
- **iOS**: Использовать нативный модуль с `AVAudioSession`
- **Android**: Использовать нативный модуль с `AudioManager`

---

### Этап 5: UI компонент для выбора

#### 5.1. Компонент выбора микрофона:
```typescript
// src/components/MicrophoneSelector.tsx

interface MicrophoneSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (deviceId: string) => void;
  currentDeviceId?: string;
}
```

#### 5.2. UI элементы:
- Модальное окно/шторка со списком устройств
- Иконка для каждого типа устройства (встроенный, Bluetooth, проводной, USB)
- Индикатор текущего выбранного устройства
- Кнопка "Применить" или автоматическое применение при выборе

#### 5.3. Размещение в UI:
- **Вариант A**: Иконка микрофона в сайдбаре (рядом с иконкой темы)
- **Вариант B**: Пункт меню в сайдбаре "Audio Settings"
- **Вариант C**: Настройки в отдельном экране Settings

---

### Этап 6: Интеграция с существующим кодом

#### 6.1. Обновление `microphone.ts`:
- Добавить поддержку выбора устройства для мобильных платформ
- Сохранять выбранное устройство в `AsyncStorage`
- Применять выбранное устройство при старте записи

#### 6.2. Обновление `voiceRecognition.ts`:
- Для web: Использовать `deviceId` в `getUserMedia()` constraints
- Для mobile: Передавать выбранное устройство в нативный модуль

#### 6.3. Обновление `TalkScreen.tsx`:
- Добавить обработчик для открытия селектора микрофона
- Отображать текущее выбранное устройство (опционально)
- Применять выбор при инициализации записи

---

### Этап 7: Обработка событий подключения/отключения устройств

#### 7.1. Слушатели событий:
- **iOS**: `AVAudioSessionRouteChangeNotification`
- **Android**: `AudioManager.ACTION_HEADSET_PLUG`, `BluetoothAdapter.ACTION_CONNECTION_STATE_CHANGED`
- **Web**: `devicechange` событие на `navigator.mediaDevices`

#### 7.2. Логика:
- При подключении нового устройства - обновить список
- При отключении текущего устройства - переключиться на встроенный микрофон
- Уведомить пользователя о смене устройства (опционально)

---

### Этап 8: Сохранение настроек

#### 8.1. Использование AsyncStorage:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@audio_device_preference';

async saveDevicePreference(deviceId: string) {
  await AsyncStorage.setItem(STORAGE_KEY, deviceId);
}

async loadDevicePreference(): Promise<string | null> {
  return await AsyncStorage.getItem(STORAGE_KEY);
}
```

#### 8.2. Применение при запуске:
- При инициализации приложения загружать сохраненное устройство
- Применять его при первом запросе доступа к микрофону

---

## Рекомендуемый порядок реализации

### Фаза 1: Подготовка (1-2 дня)
1. ✅ Исследовать возможности `expo-av` для выбора устройств
2. ✅ Решить: использовать существующие библиотеки или создать нативный модуль
3. ✅ Установить необходимые зависимости (`@react-native-async-storage/async-storage`)

### Фаза 2: Web версия (улучшение) (0.5 дня)
1. ✅ Улучшить существующую реализацию для web
2. ✅ Добавить UI для выбора устройства на web
3. ✅ Сохранение выбора для web

### Фаза 3: iOS реализация (2-3 дня)
1. ✅ Создать Expo Module для iOS (или использовать готовую библиотеку)
2. ✅ Реализовать получение списка устройств
3. ✅ Реализовать выбор устройства
4. ✅ Интегрировать с существующим кодом

### Фаза 4: Android реализация (2-3 дня)
1. ✅ Создать Expo Module для Android (или использовать готовую библиотеку)
2. ✅ Реализовать получение списка устройств
3. ✅ Реализовать выбор устройства
4. ✅ Интегрировать с существующим кодом

### Фаза 5: UI компонент (1 день)
1. ✅ Создать компонент `MicrophoneSelector`
2. ✅ Добавить в сайдбар или настройки
3. ✅ Стилизация по Apple HIG

### Фаза 6: Интеграция и тестирование (1-2 дня)
1. ✅ Интегрировать со всеми сервисами
2. ✅ Тестирование на реальных устройствах
3. ✅ Обработка edge cases (отключение устройства, отсутствие устройств)

---

## Альтернативные решения (если нативный модуль сложен)

### Вариант 1: Использовать готовые библиотеки
- `react-native-audio-recorder-player` - но требует eject из Expo managed workflow
- `@react-native-community/audio-toolkit` - устаревшая
- `expo-audio` - требует обновления Expo

### Вариант 2: Упрощенный подход
- На мобильных не давать выбор микрофона, использовать системный по умолчанию
- Только на web давать выбор (уже частично реализовано)
- Добавить в настройках информацию о текущем устройстве (read-only)

### Вариант 3: Использовать системные настройки
- На iOS/Android направлять пользователя в системные настройки для выбора микрофона
- Приложение использует то устройство, которое выбрано в системе

---

## Вопросы для уточнения

1. **Приоритет**: Насколько критично иметь выбор микрофона на мобильных? Может быть достаточно только на web?
2. **Expo версия**: Готовы ли обновить Expo до версии 50+ для использования `expo-audio`?
3. **Нативный код**: Готовы ли создавать нативные модули или предпочтительнее использовать готовые решения?
4. **UX**: Где разместить UI для выбора - в сайдбаре, в настройках, или отдельный экран?

---

## Следующие шаги

1. **Определить подход**: Нативный модуль vs готовые библиотеки vs упрощенный вариант
2. **Начать с web**: Улучшить существующую реализацию для web
3. **Прототип для мобильных**: Создать минимальный прототип для одной платформы (iOS или Android)
4. **Тестирование**: Протестировать на реальных устройствах с разными типами микрофонов

