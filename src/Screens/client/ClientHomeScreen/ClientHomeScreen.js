import React, { useState, useEffect, useRef } from 'react';
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
  Easing,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

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
  const navigation = useNavigation();

  // Animation pour les services
  const scrollX = useRef(new Animated.Value(0)).current;

  // Animation pour les stories
  const lightPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedStory) {
      progress.setValue(0);
      Animated.timing(progress, { toValue: 1, duration: 5000, useNativeDriver: false }).start();

      const timer = setTimeout(() => {
        const nextIndex = (storyIndex + 1) % stories.length;
        setStoryIndex(nextIndex);
        setSelectedStory(stories[nextIndex]);
      }, 5000);

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

  // Animation de la lumière pour les stories
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lightPosition, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(lightPosition, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const navigateToService = (service) => {
    navigation.navigate('ServiceDetail', { service });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Section des stories */}
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
                  <Animated.View
                    style={[
                      styles.lightEffect,
                      {
                        transform: [
                          {
                            translateX: lightPosition.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-100, 200],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
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

      {/* Section des services avec effet de parallaxe */}
      <Text style={styles.sectionHeader}>Nos Services</Text>
      <Animated.FlatList
        horizontal
        data={services}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        renderItem={({ item, index }) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
          });
          return (
            <TouchableOpacity onPress={() => navigateToService(item)}>
              <Animated.View style={[styles.serviceCard, { transform: [{ scale }] }]}>
                <Image source={{ uri: item.imageUrl }} style={styles.serviceImage} />
                <Text style={styles.serviceName}>{item.name}</Text>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Modal pour afficher une story */}
      <Modal visible={modalVisible} animationType="fade" transparent={false} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedStory && (
              <>
                <Pressable style={styles.closeButton} onPress={closeModal}>
                  <Feather name="x" size={30} color="#fff" />
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
  storyGradient: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 5, overflow: 'hidden' },
  storyImage: { width: 90, height: 90, borderRadius: 45 },
  storyUser: { textAlign: 'center', marginTop: 5, fontSize: 12 },
  likeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  likeIcon: { marginRight: 5 },
  likeCount: { fontSize: 14, fontWeight: 'bold' },
  lightEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ skewX: '-20deg' }],
  },

  // Section des services
  sectionHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  serviceCard: { width: width * 0.8, height: 200, borderRadius: 20, overflow: 'hidden', marginRight: 15 },
  serviceImage: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, opacity: 0.7 },
  serviceName: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: '-50%' }],
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '100%', height: '90%', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  modalImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  modalUser: { position: 'absolute', bottom: 20, left: 20, color: 'white', fontSize: 24, fontWeight: 'bold' },
  closeButton: { position: 'absolute', top: 30, right: 20, padding: 10, borderRadius: 50 },
  progressContainer: { width: '100%', height: 5, backgroundColor: '#e0e0e0', borderRadius: 5, position: 'absolute', top: 20 },
  progressBar: { height: 5, backgroundColor: '#007bff', borderRadius: 5 },
});