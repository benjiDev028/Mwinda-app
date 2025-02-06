import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import {UserService} from '../../../../Services/UserServices/UserService';

const EditUserScreen = ({ route, navigation }) => {
  const { userId } = route.params; // Récupérer l'ID de l'utilisateur depuis la navigation
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await UserService.GetUserById(userId);
        setUser(userData);
        setFormData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          role: userData.role,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleSave = async () => {
    try {
      await UserService.UpdateUser(userId, formData); // Supposons que vous avez une méthode pour mettre à jour un utilisateur
      navigation.goBack(); // Revenir à la page précédente après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Chargement des détails de l'utilisateur...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Modifier l'utilisateur</Text>
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={formData.first_name}
        onChangeText={(text) => setFormData({ ...formData, first_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={formData.last_name}
        onChangeText={(text) => setFormData({ ...formData, last_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Rôle"
        value={formData.role}
        onChangeText={(text) => setFormData({ ...formData, role: text })}
      />
      <Button title="Enregistrer" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2196F3',
  },
});

export default EditUserScreen;