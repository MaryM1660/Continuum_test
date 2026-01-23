import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme/ThemeContext';
import { TalkScreen } from './src/screens/TalkScreen';
import { SessionNotesScreen } from './src/screens/SessionNotesScreen';
import { CoachNotesScreen } from './src/screens/CoachNotesScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import { SideDrawer } from './src/components/SideDrawer';

export type RootStackParamList = {
  Talk: undefined;
  SessionNotes: undefined;
  CoachNotes: undefined;
  Account: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Talk"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Talk">
          {(props: any) => (
            <TalkScreen
              {...props}
              onOpenDrawer={() => setDrawerVisible(true)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="SessionNotes" component={SessionNotesScreen} />
        <Stack.Screen name="CoachNotes" component={CoachNotesScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
      </Stack.Navigator>
      
      <SideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
        </NavigationContainer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

