import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  ActivityIndicator,
  Easing
} from 'react-native';
import splash from '../../../assets/img/splash.png';
import { useNavigation } from '@react-navigation/native';
import styles from './Styles';
import UserService from '../../Services/UserServices/UserService';

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

export default function SignIn() {
  const [Firstname, setFirstname] = useState('');
  const [Lastname, setLastname] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [date_birth, setDate_birth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

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
    if (Firstname === '' || Lastname === '' || Email === '' || Password === '' || date_birth === '') {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    if (!validateEmail(Email)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide.');
      return;
    }

    if (!validatePassword(Password)) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères, une lettre, un chiffre et un caractère spécial.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await UserService.Register(Firstname, Lastname, Email.toLowerCase(), Password, date_birth);

      if (response.success) {
        alert("Vous êtes bien inscrit");
        navigation.navigate("Login");
      } else {
        if (response.error === "EMAIL_ALREADY_REGISTERED") {
          Alert.alert('Erreur', 'L\'email est déjà enregistré. Veuillez utiliser un autre email.');
        } else {
          Alert.alert('Erreur', response.error || "Une erreur est survenue, veuillez réessayer.");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      Alert.alert('Erreur', "Une erreur est survenue. Veuillez vérifier votre connexion ou réessayer plus tard.");
    }finally{
      setIsLoading(false);
    }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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

          <ScrollView 
            contentContainerStyle={styles.container2}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
              <Text style={styles.title}>SIGN IN</Text>

              <Text style={styles.label}>Firstname</Text>
              <TextInput 
                style={styles.input} 
                onChangeText={setFirstname} 
                placeholder="Firstname"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Lastname</Text>
              <TextInput 
                style={styles.input} 
                onChangeText={setLastname} 
                placeholder="Lastname"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput 
                style={styles.input} 
                onChangeText={setEmail} 
                placeholder="johndoe@gmail.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
              />

              <Text style={styles.label}>Date of birth</Text>
              <TextInput 
                style={styles.input}
                onChangeText={setDate_birth}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity 
                style={styles.activeButton} 
                onPress={handleLogin}
                activeOpacity={0.9}
                desabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ):( <Text style={styles.activeText}>Create Account</Text>)}
                
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.6}
              >
                <Text style={styles.already}>
                  Vous avez déjà un compte ?{' '}
                  <Text style={styles.connexion}>Connexion</Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

