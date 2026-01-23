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
import { useTheme } from '../theme/useTheme';
import { RootStackParamList } from '../../App';
import { ScreenContainer, Container, Stack, Section } from '../components/layout';
import { Text } from '../components/typography';
import { Icon } from '../components/icons';

type CoachNotesNavigationProp = StackNavigationProp<RootStackParamList, 'CoachNotes'>;

export const CoachNotesScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<CoachNotesNavigationProp>();

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
      <StatusBar style={theme.background === '#FFFFFF' ? 'dark' : 'light'} />
      
      {/* Header */}
      <Container paddingVertical>
        <Stack direction="horizontal" align="center" gap={theme.spacing.lg - theme.spacing.xs}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="ArrowLeft" size={28} color={theme.primary} />
          </TouchableOpacity>
          <Stack gap={theme.spacing.xs}>
            <Text variant="h2">
              Coach's Internal Notes
            </Text>
            <Text variant="caption" color="secondary">
              Read-only
            </Text>
          </Stack>
        </Stack>
      </Container>
      <View style={[styles.headerBorder, { borderBottomColor: theme.divider }]} />

      {/* Content */}
      <ScrollView style={styles.content}>
        <Container padding>
          <Stack gap={theme.spacing.base}>
            {coachNotes.map((note) => (
              <View
                key={note.id}
                style={[
                  styles.noteCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Stack gap={theme.spacing.md}>
                  <Stack gap={theme.spacing.xs}>
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

