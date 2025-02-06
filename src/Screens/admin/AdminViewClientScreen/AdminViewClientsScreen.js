import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, 
  Modal, 
  ActivityIndicator,
  Animated,
  Easing,RefreshControl
} from 'react-native';
import {styles} from './Styles';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '../../../Services/UserServices/UserService';
import { useNavigation } from '@react-navigation/native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function AdminViewClientsScreen() {
  // ... (le reste des états et fonctions reste inchangé)
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [filter, setFilter] = useState('all'); // Filter state (all, admin, client, favorites)
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const data = await UserService.GetUsers();
      console.log('Utilisateurs chargés:', data);

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


  const onRefresh = async () => {
    setRefreshing(true);
    const data = await UserService.GetUsers();
    setUsers(data);
    setFilteredUsers(data);
    setRefreshing(false);
  };

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





  const handleAction = (userId, action) => {
    switch (action) {
      case 'view':

      alert('Voir l\'utilisateur'+ userId);
      const id = userId;
      navigation.navigate('UserDetails',{ id}); // Naviguer vers UserDetails
      console.log('id apres clique : ' + userId);
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
      // Effectuer la suppression (tu peux appeler UserService.DeleteUser 
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


  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 0.5,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const renderItem = ({ item, index }) => {
    const inputRange = [0, 1];
    const translateY = fadeAnim.interpolate({
      inputRange,
      outputRange: [50 * (index + 1), 0]
    });

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
        <Swipeable 
          renderLeftActions={() => renderLeftActions(item.id)}
          friction={2}
          overshootFriction={8}
        >
          <View style={[styles.userItem, favorites.includes(item.id) && styles.favoriteItem]}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.first_name} {item.last_name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <Feather 
              name={favorites.includes(item.id) ? "star" : "star"} 
              size={24} 
              color={favorites.includes(item.id) ? "#FFD700" : "#ccc"} 
              style={styles.favoriteIcon}
            />
          </View>
        </Swipeable>
      </Animated.View>
    );
  };

  const renderLeftActions = (userId) => {
    const scale = new Animated.Value(1);
    
    const animatePress = (newValue) => {
      Animated.spring(scale, {
        toValue: newValue,
        friction: 3,
        useNativeDriver: true
      }).start();
    };

    return (
      <View style={styles.actionsContainer}>
        <AnimatedTouchable 
          style={[styles.actionButton, { transform: [{ scale }] }]}
          onPressIn={() => animatePress(0.9)}
          onPressOut={() => animatePress(1)}
          onPress={() => handleAction(userId, 'view')}
        >
          <MaterialIcons name="visibility" size={20} color="white" />
        </AnimatedTouchable>

        <AnimatedTouchable 
          style={[styles.actionButton, { transform: [{ scale }], backgroundColor: '#4CAF50' }]}
          onPressIn={() => animatePress(0.9)}
          onPressOut={() => animatePress(1)}
          onPress={() => handleAction(userId, 'edit')}
        >
          <MaterialIcons name="edit" size={20} color="white" />
        </AnimatedTouchable>

        <AnimatedTouchable 
          style={[styles.actionButton, { transform: [{ scale }], backgroundColor: '#F44336' }]}
          onPressIn={() => animatePress(0.9)}
          onPressOut={() => animatePress(1)}
          onPress={() => handleAction(userId, 'delete')}
        >
          <MaterialIcons name="delete" size={20} color="white" />
        </AnimatedTouchable>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.header}>Gestion des Utilisateurs</Text>

      <View style={styles.filterContainer}>
        {['all', 'admin', 'client', 'favorites'].map((filterType) => (
          <TouchableOpacity 
            key={filterType}
            style={[styles.filterButton, filter === filterType && styles.activeFilter]}
            onPress={() => setFilter(filterType)}
          >
            <Text style={[styles.filterText, filter === filterType && styles.activeFilterText]}>
              {filterType === 'all' ? 'Tous' : 
               filterType === 'admin' ? 'Admins' : 
               filterType === 'client' ? 'Clients' : 'Favoris'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un utilisateur..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Chargement des utilisateurs...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="users" size={50} color="#ccc" />
              <Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
            tintColors={['#FEC107']}
            />
          }
        />
      )}

      {/* Modal reste inchangé */}
    </Animated.View>
  );
}



