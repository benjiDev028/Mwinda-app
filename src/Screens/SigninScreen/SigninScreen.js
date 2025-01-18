import React, { useEffect, useState } from 'react';
import {
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
export default function SignIn() {
  
  const[Firstname, setFirstname] = useState('')
  const[Lastname, setLastname] = useState('')
  const[Email, setEmail] = useState('')
  const[Password, setPassword] = useState('')
  const[date_birth,setDate_birth] = useState('')

  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await UserService.Register(Firstname, Lastname, Email.toLowerCase(), Password, date_birth);
      
      // Vérifier si la réponse est correcte
      if (response.success) {
        alert("Vous êtes bien inscrit");
        navigation.navigate("Login");
      } else {
        // Afficher un message d'erreur plus précis
        alert(response.error || "Une erreur est survenue, veuillez réessayer.");
      }
    } catch (error) {
      // Afficher les erreurs de manière détaillée
      console.error("Error during registration:", error.message);
      alert("Une erreur est survenue. Veuillez vérifier votre connexion ou réessayer plus tard.");
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
                <Text style={styles.activeText} > Create</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text style={styles.already}> alreday sign in  ?</Text>
            </TouchableOpacity>
          </ScrollView>
          
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
