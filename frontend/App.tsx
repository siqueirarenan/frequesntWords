import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CardsScreen from './screens/CardsScreen';
import LanguageSelectScreen from './screens/LanguageSelectScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        /> */}
        <Stack.Screen
          name="Languages"
          component={LanguageSelectScreen}
          options={{ title: 'Languages' }}
        />
        <Stack.Screen
          name="Cards"
          component={CardsScreen}
          options={{ title: 'Cards' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
