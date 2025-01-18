import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  Keyboard,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import splash from '../../../../assets/splash.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './Styles';
import { AuthContext } from '../../../context/AuthContext';

export default function ClientProfileScreen() {
  const { authToken, id, logout } = useContext(AuthContext);

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [date_birth, setDate_birth] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const getUserData = async () => {
    if (!authToken || !id) {
      console.log('authToken ou id est manquant');
      return;
    }

    try {
      const response = await fetch(`http://192.168.2.13:8001/identity/get_user_by_id/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFirstname(data.first_name || '');
        setLastname(data.last_name || '');
        setEmail(data.email || '');
        setDate_birth(data.date_birth || '');
      } else {
        console.error('Erreur lors de la récupération des données utilisateur');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [authToken, id]);


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
                value={date_birth}
                onChangeText={setDate_birth}
                editable={isEditing}
              />

              <Text style={styles.text}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                
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
