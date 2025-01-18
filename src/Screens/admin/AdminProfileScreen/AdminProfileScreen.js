import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, Platform, Keyboard, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Alert } from 'react-native';
import splash from '../../../../assets/splash.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './Styles';
import { AuthContext } from '../../../context/AuthContext';
import AuthService from '../../../Services/UserServices/AuthService'; // Assurez-vous que le service AuthService est importé pour décoder le JWT

export default function ClientProfileScreen() {
  const { authToken, userRole, id,logout, barcodeBase64 } = useContext(AuthContext);

  // États pour gérer les données des champs
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [date_birth, setDate_birth] = useState('');
  const [password, setPassword] = useState('');

  // États pour gérer l'édition des champs
  const [isEditing, setIsEditing] = useState(false);

  // Fonction pour activer/désactiver l'édition
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };
  // const decodedToken = AuthService.decodeJWT(authToken);  // authToken est le token que vous avez stocké après l'authentification
  // const UserId = decodedToken.user_id
   
 
 // Fonction pour récupérer les informations utilisateur depuis l'API
 const getUserData = async () => {
  try {
    const response = await fetch(`http://192.168.2.13:8001/identity/get_user_by_id/${id}` , {
      method: 'Get', // Utilisation de POST si les paramètres doivent être envoyés dans le corps de la requête
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
 // Envoi de l'ID utilisateur dans le corps de la requête
    });
    if (response.ok) {
      const data = await response.json();
      setFirstname(data.first_name);
      setLastname(data.last_name);
      setEmail(data.email);
      setDate_birth(data.date_birth);
      setPassword(''); // Ne pas pré-remplir le mot de passe pour des raisons de sécurité
    } else {
      console.log('Erreur lors de la récupération des données utilisateur');
    }
  } catch (error) {
    console.log('Erreur:', error);
  }
};


useEffect(() => {
  if (authToken) {
    try {
      const decodedToken = AuthService.decodeJWT(authToken); // Assurez-vous que cette fonction est disponible dans votre AuthService
      const userId = decodedToken.id; // Supposons que l'ID utilisateur est dans le champ 'id' du token
      getUserData(userId);  // Passez l'ID utilisateur à la fonction de récupération des données
    } catch (error) {
      console.log('Erreur lors du décodage du token:', error);
    }
  } else {
    console.log('authToken est null ou indéfini');
  }
}, [authToken]); // Re-exécute quand le authToken change

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
                  name={'power'}
                  size={44}
                  color="black"
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
