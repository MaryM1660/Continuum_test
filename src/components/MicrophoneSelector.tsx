import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { useTheme, useIsAppleHIG, useAppleHIGTheme, useOldTheme } from '../theme/useTheme';
import { isAppleHIGTheme } from '../theme/migration-utils';
import { Icon } from './icons';
import { Text } from './typography';
import { LiquidGlassButton } from './LiquidGlassButton';
import { audioDeviceService, AudioInputDevice } from '../services/audioDeviceService';

interface MicrophoneSelectorProps {
  onDeviceSelect?: (deviceId: string) => void;
}

export const MicrophoneSelector: React.FC<MicrophoneSelectorProps> = ({
  onDeviceSelect,
}) => {
  const theme = useTheme();
  const isAppleHIG = useIsAppleHIG();
  
  // Получаем значения в зависимости от темы
  let spacing: any;
  let textSecondary: string;
  let textTertiary: string;
  let background: string;
  let text: string;
  let primary: string;
  let surface: string;
  
  if (isAppleHIG && isAppleHIGTheme(theme)) {
    spacing = theme.spacing;
    textSecondary = theme.colors.textSecondary;
    textTertiary = theme.colors.textTertiary;
    background = theme.colors.background;
    text = theme.colors.text;
    primary = theme.colors.primary;
    surface = theme.colors.surface;
  } else {
    const oldTheme = useOldTheme();
    spacing = oldTheme.spacing;
    textSecondary = oldTheme.textSecondary;
    textTertiary = oldTheme.textTertiary;
    background = oldTheme.background;
    text = oldTheme.text;
    primary = oldTheme.primary;
    surface = oldTheme.surface;
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [devices, setDevices] = useState<AudioInputDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Загружаем устройства при открытии модального окна
  useEffect(() => {
    if (modalVisible) {
      loadDevices();
    }
  }, [modalVisible]);

  // Загружаем сохраненное устройство при монтировании
  useEffect(() => {
    loadSelectedDevice();
  }, []);

  const loadDevices = async () => {
    setLoading(true);
    try {
      const availableDevices = await audioDeviceService.getAvailableDevices();
      setDevices(availableDevices);
      
      // Если нет выбранного устройства, выбираем дефолтное
      if (!selectedDeviceId && availableDevices.length > 0) {
        const defaultDevice = availableDevices.find(d => d.isDefault) || availableDevices[0];
        setSelectedDeviceId(defaultDevice.id);
      }
    } catch (error) {
      console.error('Error loading devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedDevice = async () => {
    try {
      const savedDeviceId = audioDeviceService.getSelectedDeviceId();
      if (savedDeviceId) {
        setSelectedDeviceId(savedDeviceId);
      }
    } catch (error) {
      console.error('Error loading selected device:', error);
    }
  };

  const handleDeviceSelect = async (device: AudioInputDevice) => {
    try {
      const success = await audioDeviceService.selectDevice(device.id);
      if (success) {
        setSelectedDeviceId(device.id);
        onDeviceSelect?.(device.id);
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error selecting device:', error);
    }
  };

  const getDeviceIcon = (type: AudioInputDevice['type']) => {
    switch (type) {
      case 'bluetooth':
        return 'Signal';
      case 'wired':
        return 'Headphones';
      case 'usb':
        return 'Cable';
      default:
        return 'Microphone';
    }
  };

  const selectedDevice = devices.find(d => d.id === selectedDeviceId);

  return (
    <>
      <LiquidGlassButton
        onPress={() => setModalVisible(true)}
        variant="secondary"
        style={styles.selectorButton}
        borderRadius={44}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center' }} pointerEvents="none">
          <Icon name="Microphone" size={24} color={text} />
          {selectedDevice && selectedDevice.type !== 'default' && (
            <View style={styles.badge}>
              <Icon name={getDeviceIcon(selectedDevice.type)} size={12} color={primary} />
            </View>
          )}
        </View>
      </LiquidGlassButton>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={[styles.modalContent, { backgroundColor: surface }]}>
            <View style={styles.modalHeader}>
              <Text variant="title2">Select Microphone</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="XMark" size={24} color={textSecondary} />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text variant="body" style={{ color: textSecondary }}>
                  Loading devices...
                </Text>
              </View>
            ) : (
              <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelected = item.id === selectedDeviceId;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.deviceItem,
                        isSelected && { backgroundColor: primary + '20' },
                      ]}
                      onPress={() => handleDeviceSelect(item)}
                    >
                      <View style={styles.deviceIconContainer}>
                        <Icon
                          name={getDeviceIcon(item.type)}
                          size={24}
                          color={isSelected ? primary : textSecondary}
                        />
                      </View>
                      <View style={styles.deviceInfo}>
                        <Text
                          variant="body"
                          style={{
                            color: isSelected ? primary : text,
                            fontWeight: isSelected ? '600' : '400',
                          }}
                        >
                          {item.label}
                        </Text>
                        {item.isDefault && (
                          <Text variant="caption" style={{ color: textTertiary }}>
                            Default
                          </Text>
                        )}
                      </View>
                      {isSelected && (
                        <Icon name="CheckCircle" size={24} color={primary} />
                      )}
                    </TouchableOpacity>
                  );
                }}
                ItemSeparatorComponent={() => (
                  <View style={[styles.separator, { backgroundColor: textTertiary + '30' }]} />
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 56,
  },
  deviceIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  deviceInfo: {
    flex: 1,
  },
  separator: {
    height: 1,
    marginLeft: 80,
  },
});


