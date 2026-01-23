import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { useThemeContext } from '../theme/ThemeContext';
import { darkTheme } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Text } from './typography';
import { Icon } from './icons';

type SideDrawerNavigationProp = StackNavigationProp<RootStackParamList>;

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
  onNavigate?: (screen: string) => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  visible,
  onClose,
  onNavigate,
}) => {
  const theme = useTheme();
  const { themeMode, toggleTheme } = useThemeContext();
  const navigation = useNavigation<SideDrawerNavigationProp>();
  const isDark = theme.background === darkTheme.background;
  
  // Анимация для плавного выезда слева
  const slideAnim = useRef(new Animated.Value(-320)).current; // Начальная позиция слева (вне экрана)
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      // Анимация появления: drawer выезжает слева, backdrop появляется
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Анимация исчезновения: drawer уезжает влево, backdrop исчезает
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -320,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, backdropOpacity]);

  const menuItems = [
    { id: 'SessionNotes', label: 'Session Notes', icon: 'DocumentText' as const },
    { id: 'CoachNotes', label: "Coach's Internal Notes", icon: 'ClipboardDocumentList' as const },
    { id: 'Account', label: 'Account & Support', icon: 'Cog6Tooth' as const },
  ];

  const handleItemPress = (itemId: string) => {
    if (itemId === 'SessionNotes') {
      navigation.navigate('SessionNotes');
    } else if (itemId === 'CoachNotes') {
      navigation.navigate('CoachNotes');
    } else if (itemId === 'Account') {
      navigation.navigate('Account');
    }
    if (onNavigate) {
      onNavigate(itemId);
    }
    onClose();
  };

  if (!visible && slideAnim._value === -320) {
    // Не рендерим компонент, если он скрыт и анимация завершена
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: theme.surfaceElevated,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {Platform.OS === 'web' ? (
            <View style={styles.drawerContent}>
              <View style={styles.header}>
                <Text variant="h1">Menu</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="XMark" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.menuList}>
                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleItemPress(item.id)}
                    style={[
                      styles.menuItem,
                      { borderBottomColor: theme.divider },
                    ]}
                  >
                    <Icon name={item.icon} size={26} style={styles.menuIcon} />
                    <Text variant="body" style={styles.menuLabel}>
                      {item.label}
                    </Text>
                    <Icon name="ArrowRight" size={22} color={theme.textTertiary} style={styles.menuArrow} />
                  </TouchableOpacity>
                ))}
                
                {/* Переключатель темы */}
                <View style={[styles.themeToggle, { borderTopColor: theme.divider }]}>
                  <View style={styles.themeToggleContent}>
                    <Icon name={isDark ? 'Moon' : 'Sun'} size={26} style={styles.themeIcon} />
                    <Text variant="body">
                      {isDark ? 'Dark Theme' : 'Light Theme'}
                    </Text>
                  </View>
                  <Switch
                    value={isDark}
                    onValueChange={toggleTheme}
                    trackColor={{ false: theme.border, true: theme.primary }}
                    thumbColor={theme.surfaceElevated}
                    ios_backgroundColor={theme.border}
                  />
                </View>
              </ScrollView>
            </View>
          ) : (
            <SafeAreaView 
              style={styles.drawerContent} 
              edges={['top', 'bottom', 'right']}
            >
              <View style={styles.header}>
                <Text variant="h1">Menu</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="XMark" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.menuList}>
                {menuItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleItemPress(item.id)}
                    style={[
                      styles.menuItem,
                      { borderBottomColor: theme.divider },
                    ]}
                  >
                    <Icon name={item.icon} size={26} style={styles.menuIcon} />
                    <Text variant="body" style={styles.menuLabel}>
                      {item.label}
                    </Text>
                    <Icon name="ArrowRight" size={22} color={theme.textTertiary} style={styles.menuArrow} />
                  </TouchableOpacity>
                ))}
                
                {/* Переключатель темы */}
                <View style={[styles.themeToggle, { borderTopColor: theme.divider }]}>
                  <View style={styles.themeToggleContent}>
                    <Icon name={isDark ? 'Moon' : 'Sun'} size={26} style={styles.themeIcon} />
                    <Text variant="body">
                      {isDark ? 'Dark Theme' : 'Light Theme'}
                    </Text>
                  </View>
                  <Switch
                    value={isDark}
                    onValueChange={toggleTheme}
                    trackColor={{ false: theme.border, true: theme.primary }}
                    thumbColor={theme.surfaceElevated}
                    ios_backgroundColor={theme.border}
                  />
                </View>
              </ScrollView>
            </SafeAreaView>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 0,
    marginLeft: 0,
  },
  drawer: {
    width: '80%',
    maxWidth: 320,
    paddingLeft: 0,
    marginLeft: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 }, // spacing.xs / 2 (тень справа, т.к. drawer слева)
    shadowOpacity: 0.25,
    shadowRadius: 10, // spacing.lg / 2
    elevation: 10,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  drawerContent: {
    flex: 1,
    paddingLeft: 0,
    marginLeft: 0,
    left: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24, // spacing.xl
    paddingBottom: 20, // spacing.lg
    borderBottomWidth: 1,
  },
  // Типографика применяется через Text компонент
  closeButton: {
    padding: 4, // spacing.xs
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20, // spacing.lg
    paddingVertical: 22, // spacing.lg + spacing.xs
    borderBottomWidth: 1,
  },
  menuIcon: {
    marginRight: 18, // spacing.lg - spacing.xs
  },
  menuLabel: {
    flex: 1,
  },
  menuArrow: {
    opacity: 0.6,
  },
  themeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24, // spacing.xl
    paddingVertical: 22, // spacing.lg + spacing.xs
    borderTopWidth: 1,
    marginTop: 12, // spacing.md
  },
  themeToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeIcon: {
    marginRight: 18, // spacing.lg - spacing.xs
  },
});

