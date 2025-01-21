import React, { useState } from 'react';
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
} from 'react-native';
import splash from '../../../assets/img/splash.png';
import { useNavigation } from '@react-navigation/native';
import styles from './Styles';
import UserService from '../../Services/UserServices/UserService';

// Fonction de validation d'email
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

// Fonction de validation de mot de passe
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

  const navigation = useNavigation();

  const handleLogin = async () => {
    // Vérification de tous les champs avant d'envoyer les données
    if (Firstname === '' || Lastname === '' || Email === '' || Password === '' || date_birth === '') {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }
  
    // Validation de l'email
    if (!validateEmail(Email)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide.');
      return;
    }
  
    // Validation du mot de passe
    if (!validatePassword(Password)) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères, une lettre, un chiffre et un caractère spécial.');
      return;
    }
  
    // Si toutes les validations sont passées, appeler la fonction Register
    try {
      const response = await UserService.Register(Firstname, Lastname, Email.toLowerCase(), Password, date_birth);
  
      // Vérifier si la réponse est correcte
      if (response.success) {
        alert("Vous êtes bien inscrit");
        navigation.navigate("Login");
      } else {
        // Gestion des erreurs spécifiques
        if (response.error && response.error === "EMAIL_ALREADY_REGISTERED") {
          Alert.alert('Erreur', 'L\'email est déjà enregistré. Veuillez utiliser un autre email.');
        } else {
          // Autres erreurs non spécifiques
          Alert.alert('Erreur', response.error || "Une erreur est survenue, veuillez réessayer.");
        }
      }
    } catch (error) {
      // Afficher les erreurs de manière détaillée
      console.error("Error during registration:", error.message);
      Alert.alert('Erreur', "Une erreur est survenue. Veuillez vérifier votre connexion ou réessayer plus tard.");
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Ajuste pour iOS ou Android
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Logo fixe */}
          <View style={styles.container1}>
            <Image source={splash} style={styles.image} />
          </View>

          {/* Contenu défilable */}
          <ScrollView contentContainerStyle={styles.container2}>
            <View style={styles.form}>
              <Text style={styles.title}>SIGN IN</Text>

              <Text style={styles.text}>Firstname</Text>
              <TextInput style={styles.input} onChangeText={setFirstname} placeholder="firstname" />

              <Text style={styles.text}>Lastname</Text>
              <TextInput style={styles.input} onChangeText={setLastname} placeholder="lastname" />

              <Text style={styles.text}>Email</Text>
              <TextInput style={styles.input} onChangeText={setEmail} placeholder="johndoe@gmail.com" />

              <Text style={styles.text}>Date of birth</Text>
              <TextInput style={styles.input}
                onChangeText={setDate_birth}
                placeholder="jj/mm/aaaa"
                textContentType="birthdate"
                keyboardType="decimal-pad"
              />

              <Text style={styles.text}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="password"
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.activeButton} onPress={handleLogin}>
              <Text style={styles.activeText}> Create</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.already}>  VOUS AVEZ DEJA UN COMPTE ? click</Text>
            </TouchableOpacity>
          </ScrollView>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
