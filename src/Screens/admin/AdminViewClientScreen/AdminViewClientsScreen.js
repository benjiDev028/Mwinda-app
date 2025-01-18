import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler'; // Importer le composant Swipeable
import UserService from '../../../Services/UserServices/UserService'; // Service pour récupérer les utilisateurs

export default function AdminViewClientsScreen() {
  const [users, setUsers] = useState([]); // État pour stocker les utilisateurs

  // Fonction pour récupérer les utilisateurs au chargement de l'écran
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await UserService.GetUsers();
      setUsers(data); // Mettre à jour l'état avec les utilisateurs récupérés
    };
    
    fetchUsers();
  }, []); // Cette fonction ne s'exécute qu'une seule fois lors du chargement du composant

  // Fonction pour gérer les actions sur chaque utilisateur (voir, éditer, supprimer)
  const handleAction = (userId, action) => {
    switch(action) {
      case 'view':
        console.log(`Afficher les détails de l'utilisateur avec l'ID: ${userId}`);
        // Ajoutez votre logique pour afficher les détails
        break;
      case 'edit':
        console.log(`Éditer les informations de l'utilisateur avec l'ID: ${userId}`);
        // Ajoutez votre logique pour modifier les informations de l'utilisateur
        break;
      case 'delete':
        console.log(`Supprimer l'utilisateur avec l'ID: ${userId}`);
        // Ajoutez votre logique pour supprimer l'utilisateur
        break;
      default:
        console.log('Action inconnue');
    }
  };

  // Fonction pour rendre les actions lorsque l'utilisateur balaie vers la gauche
  const renderLeftActions = (userId) => (
    <View style={styles.leftActions}>
      <Button title="Voir" onPress={() => handleAction(userId, 'view')} />
      <Button title="Éditer" onPress={() => handleAction(userId, 'edit')} />
      <Button title="Supprimer" onPress={() => handleAction(userId, 'delete')} />
    </View>
  );

  // Rendu de chaque élément utilisateur dans la liste avec Swipeable
  const renderItem = ({ item }) => (
    <Swipeable
      renderLeftActions={() => renderLeftActions(item.id)} // Affiche les actions à gauche
      rightThreshold={40} // Distance à parcourir pour afficher les actions
    >
      <View style={styles.userItem}>
        <Text style={styles.userText}>Nom: {item.last_name}</Text>
        <Text style={styles.userText}>Prénom: {item.first_name}</Text>
        <Text style={styles.userText}>Date de naissance: {item.date_birth}</Text>
        {/* Vous pouvez ajouter d'autres informations selon la structure de vos données */}
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Liste des utilisateurs</Text>
      <FlatList
        data={users} // Données des utilisateurs
        keyExtractor={(item) => item.id.toString()} // Utiliser un identifiant unique pour chaque élément
        renderItem={renderItem} // Rendu de chaque élément de la liste
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  userText: {
    fontSize: 16,
  },
  leftActions: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});
