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
import { Picker } from '@react-native-picker/picker';
import splash from '../../../assets/img/splash.png';
import styles from './Styles';

export default function SignIn() {
  

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
              <TextInput style={styles.input} placeholder="firstname" />

              <Text style={styles.text}>Lastname</Text>
              <TextInput style={styles.input} placeholder="lastname" />

              <Text style={styles.text}>Email</Text>
              <TextInput style={styles.input} placeholder="johndoe@gmail.com" />
              <Text style={styles.text}>Date of birth</Text>
              <TextInput style={styles.input} 
              placeholder="jj/mm/aaaa"
              textContentType="birthdate"
              keyboardType="decimal-pad"
               />

              <Text style={styles.text}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="password"
                secureTextEntry
              />

            </View>
            <TouchableOpacity style={styles.activeButton} >
                <Text style={styles.activeText}> Create</Text>
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
