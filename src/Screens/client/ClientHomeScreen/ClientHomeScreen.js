import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

const stories = [
  { id: '1', url: 'https://picsum.photos/300/300?random=1', user: 'Alice', likes: 0 },
  { id: '2', url: 'https://picsum.photos/300/300?random=2', user: 'Bob', likes: 0 },
  { id: '3', url: 'https://picsum.photos/300/300?random=3', user: 'Charlie', likes: 0 },
  { id: '4', url: 'https://picsum.photos/300/300?random=4', user: 'David', likes: 0 },
  { id: '5', url: 'https://picsum.photos/300/300?random=5', user: 'Eve', likes: 0 },
];

const services = [
  { id: '1', name: 'Photo Studio', imageUrl: 'https://picsum.photos/500/300?random=6' },
  { id: '2', name: 'Mariage Civil', imageUrl: 'https://picsum.photos/500/300?random=7' },
  { id: '3', name: 'Mariage Coutumier', imageUrl: 'https://picsum.photos/500/300?random=8' },
  { id: '4', name: 'Événements Spéciaux', imageUrl: 'https://picsum.photos/500/300?random=9' },
];

export default function ClientHomeScreen() {
  const [storyData, setStoryData] = useState(stories);
  const [selectedStory, setSelectedStory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(new Animated.Value(0));

  // Animation pour les services
  const [fadeAnim] = useState(new Animated.Value(0));  // Initialisation à 0 (invisible)

  useEffect(() => {
    // Animation fade-in lorsque la page est chargée
    Animated.timing(fadeAnim, {
      toValue: 1, // 1 pour rendre visible
      duration: 1000, // Durée de l'animation
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (selectedStory) {
      progress.setValue(0);
      Animated.timing(progress, { toValue: 1, duration: 3000, useNativeDriver: false }).start();

      const timer = setTimeout(() => {
        const nextIndex = (storyIndex + 1) % stories.length;
        setStoryIndex(nextIndex);
        setSelectedStory(stories[nextIndex]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [selectedStory, storyIndex]);

  const openStory = (story) => {
    setSelectedStory(story);
    setStoryIndex(storyData.indexOf(story));
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedStory(null);
    progress.setValue(0);
  };

  const likeStory = (storyId) => {
    const updatedStories = storyData.map((story) =>
      story.id === storyId ? { ...story, likes: story.likes + 1 } : story
    );
    setStoryData(updatedStories);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Stories</Text>
      <View style={styles.storiesSection}>
        <FlatList
          horizontal
          data={storyData}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.storyContainer}>
              <TouchableOpacity onPress={() => openStory(item)}>
                <LinearGradient
                  colors={['#feda75', '#fa7e1e', '#d62976', '#962fbf', '#4f5bd5']}
                  style={styles.storyGradient}
                >
                  <Image source={{ uri: item.url }} style={styles.storyImage} />
                </LinearGradient>
                <Text style={styles.storyUser}>{item.user}</Text>
              </TouchableOpacity>
              <View style={styles.likeContainer}>
                <TouchableOpacity onPress={() => likeStory(item.id)}>
                  <AntDesign name="heart" size={24} color="red" style={styles.likeIcon} />
                </TouchableOpacity>
                <Text style={styles.likeCount}>{item.likes}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Section des services avec animation fade */}
      <View style={styles.servicesSection}>
        <Text style={styles.sectionHeader}>Nos Services</Text>
        <Animated.FlatList
          data={services}
          showsVerticalScrollIndicator={false} // Désactive la barre de défilement vertical
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Animated.View style={[styles.serviceCard, { opacity: fadeAnim }]}>
              <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
              <Text style={styles.serviceName}>{item.name}</Text>
            </Animated.View>
          )}
        />
      </View>

      {/* Modal pour afficher une story */}
      <Modal visible={modalVisible} animationType="fade" transparent={false} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedStory && (
              <>
                <Pressable style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>×</Text>
                </Pressable>

                <View style={styles.progressContainer}>
                  <Animated.View
                    style={[
                      styles.progressBar,
                      {
                        width: progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                </View>

                <Image source={{ uri: selectedStory.url }} style={styles.modalImage} />
                <Text style={styles.modalUser}>{selectedStory.user}</Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },

  // Section des stories
  storiesSection: { marginBottom: 20 },
  storyContainer: { marginRight: 15, alignItems: 'center' },
  storyGradient: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  storyImage: { width: 90, height: 90, borderRadius: 45 },
  storyUser: { textAlign: 'center', marginTop: 5, fontSize: 12 },
  likeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  likeIcon: { marginRight: 5 },
  likeCount: { fontSize: 14, fontWeight: 'bold' },

  // Section des services
  servicesSection: { marginBottom: 30 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  serviceCard: { position: 'relative', marginRight: 15, width: '198%', height: 150, borderRadius: 10, overflow: 'hidden',padding:4 },
  serviceImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.7, // Opacité floutée
  },
  serviceName: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{ translateX: '-50%' }],
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '100%', height: '90%', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  modalImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  modalUser: { position: 'absolute', bottom: 20, left: 20, color: 'white', fontSize: 24, fontWeight: 'bold' },
  closeButton: { position: 'absolute', top: 30, right: 2, padding: 10, borderRadius: 50 },
  closeButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  progressContainer: { width: '100%', height: 5, backgroundColor: '#e0e0e0', borderRadius: 5, position: 'absolute', top: 20 },
  progressBar: { height: 5, backgroundColor: '#007bff', borderRadius: 5 },
});
