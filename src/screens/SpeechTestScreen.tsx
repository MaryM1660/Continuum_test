import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '../components/typography';
import { useTheme } from '../theme/useTheme';
import { ScreenContainer, Container, Stack, Section } from '../components/layout';

export const SpeechTestScreen: React.FC = () => {
  const theme = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Not started');
  const [recognizedText, setRecognizedText] = useState('(waiting for speech...)');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        addLog('✅ Speech Recognition available');
      } else {
        addLog('❌ Speech Recognition not available');
      }
    }
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev, logMessage]);
    console.log(logMessage);
  };

  const startListening = () => {
    if (typeof window === 'undefined') {
      addLog('❌ Window not available');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addLog('❌ Speech Recognition not available');
      return;
    }

    addLog('🚀 Creating new SpeechRecognition instance...');
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || 'en-US';

    addLog(`🌐 Language: ${recognition.lang}`);
    addLog(`🔄 Continuous: ${recognition.continuous}`);
    addLog(`📝 Interim results: ${recognition.interimResults}`);

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('✅ Listening... Speak now!');
      addLog('✅✅✅ Recognition started!');
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatus('⏹️ Ended');
      addLog('⏹️ Recognition ended');
      
      // Автоматически перезапускаем
      addLog('🔄 Auto-restarting...');
      setTimeout(() => {
        try {
          recognition.start();
        } catch (e: any) {
          addLog(`❌ Restart error: ${e.message}`);
        }
      }, 100);
    };

    recognition.onerror = (event: any) => {
      addLog(`❌ Error: ${event.error}`);
      if (event.error === 'no-speech') {
        addLog('ℹ️ No speech detected (normal if not speaking)');
      } else if (event.error === 'aborted') {
        addLog('ℹ️ Recognition aborted (normal)');
      } else {
        setStatus(`❌ Error: ${event.error}`);
      }
    };

    recognition.onaudiostart = () => {
      addLog('🎤🎤🎤 Audio capture started!');
    };

    recognition.onaudioend = () => {
      addLog('🔇 Audio capture ended');
    };

    recognition.onsoundstart = () => {
      addLog('🔊🔊🔊 Sound detected!');
    };

    recognition.onspeechstart = () => {
      addLog('🗣️🗣️🗣️ Speech detected!');
    };

    recognition.onresult = (event: any) => {
      let finalText = '';
      let interimText = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      const text = finalText || interimText;
      if (text) {
        setRecognizedText(text);
        if (finalText) {
          addLog(`✅✅✅ FINAL RESULT: "${finalText}"`);
        } else {
          addLog(`⏳ Interim: "${interimText}"`);
        }
      }
    };

    // Сохраняем recognition в window для доступа из stop
    (window as any).testRecognition = recognition;

    addLog('🚀 Starting recognition...');
    try {
      recognition.start();
    } catch (error: any) {
      addLog(`❌ Start error: ${error.message}`);
    }
  };

  const stopListening = () => {
    if ((window as any).testRecognition) {
      (window as any).testRecognition.stop();
      (window as any).testRecognition = null;
      addLog('🛑 Stopped');
    }
  };

  return (
    <ScreenContainer>
      <Container>
        <Stack gap={theme.spacing.xl}>
          <Section>
            <Text variant="h1">🎤 Speech Recognition Test</Text>
          </Section>

          <Section>
            <Stack gap={theme.spacing.base} direction="row">
              <TouchableOpacity
                onPress={startListening}
                disabled={isListening}
                style={[
                  styles.button,
                  {
                    backgroundColor: isListening ? theme.textDisabled : theme.primary,
                    opacity: isListening ? 0.5 : 1,
                  }
                ]}
              >
                <Text variant="button" color="primary">
                  Start Listening
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={stopListening}
                disabled={!isListening}
                style={[
                  styles.button,
                  {
                    backgroundColor: !isListening ? theme.textDisabled : theme.error,
                    opacity: !isListening ? 0.5 : 1,
                  }
                ]}
              >
                <Text variant="button" color="primary">
                  Stop
                </Text>
              </TouchableOpacity>
            </Stack>
          </Section>

          <Section>
            <View style={[styles.statusBox, { backgroundColor: theme.surface }]}>
              <Text variant="body">
                <Text variant="label">Status: </Text>
                {status}
              </Text>
            </View>
          </Section>

          <Section>
            <View style={[styles.resultBox, { backgroundColor: theme.surface }]}>
              <Text variant="h3" style={{ marginBottom: theme.spacing.base }}>
                Recognized Text:
              </Text>
              <Text variant="body" style={{ fontSize: 20, lineHeight: 28 }}>
                {recognizedText}
              </Text>
            </View>
          </Section>

          <Section>
            <Text variant="label" style={{ marginBottom: theme.spacing.sm }}>
              Console Log:
            </Text>
            <ScrollView
              style={[styles.logBox, { backgroundColor: theme.background }]}
              nestedScrollEnabled
            >
              {logs.map((log, index) => (
                <Text
                  key={index}
                  variant="caption"
                  style={{
                    fontFamily: 'monospace',
                    marginBottom: theme.spacing.xs,
                    color: log.includes('❌') ? theme.error : log.includes('✅') ? theme.success : theme.text,
                  }}
                >
                  {log}
                </Text>
              ))}
            </ScrollView>
          </Section>
        </Stack>
      </Container>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  statusBox: {
    padding: 16,
    borderRadius: 8,
    minHeight: 50,
  },
  resultBox: {
    padding: 16,
    borderRadius: 8,
    minHeight: 150,
  },
  logBox: {
    maxHeight: 300,
    padding: 12,
    borderRadius: 8,
  },
});

