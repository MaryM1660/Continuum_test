import React from 'react';
import { StyleProp, ViewStyle, Platform } from 'react-native';
import { useTheme, useIsAppleHIG, useAppleHIGTheme, useOldTheme } from '../../theme/useTheme';
import { isAppleHIGTheme } from '../../theme/migration-utils';
import * as HeroIconsSolid from 'react-native-heroicons/solid';

// Маппинг имен иконок для удобства использования
const iconMap: Record<string, React.ComponentType<any>> = {
  // Навигация
  'Bars3': HeroIconsSolid.Bars3Icon,
  'ArrowLeft': HeroIconsSolid.ArrowLeftIcon,
  'ArrowRight': HeroIconsSolid.ArrowRightIcon,
  'XMark': HeroIconsSolid.XMarkIcon,
  
  // Микрофон и звук
  'Microphone': HeroIconsSolid.MicrophoneIcon,
  'MicrophoneSlash': HeroIconsSolid.MicrophoneIcon, // Временно используем Microphone, потом создадим композитную иконку
  'SpeakerWave': HeroIconsSolid.SpeakerWaveIcon,
  'AdjustmentsHorizontal': HeroIconsSolid.AdjustmentsHorizontalIcon,
  
  // Тема
  'Sun': HeroIconsSolid.SunIcon,
  'Moon': HeroIconsSolid.MoonIcon,
  
  // Документы и заметки
  'DocumentText': HeroIconsSolid.DocumentTextIcon,
  'ClipboardDocumentList': HeroIconsSolid.ClipboardDocumentListIcon,
  
  // Настройки и аккаунт
  'Cog6Tooth': HeroIconsSolid.Cog6ToothIcon,
  'User': HeroIconsSolid.UserIcon,
  'CreditCard': HeroIconsSolid.CreditCardIcon,
  'QuestionMarkCircle': HeroIconsSolid.QuestionMarkCircleIcon,
  'Envelope': HeroIconsSolid.EnvelopeIcon,
  'ChatBubbleLeftRight': HeroIconsSolid.ChatBubbleLeftRightIcon,
  'LockClosed': HeroIconsSolid.LockClosedIcon,
  'Document': HeroIconsSolid.DocumentIcon,
};

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Компонент иконок на основе Heroicons Solid
 * Используйте только иконки из этого компонента - никаких emoji!
 * 
 * Примеры использования:
 * <Icon name="Microphone" size={24} />
 * <Icon name="Bars3" size={28} color={theme.primary} />
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  style,
}) => {
  const theme = useTheme();
  const isAppleHIG = useIsAppleHIG();
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons: ${Object.keys(iconMap).join(', ')}`);
    return null;
  }

  // Получаем цвет текста в зависимости от темы
  let defaultTextColor: string;
  if (isAppleHIG && isAppleHIGTheme(theme)) {
    // Новая тема Apple HIG
    defaultTextColor = theme.colors.text;
  } else {
    // Старая тема
    const oldTheme = useOldTheme();
    defaultTextColor = oldTheme.text;
  }

  const iconColor = color || defaultTextColor;

  // Heroicons используют fill="currentColor" в SVG
  // Для веб-версии нужно убедиться, что color передается правильно через style
  // Также передаем color как prop для нативных платформ
  const iconStyle = Platform.OS === 'web' 
    ? [{ color: iconColor, fill: iconColor }, style]
    : style;

  return (
    <IconComponent
      size={size}
      color={iconColor}
      fill={iconColor}
      style={iconStyle}
    />
  );
};

// Экспортируем список всех доступных иконок
export const availableIcons = Object.keys(iconMap) as IconName[];

