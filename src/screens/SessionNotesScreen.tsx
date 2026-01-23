import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../theme/useTheme';
import { RootStackParamList } from '../../App';
import { ScreenContainer, Container, Stack } from '../components/layout';
import { Text } from '../components/typography';
import { Icon } from '../components/icons';

type SessionNotesNavigationProp = StackNavigationProp<RootStackParamList, 'SessionNotes'>;

export const SessionNotesScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<SessionNotesNavigationProp>();
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  const hashtags = ['#career', '#goals', '#skills', '#challenges', '#insights'];

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags((prev) =>
      prev.includes(hashtag)
        ? prev.filter((h) => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  return (
    <ScreenContainer>
      <StatusBar style={theme.background === '#FFFFFF' ? 'dark' : 'light'} />
      
      {/* Header */}
      <Container paddingVertical>
        <Stack direction="horizontal" align="center" gap={theme.spacing.lg - theme.spacing.xs}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="ArrowLeft" size={28} color={theme.primary} />
          </TouchableOpacity>
          <Text variant="h1">Session Notes</Text>
        </Stack>
      </Container>
      <View style={[styles.headerBorder, { borderBottomColor: theme.divider }]} />

      {/* Поиск */}
      <Container paddingVertical paddingHorizontal={false}>
        <View style={[styles.searchWrapper, { backgroundColor: theme.surface }]}>
          <TextInput
            style={[
              theme.typography.body,
              styles.searchInput,
              { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }
            ]}
            placeholder="Search notes..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Container>
      <View style={[styles.headerBorder, { borderBottomColor: theme.divider }]} />

      {/* Хештеги фильтры */}
      <Container paddingVertical paddingHorizontal={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hashtagsContent}
        >
          <Stack direction="horizontal" gap={theme.spacing.sm}>
            {hashtags.map((hashtag) => {
              const isSelected = selectedHashtags.includes(hashtag);
              return (
                <TouchableOpacity
                  key={hashtag}
                  onPress={() => toggleHashtag(hashtag)}
                  style={[
                    styles.hashtag,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text
                    variant="bodySmall"
                    style={{ color: isSelected ? theme.primaryContrast : theme.text }}
                  >
                    {hashtag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Stack>
        </ScrollView>
      </Container>
      <View style={[styles.headerBorder, { borderBottomColor: theme.divider }]} />

      {/* Редактор заметок */}
      <Container padding paddingHorizontal={false} style={styles.notesContainer}>
        <TextInput
          style={[
            theme.typography.body,
            styles.notesInput,
            {
              color: theme.text,
              backgroundColor: theme.surface,
            },
          ]}
          placeholder="Start writing your notes here..."
          placeholderTextColor={theme.textTertiary}
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
        />
      </Container>
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
  searchWrapper: {
    paddingHorizontal: 16, // spacing.base
  },
  searchInput: {
    padding: 12, // spacing.md
    borderRadius: 8, // spacing.sm
    borderWidth: 1,
  },
  hashtagsContent: {
    paddingHorizontal: 16, // spacing.base
  },
  hashtag: {
    paddingHorizontal: 16, // spacing.base
    paddingVertical: 8, // spacing.sm
    borderRadius: 20, // spacing.lg
    borderWidth: 1,
  },
  hashtagText: {
    // Используем типографику из theme
  },
  notesContainer: {
    flex: 1,
  },
  notesInput: {
    flex: 1,
    // Используем типографику из theme
  },
});

