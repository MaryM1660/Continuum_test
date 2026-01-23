import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme } from '../theme/colors';
import { FeatherCloud } from './FeatherCloud';

const CLOUD_SIZE = 200;

interface CloudProps {
  theme: Theme;
  isSpeaking: boolean;
  audioLevel?: number; // 0-1 для эквалайзера
  onPress?: () => void;
}

export const Cloud: React.FC<CloudProps> = ({ theme, isSpeaking, audioLevel = 0, onPress }) => {
  return (
    <View style={styles.container}>
      <FeatherCloud 
        theme={theme} 
        isSpeaking={isSpeaking} 
        audioLevel={audioLevel} 
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
