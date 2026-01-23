# App Icons Specifications - Извлеченные данные

**URL:** https://developer.apple.com/design/human-interface-guidelines/app-icons#Specifications  
**Дата извлечения:** 2026-01-23

---

## Таблица 1: Platform specifications

**Всего строк:** 5 (включая заголовок)

| Platform | Layout shape | Icon shape after system masking | Layout size | Style | Appearances |
|----------|--------------|----------------------------------|-------------|-------|-------------|
| iOS, iPadOS, macOS | Square | Rounded rectangle (square) | 1024x1024 px | Layered | Default, dark, clear light, clear dark, tinted light, tinted dark |
| tvOS | Rectangle (landscape) | Rounded rectangle (rectangular) | 800x480 px | Layered (Parallax) | N/A |
| visionOS | Square | Circular | 1024x1024 px | Layered (3D) | N/A |
| watchOS | Square | Circular | 1088x1088 px | Layered | N/A |

---

## Дополнительная информация

### Color spaces
App icons support the following color spaces:
- sRGB (color)
- Gray Gamma 2.2 (grayscale)
- Display P3 (wide-gamut color in iOS, iPadOS, macOS, tvOS, and visionOS)

### Automatic scaling
The system automatically scales your icon to produce smaller variants that appear in certain locations.

---

## Примечания

- iOS, iPadOS, macOS используют квадратную форму с закругленными углами после системной маскировки
- tvOS использует прямоугольную форму (landscape) с закругленными углами
- visionOS и watchOS используют квадратную форму, которая становится круглой после системной маскировки
- iOS, iPadOS, macOS поддерживают 6 различных appearances (Default, dark, clear light, clear dark, tinted light, tinted dark)
- tvOS, visionOS, watchOS не поддерживают appearances (N/A)

