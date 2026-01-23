import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme } from '../theme/colors';
import { FeatherCloud } from './FeatherCloud';

const CLOUD_SIZE = 200;

interface CloudProps {
  theme: Theme;
  isSpeaking: boolean; // Пульсация только на голос коуча
  audioLevel?: number; // Не используется (для обратной совместимости)
  onPress?: () => void;
}

export const Cloud: React.FC<CloudProps> = ({ theme, isSpeaking, audioLevel = 0, onPress }) => {
  return (
    <View style={styles.container}>
      <FeatherCloud 
        theme={theme} 
        isSpeaking={isSpeaking} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
