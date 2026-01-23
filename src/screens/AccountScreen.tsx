import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme, useIsAppleHIG, useAppleHIGTheme, useOldTheme } from '../theme/useTheme';
import { isAppleHIGTheme } from '../theme/migration-utils';
import { RootStackParamList } from '../../App';
import { ScreenContainer, Container, Stack, Section } from '../components/layout';
import { Text } from '../components/typography';
import { Icon } from '../components/icons';

type AccountNavigationProp = StackNavigationProp<RootStackParamList, 'Account'>;

export const AccountScreen: React.FC = () => {
  const theme = useTheme();
  const isAppleHIG = useIsAppleHIG();
  const navigation = useNavigation<AccountNavigationProp>();
  
  // Получаем значения в зависимости от темы
  let spacing: any;
  let primary: string;
  let divider: string;
  let surface: string;
  let textTertiary: string;
  let background: string;
  
  if (isAppleHIG && isAppleHIGTheme(theme)) {
    spacing = theme.spacing;
    primary = theme.colors.primary;
    divider = theme.colors.divider;
    surface = theme.colors.surface;
    textTertiary = theme.colors.textTertiary;
    background = theme.colors.background;
  } else {
    const oldTheme = useOldTheme();
    spacing = oldTheme.spacing;
    primary = oldTheme.primary;
    divider = oldTheme.divider;
    surface = oldTheme.surface;
    textTertiary = oldTheme.textTertiary;
    background = oldTheme.background;
  }

  const accountItems = [
    { id: 'profile', label: 'Profile', icon: 'User' as const },
    { id: 'subscription', label: 'Subscription', icon: 'CreditCard' as const },
    { id: 'settings', label: 'Settings', icon: 'Cog6Tooth' as const },
  ];

  const supportItems = [
    { id: 'help', label: 'Help Center', icon: 'QuestionMarkCircle' as const },
    { id: 'contact', label: 'Contact Support', icon: 'Envelope' as const },
    { id: 'feedback', label: 'Send Feedback', icon: 'ChatBubbleLeftRight' as const },
  ];

  const legalItems = [
    { id: 'privacy', label: 'Privacy Policy', icon: 'LockClosed' as const },
    { id: 'terms', label: 'Terms of Service', icon: 'Document' as const },
  ];

  const renderSection = (title: string, items: typeof accountItems) => (
    <Section>
      <Stack gap={spacing.base}>
        <Text variant="overline" color="secondary">
          {title}
        </Text>
        <Stack gap={0}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                {
                  backgroundColor: surface,
                  borderBottomColor: divider,
                },
              ]}
            >
              <Stack direction="horizontal" align="center" gap={spacing.lg - spacing.xs}>
                <Icon name={item.icon} size={26} style={styles.itemIcon} />
                <Text variant="body" style={styles.itemLabel}>
                  {item.label}
                </Text>
                <Icon name="ArrowRight" size={22} color={textTertiary} style={styles.itemArrow} />
              </Stack>
            </TouchableOpacity>
          ))}
        </Stack>
      </Stack>
    </Section>
  );

  return (
    <ScreenContainer>
      <StatusBar style={background === '#FFFFFF' ? 'dark' : 'light'} />
      
      {/* Header */}
      <Container paddingVertical>
        <Stack direction="horizontal" align="center" gap={spacing.lg - spacing.xs}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="ArrowLeft" size={28} color={primary} />
          </TouchableOpacity>
          <Text variant="h1">
            Account & Support
          </Text>
        </Stack>
      </Container>
      <View style={[styles.headerBorder, { borderBottomColor: divider }]} />

      {/* Content */}
      <ScrollView style={styles.content}>
        <Container padding>
          <Stack gap={spacing['2xl']}>
            {renderSection('Account', accountItems)}
            {renderSection('Support', supportItems)}
            {renderSection('Legal', legalItems)}
          </Stack>
        </Container>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerBorder: {
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 6, // spacing.md / 2
  },
  // Типографика применяется через Text компонент
  content: {
    flex: 1,
  },
  item: {
    padding: 20, // spacing.lg
    paddingVertical: 22, // spacing.lg + spacing.xs
    borderBottomWidth: 1,
  },
  itemIcon: {
    // Размер иконки через variant="h2"
  },
  itemLabel: {
    flex: 1,
  },
  itemArrow: {
    opacity: 0.6,
  },
});

