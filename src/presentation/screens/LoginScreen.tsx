import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';


export const LoginScreen = ({ navigation }: any) => {
    return (
        <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
        <ImageBackground 
            source={require('../../../assets/images/fondo_maracana.png')}
            style={styles.backgroundImage}
            imageStyle={{ opacity: 0.4 }}
        >

        </ImageBackground>
    </KeyboardAvoidingView>
    )
}





const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  backgroundImage: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  overlay: { 
    flex: 1, 
    padding: 30, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  logo: { 
    fontSize: 40, 
    fontWeight: '900', 
    color: '#fff', 
    letterSpacing: 2 
  },
  subtitle: { 
    color: '#ddd', 
    fontSize: 14, 
    marginBottom: 40, 
    textAlign: 'center' 
  },
  form: { 
    width: '100%' 
},
  input: { 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 10, 
    padding: 15, 
    color: '#fff', 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  buttonMain: { 
    backgroundColor: '#2e7d32', 
    padding: 18, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 },
  linkText: { 
    color: '#ccc', 
    textAlign: 'center', 
    marginTop: 20 },
  linkBold: { 
    color: '#fff', 
    fontWeight: 'bold', 
    textDecorationLine: 'underline' }
});