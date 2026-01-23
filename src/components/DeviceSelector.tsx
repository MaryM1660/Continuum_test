import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { Text } from './typography';
import { Icon } from './icons';

interface Device {
  id: string;
  label: string;
  type: 'input' | 'output';
}

interface DeviceSelectorProps {
  visible: boolean;
  selectedInputDevice: string;
  selectedOutputDevice: string;
  onClose: () => void;
  onInputDeviceSelect: (deviceId: string) => void;
  onOutputDeviceSelect: (deviceId: string) => void;
}

const INPUT_DEVICES: Device[] = [
  { id: 'phone', label: 'Phone', type: 'input' },
  { id: 'headphones', label: 'Headphones', type: 'input' },
];

const OUTPUT_DEVICES: Device[] = [
  { id: 'speaker', label: 'Speaker', type: 'output' },
  { id: 'headphones', label: 'Headphones', type: 'output' },
];

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  visible,
  selectedInputDevice,
  selectedOutputDevice,
  onClose,
  onInputDeviceSelect,
  onOutputDeviceSelect,
}) => {
  const theme = useTheme();
  const spacing = theme.spacing;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.container, { backgroundColor: theme.surfaceElevated }]}>
            <View style={styles.header}>
              <Text variant="h2">Device Selection</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="XMark" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Microphone (input) */}
            <View style={styles.section}>
              <Text variant="label" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                Microphone
              </Text>
              {INPUT_DEVICES.map((device) => (
                <TouchableOpacity
                  key={device.id}
                  onPress={() => onInputDeviceSelect(device.id)}
                  style={[
                    styles.deviceItem,
                    {
                      backgroundColor: selectedInputDevice === device.id ? theme.primary + '20' : 'transparent',
                      borderColor: selectedInputDevice === device.id ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Icon 
                    name={device.id === 'headphones' ? 'SpeakerWave' : 'Microphone'} 
                    size={24} 
                    color={selectedInputDevice === device.id ? theme.primary : theme.textSecondary} 
                  />
                  <Text 
                    variant="body" 
                    style={[
                      styles.deviceLabel,
                      { color: selectedInputDevice === device.id ? theme.primary : theme.text },
                    ]}
                  >
                    {device.label}
                  </Text>
                  {selectedInputDevice === device.id && (
                    <Icon name="ArrowRight" size={20} color={theme.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Output Device */}
            <View style={styles.section}>
              <Text variant="label" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                Output Device
              </Text>
              {OUTPUT_DEVICES.map((device) => (
                <TouchableOpacity
                  key={device.id}
                  onPress={() => onOutputDeviceSelect(device.id)}
                  style={[
                    styles.deviceItem,
                    {
                      backgroundColor: selectedOutputDevice === device.id ? theme.primary + '20' : 'transparent',
                      borderColor: selectedOutputDevice === device.id ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Icon 
                    name={device.id === 'headphones' ? 'SpeakerWave' : 'SpeakerWave'} 
                    size={24} 
                    color={selectedOutputDevice === device.id ? theme.primary : theme.textSecondary} 
                  />
                  <Text 
                    variant="body" 
                    style={[
                      styles.deviceLabel,
                      { color: selectedOutputDevice === device.id ? theme.primary : theme.text },
                    ]}
                  >
                    {device.label}
                  </Text>
                  {selectedOutputDevice === device.id && (
                    <Icon name="ArrowRight" size={20} color={theme.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    // Используем variant="label" (13pt) из типографики, добавляем только дополнительные стили
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 8,
    gap: 12,
  },
  deviceLabel: {
    flex: 1,
    // variant="body" уже имеет правильный размер (17pt), добавляем только fontWeight для акцента
    fontWeight: '500',
  },
});

