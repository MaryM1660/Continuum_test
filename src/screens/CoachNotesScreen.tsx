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

type CoachNotesNavigationProp = StackNavigationProp<RootStackParamList, 'CoachNotes'>;

export const CoachNotesScreen: React.FC = () => {
  const theme = useTheme();
  const isAppleHIG = useIsAppleHIG();
  const navigation = useNavigation<CoachNotesNavigationProp>();
  
  // Получаем значения в зависимости от темы
  let spacing: any;
  let primary: string;
  let divider: string;
  let surface: string;
  let border: string;
  let background: string;
  
  if (isAppleHIG && isAppleHIGTheme(theme)) {
    spacing = theme.spacing;
    primary = theme.colors.primary;
    divider = theme.colors.divider;
    surface = theme.colors.surface;
    border = theme.colors.border;
    background = theme.colors.background;
  } else {
    const oldTheme = useOldTheme();
    spacing = oldTheme.spacing;
    primary = oldTheme.primary;
    divider = oldTheme.divider;
    surface = oldTheme.surface;
    border = oldTheme.border;
    background = oldTheme.background;
  }

  // Эмулированные заметки коуча
  const coachNotes = [
    {
      id: '1',
      title: 'Career Direction Assessment',
      content: 'User is exploring transition from software engineering to product management. Key themes: interest in user experience, desire for more strategic work, concerns about technical skills becoming obsolete.',
      date: '2024-01-15',
    },
    {
      id: '2',
      title: 'Skills Gap Analysis',
      content: 'Identified gaps: product strategy, user research, stakeholder management. Strengths: technical background, analytical thinking, problem-solving.',
      date: '2024-01-15',
    },
    {
      id: '3',
      title: 'Action Plan',
      content: '1. Shadow a PM for 2 weeks\n2. Take product management course\n3. Lead a small product initiative at current role\n4. Build portfolio of product thinking exercises',
      date: '2024-01-16',
    },
  ];

  return (
    <ScreenContainer>
      <StatusBar style={background === '#FFFFFF' ? 'dark' : 'light'} />
      
      {/* Header */}
      <Container paddingVertical>
        <Stack direction="horizontal" align="center" gap={spacing.lg - spacing.xs}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="ArrowLeft" size={28} color={primary} />
          </TouchableOpacity>
          <Stack gap={spacing.xs}>
            <Text variant="h2">
              Coach's Internal Notes
            </Text>
            <Text variant="caption" color="secondary">
              Read-only
            </Text>
          </Stack>
        </Stack>
      </Container>
      <View style={[styles.headerBorder, { borderBottomColor: divider }]} />

      {/* Content */}
      <ScrollView style={styles.content}>
        <Container padding>
          <Stack gap={spacing.base}>
            {coachNotes.map((note) => (
              <View
                key={note.id}
                style={[
                  styles.noteCard,
                  {
                    backgroundColor: surface,
                    borderColor: border,
                  },
                ]}
              >
                <Stack gap={spacing.md}>
                  <Stack gap={spacing.xs}>
                    <Text variant="h4">
                      {note.title}
                    </Text>
                    <Text variant="captionSmall" color="tertiary">
                      {note.date}
                    </Text>
                  </Stack>
                  <Text variant="bodySmall" color="secondary">
                    {note.content}
                  </Text>
                </Stack>
              </View>
            ))}
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
  noteCard: {
    padding: 20, // spacing.lg
    borderRadius: 12, // spacing.md
    borderWidth: 1,
  },
  // Типографика применяется через Text компонент
});

