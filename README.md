# Continuum Career Coach - Mobile Prototype

Mobile app prototype for a voice-first career coach on iOS and Android.

## 🎯 Concept

Voice-first career coach for tech professionals (SWE, DevOps, Data, Product). The app helps users think out loud about career direction and strategy.

## 🚀 Technologies

- **React Native** + **Expo** - cross-platform development
- **TypeScript** - type safety
- **React Navigation** - navigation
- **React Native Reanimated** - animations
- **Expo AV** - audio handling
- **Expo Speech** - speech synthesis
- Dark and light themes (automatically based on device settings)

## 🎨 Design

- **Primary accent**: #1F7EB9 (blue)
- High contrast, eye-friendly
- Calm, technical, professional style
- Dark and light theme support
- Unified spacing system (4pt grid)
- Typography system based on iOS HIG and Material Design

## 📱 Screens

1. **Talk Screen** - main screen
   - Onboarding (3 steps)
   - Microphone control buttons

2. **Side Drawer** - side menu
   - Session Notes
   - Coach's Internal Notes
   - Account & Support

3. **Session Notes** - editable document
   - Search through notes
   - Hashtag filters

4. **Coach's Internal Notes** - coach's notes (read-only)

5. **Account & Support** - settings and support

## 🛠 Installation and Running

1. Install dependencies:
```bash
npm install
```

2. Run the application:
```bash
npm start
```

3. Choose platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code in Expo Go app on your phone
   - For web: `npm run web` or use `start-web.ps1`

## 📁 Project Structure

```
├── src/
│   ├── components/      # UI components (MicButtons, SideDrawer)
│   │   ├── icons/       # Icon components (Heroicons Solid)
│   │   ├── layout/      # Layout components (Container, Section, Stack)
│   │   └── typography/  # Typography components
│   ├── screens/         # App screens
│   ├── services/        # Voice interaction emulation
│   └── theme/           # Theme system (colors, typography, spacing)
├── App.tsx              # Main component with navigation
└── package.json
```

## ✨ Features

- **Voice Interaction**: 
  - Speech synthesis emulation
  - Microphone permission request
  - Sound visualization

- **Themes**: 
  - Automatic device theme detection
  - High contrast for comfortable reading
  - Theme toggle in sidebar

- **Typography System**:
  - Based on iOS Human Interface Guidelines and Material Design
  - Consistent font sizes, line heights, and weights
  - All text elements use proper typography variants

## 📝 Notes

This is a prototype for demonstration. All voice interaction is emulated locally.
