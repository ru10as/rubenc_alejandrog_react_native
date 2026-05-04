import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Importante: export const para que el AppNavigator lo encuentre
export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estás en el Campo Base </Text>
      <Text style={styles.subtitle}>Aquí aparecerán las camisetas pronto.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 10,
  },
});