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
import { useTheme, useIsAppleHIG, useAppleHIGTheme, useOldTheme } from '../theme/useTheme';
import { isAppleHIGTheme } from '../theme/migration-utils';
import { RootStackParamList } from '../../App';
import { ScreenContainer, Container, Stack } from '../components/layout';
import { Text } from '../components/typography';
import { Icon } from '../components/icons';

type SessionNotesNavigationProp = StackNavigationProp<RootStackParamList, 'SessionNotes'>;

export const SessionNotesScreen: React.FC = () => {
  const theme = useTheme();
  const isAppleHIG = useIsAppleHIG();
  const navigation = useNavigation<SessionNotesNavigationProp>();
  
  // Получаем значения в зависимости от темы
  let spacing: any;
  let primary: string;
  let divider: string;
  let surface: string;
  let text: string;
  let border: string;
  let textTertiary: string;
  let primaryContrast: string;
  let background: string;
  let bodyTypography: any;
  
  if (isAppleHIG && isAppleHIGTheme(theme)) {
    // Новая тема Apple HIG
    spacing = theme.spacing;
    primary = theme.colors.primary;
    divider = theme.colors.divider;
    surface = theme.colors.surface;
    text = theme.colors.text;
    border = theme.colors.border;
    textTertiary = theme.colors.textTertiary;
    primaryContrast = '#FFFFFF'; // Белый текст на primary фоне
    background = theme.colors.background;
    bodyTypography = theme.typography.body;
  } else {
    // Старая тема
    const oldTheme = useOldTheme();
    spacing = oldTheme.spacing;
    primary = oldTheme.primary;
    divider = oldTheme.divider;
    surface = oldTheme.surface;
    text = oldTheme.text;
    border = oldTheme.border;
    textTertiary = oldTheme.textTertiary;
    primaryContrast = oldTheme.primaryContrast;
    background = oldTheme.background;
    bodyTypography = oldTheme.typography.body;
  }
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
      <StatusBar style={background === '#FFFFFF' ? 'dark' : 'light'} />
      
      {/* Header */}
      <Container paddingVertical>
        <Stack direction="horizontal" align="center" gap={spacing.lg - spacing.xs}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="ArrowLeft" size={28} color={primary} />
          </TouchableOpacity>
          <Text variant="h1">Session Notes</Text>
        </Stack>
      </Container>
      <View style={[styles.headerBorder, { borderBottomColor: divider }]} />

      {/* Поиск */}
      <Container paddingVertical paddingHorizontal={false}>
        <View style={[styles.searchWrapper, { backgroundColor: surface }]}>
          <TextInput
            style={[
              bodyTypography,
              styles.searchInput,
              { color: text, borderColor: border, backgroundColor: background }
            ]}
            placeholder="Search notes..."
            placeholderTextColor={textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Container>
      <View style={[styles.headerBorder, { borderBottomColor: divider }]} />

      {/* Хештеги фильтры */}
      <Container paddingVertical paddingHorizontal={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hashtagsContent}
        >
          <Stack direction="horizontal" gap={spacing.sm}>
            {hashtags.map((hashtag) => {
              const isSelected = selectedHashtags.includes(hashtag);
              return (
                <TouchableOpacity
                  key={hashtag}
                  onPress={() => toggleHashtag(hashtag)}
                  style={[
                    styles.hashtag,
                    {
                      backgroundColor: isSelected ? primary : surface,
                      borderColor: border,
                    },
                  ]}
                >
                  <Text
                    variant="bodySmall"
                    style={{ color: isSelected ? primaryContrast : text }}
                  >
                    {hashtag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Stack>
        </ScrollView>
      </Container>
      <View style={[styles.headerBorder, { borderBottomColor: divider }]} />

      {/* Редактор заметок */}
      <Container padding paddingHorizontal={false} style={styles.notesContainer}>
        <TextInput
          style={[
            bodyTypography,
            styles.notesInput,
            {
              color: text,
              backgroundColor: surface,
            },
          ]}
          placeholder="Start writing your notes here..."
          placeholderTextColor={textTertiary}
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

