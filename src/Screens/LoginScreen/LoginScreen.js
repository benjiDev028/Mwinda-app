import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  Animated,
  Platform,
  Easing
} from 'react-native';
import styles from './Styles';
import splash from '../../../assets/img/splash.png';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';

export default function LoginScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = async () => {
    if(email ==='' || password==='') {
      Alert.alert("Avertissement","veuillez remplir tous les champs");
      return;
    }
    
    try {
      const { token, userRole } = await login(email.toLowerCase(), password);
      if (userRole === 'admin') {
        navigation.navigate('AdminHome');
      } else if (userRole === 'client') {
        navigation.navigate('ClientHome');
      }
    } catch (error) {
      Alert.alert("Erreur", "Email ou mot de passe incorrect");
      setPassword('');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.container1,
            { 
              transform: [{ translateY: slideAnim }], 
              opacity: fadeAnim 
            }
          ]}
        >
          <Image source={splash} style={styles.image} />
        </Animated.View>

        <Animated.View 
          style={[styles.container2, { opacity: fadeAnim }]}
        >
          <View style={styles.form}>
            <Text style={styles.title}>{t('login')}</Text>

            <Text style={styles.label}>{t('email')}</Text>
            <TextInput
              style={styles.input}
              placeholder="Email@gmail.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>{t('password')}</Text>
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.activeButton} 
                onPress={handleLogin}
                activeOpacity={0.9}
              >
                <Text style={styles.activeText}>{t('login')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => navigation.navigate('signin')}
                activeOpacity={0.6}
              >
                <Text style={styles.secondaryText}>{t('signin')}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={() => navigation.navigate('check-email')}
              activeOpacity={0.6}
            >
              <Text style={styles.linkText}>{t('forgot password')} ?</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
     </KeyboardAvoidingView>
  );
}