import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';
import UserService from '../../../Services/UserServices/UserService';

export default function AdminViewClientsScreen() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [filter, setFilter] = useState('all'); // Filter state (all, admin, client, favorites)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const data = await UserService.GetUsers();
      setUsers(data);
      setFilteredUsers(data);

      // Chargement des favoris depuis AsyncStorage lors de la première utilisation de l'app
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [filter, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const toggleFavorite = async (userId) => {
    let updatedFavorites;
    if (favorites.includes(userId)) {
      updatedFavorites = favorites.filter(id => id !== userId);  // Supprimer du favoris
    } else {
      updatedFavorites = [...favorites, userId];  // Ajouter au favoris
    }
    setFavorites(updatedFavorites);

    // Sauvegarder les favoris dans AsyncStorage
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const filterUsers = () => {
    let updatedUsers = users;
    if (searchQuery.trim() !== '') {
      updatedUsers = updatedUsers.filter(user =>
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filter === 'favorites') {
      updatedUsers = updatedUsers.filter(user => favorites.includes(user.id));
    } else if (filter === 'admin') {
      updatedUsers = updatedUsers.filter(user => user.role === 'admin'); // Filtre pour les admins
    } else if (filter === 'client') {
      updatedUsers = updatedUsers.filter(user => user.role === 'client'); // Filtre pour les clients
    }

    setFilteredUsers(updatedUsers);
  };

  const renderItem = ({ item }) => (
    <Swipeable renderLeftActions={() => renderLeftActions(item.id)}>
      <View style={[styles.userItem, favorites.includes(item.id) && styles.favoriteItem]}>
        <Text style={styles.userName}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.userDetail}>Email: {item.email}</Text>
        <Text style={styles.userDetail}>ID: {item.id}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.favoriteButton}>
          <Text style={styles.favoriteButtonText}>
            {favorites.includes(item.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          </Text>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  const renderLeftActions = (userId) => (
    <View style={styles.actionContainer}>
      <TouchableOpacity style={[styles.actionButton, styles.viewButton]} onPress={() => handleAction(userId, 'view')}>
        <Text style={styles.actionText}>Voir</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleAction(userId, 'edit')}>
        <Text style={styles.actionText}>Éditer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleAction(userId, 'delete')}>
        <Text style={styles.actionText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  const handleAction = (userId, action) => {
    switch (action) {
      case 'view':
        alert('Voir les détails de l\'utilisateur');
        break;
      case 'edit':
        alert('Éditer l\'utilisateur');
        break;
      case 'delete':
        setUserToDelete(userId);
        setShowDeleteModal(true);
        break;
      default:
        alert('Action inconnue');
    }
  };

  const confirmDelete = async () => {
    if (userToDelete !== null) {
      // Effectuer la suppression (tu peux appeler UserService.DeleteUser si tu as une fonction pour ça)
      console.log(`Utilisateur avec ID ${userToDelete} supprimé.`);
      
      // Fermer le modal après la suppression
      setShowDeleteModal(false);
      setUserToDelete(null);
      
      // Recharger la liste des utilisateurs après suppression (tu peux faire un appel API si nécessaire)
      const updatedUsers = users.filter(user => user.id !== userToDelete);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Liste des utilisateurs</Text>

      {/* Boutons de filtre */}
      <View style={styles.filterButtonsContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter('all')}>
          <Text style={styles.filterButtonText}>Tous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter('admin')}>
          <Text style={styles.filterButtonText}>Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter('client')}>
          <Text style={styles.filterButtonText}>Client</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter('favorites')}>
          <Text style={styles.filterButtonText}>Favoris</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un utilisateur..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>}
        />
      )}

      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmDelete}>
                <Text style={styles.modalButtonText}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.modalButtonText}>Non</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  userItem: {
    backgroundColor: '#fec107',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  favoriteItem: {
    backgroundColor: '#ffeb3b',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetail: {
    fontSize: 14,
    color: '#555',
  },
  favoriteButton: {
    marginTop: 10,
    backgroundColor: '#ff9800',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  viewButton: {
    backgroundColor: '#4CAF50',
  },
  editButton: {
    backgroundColor: '#FFC107',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
