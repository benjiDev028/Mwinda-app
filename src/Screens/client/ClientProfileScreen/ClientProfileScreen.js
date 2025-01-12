import React, { useState, useContext } from 'react';
import { View, Text, Image, Platform, Keyboard, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import splash from '../../../../assets/splash.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './Styles';
import { AuthContext } from '../../../context/AuthContext';

export default function ClientProfileScreen() {
  const { authToken, userRole, logout, barcodeBase64 } = useContext(AuthContext);
  // États pour gérer les données des champs
  const [firstname, setFirstname] = useState('John');
  const [lastname, setLastname] = useState('Doe');
  const [email, setEmail] = useState('johndoe@gmail.com');
  const [dob, setDob] = useState('1990-01-01');
  const [password, setPassword] = useState('password123');

  // États pour gérer l'édition des champs
  const [isEditing, setIsEditing] = useState(false);

  // Fonction pour activer/désactiver l'édition
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // Fonction pour sauvegarder les modifications
  const saveChanges = () => {
    console.log('Données sauvegardées :', { firstname, lastname, email, dob, password });
    setIsEditing(false);  // Désactive l'édition après la sauvegarde
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Ajuste pour iOS ou Android
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.container1}>
            <View style={styles.containerImage}>
              <Image source={splash} style={styles.image} />
              {/* Bouton de déconnexion à droite de l'image */}
              <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <MaterialCommunityIcons
                  name={'logout'}
                  size={44}
                  color="red"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.icon}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => { /* Logique pour ouvrir la galerie ici */ }}
              >
                {/* Image de l'avatar générique */}
                <Image
                  source={{
                    uri: 'https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG-Free-Image.png',
                  }}
                  style={styles.profileImage}
                />
                {/* Icône de crayon */}
                <MaterialCommunityIcons
                  name="pencil"
                  size={24}
                  color="#fff"
                  style={styles.editIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.container2}>
            <View style={styles.form}>
              <Text style={styles.text}>Firstname</Text>
              <TextInput
                style={styles.input}
                placeholder="Firstname"
                value={firstname}
                onChangeText={setFirstname}
                editable={isEditing} // Rendre l'input éditable si en mode édition
              />

              <Text style={styles.text}>Lastname</Text>
              <TextInput
                style={styles.input}
                placeholder="Lastname"
                value={lastname}
                onChangeText={setLastname}
                editable={isEditing}
              />

              <Text style={styles.text}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="johndoe@gmail.com"
                value={email}
                onChangeText={setEmail}
                editable={isEditing}
              />

              <Text style={styles.text}>Date of Birth</Text>
              <TextInput
                style={styles.input}
                placeholder="Date of Birth"
                value={dob}
                onChangeText={setDob}
                editable={isEditing}
              />

              <Text style={styles.text}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={isEditing}
              />
              
              {/* Bouton pour activer/désactiver le mode édition */}
              <TouchableOpacity onPress={toggleEditing} style={styles.editButton}>
                <MaterialCommunityIcons
                  name={isEditing ? "check" : "pencil"} // Change le bouton en fonction de l'état d'édition
                  size={24}
                  color="#000"
                />
                <Text style={styles.editButtonText}>
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
