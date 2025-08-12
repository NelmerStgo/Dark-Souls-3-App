import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';

import { loadFonts } from './components/customFonts';


export default function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const ok = await loadFonts();
      setFontsLoaded(ok);
    })();
  }, []);

  /* const [fonstLoaded] = useFonts({
    'OptimusPrinceps': require('./assets/fonts/OptimusPrinceps.ttf')
  }); */

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4D4D4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E'
  }
});
