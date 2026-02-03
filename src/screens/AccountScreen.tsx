import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
import { llmService } from '../services/llmService';

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

  const [promptDraft, setPromptDraft] = useState<string>(llmService.getCustomPrompt() ?? '');
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);

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

  const handleSavePrompt = async () => {
    if (isSavingPrompt) return;
    setIsSavingPrompt(true);
    try {
      llmService.setSystemPrompt(promptDraft);
      llmService.resetConversation();
    } finally {
      setIsSavingPrompt(false);
    }
  };

  const handleResetPrompt = () => {
    setPromptDraft('');
    llmService.setSystemPrompt('');
  };

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
            <Section>
              <Stack gap={spacing.base}>
                <Text variant="overline" color="secondary">
                  Coach prompt
                </Text>
                <Text variant="body" color="secondary">
                  Optional instructions that will guide how the AI coach talks to you. You can describe tone, language, or focus areas.
                </Text>
                <View
                  style={[
                    styles.promptBox,
                    {
                      backgroundColor: surface,
                      borderColor: divider,
                    },
                  ]}
                >
                  <TextInput
                    multiline
                    placeholder="For example: &quot;Speak Russian, be very direct and challenge my assumptions about career moves.&quot;"
                    placeholderTextColor={textTertiary}
                    value={promptDraft}
                    onChangeText={setPromptDraft}
                    style={styles.promptInput}
                  />
                </View>
                <View style={styles.promptButtonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.promptButton,
                      { borderColor: divider },
                    ]}
                    onPress={handleResetPrompt}
                    disabled={isSavingPrompt}
                  >
                    <Text variant="body" color="secondary">
                      Reset to default
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.promptButton,
                      { borderColor: primary },
                    ]}
                    onPress={handleSavePrompt}
                    disabled={isSavingPrompt}
                  >
                    <Text variant="body">
                      {isSavingPrompt ? 'Saving…' : 'Save prompt'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Stack>
            </Section>
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
  promptBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
  },
  promptInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  promptButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 12,
  },
  promptButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
});

