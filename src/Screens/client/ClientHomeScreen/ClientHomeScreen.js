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
import  styles  from './Styles';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Importation des images locales
import studio1 from '../../../../assets/services/studio6.jpg';
import mariageCivil from '../../../../assets/services/seance2.jpg';
import mariageCoutumier from '../../../../assets/services/mariage16.jpeg';
import evenements from '../../../../assets/services/anniv1.jpg';

const { width, height } = Dimensions.get('window');

const stories = [
  { 
    id: '1', 
    url: 'https://picsum.photos/300/300?random=1', 
    user: 'Mwinda', 
    isVerified: true 
  },
];

const services = [
  { id: '1', name: 'Photo Studio', imageUrl: studio1 },
  { id: '2', name: 'Mariage Civil', imageUrl: mariageCivil },
  { id: '3', name: 'Mariage Coutumier', imageUrl: mariageCoutumier },
  { id: '4', name: 'Événements Spéciaux', imageUrl: evenements },
];

const achievements = [...Array(50)].map((_, i) => ({
  id: String(i),
  url: `https://picsum.photos/${300 + i}/${300 + i}?achievement=${i}`,
  likes: Math.floor(Math.random() * 100),
}));

export default function ClientHomeScreen() {
  const navigation = useNavigation();
  const [selectedStory, setSelectedStory] = useState(null);
  const [progress] = useState(new Animated.Value(0));
  const scrollY = useRef(new Animated.Value(0)).current;
  const lightPosition = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Gestion des stories
  useEffect(() => {
    if (selectedStory) {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start();

      const timer = setTimeout(() => {
        setSelectedStory(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [selectedStory]);

  const openStory = (story) => setSelectedStory(story);

  const closeModal = () => {
    setSelectedStory(null);
    progress.setValue(0);
  };


  // Animations
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

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -70],
    extrapolate: 'clamp',
  });

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity 
     
      style={styles.serviceCard}>
      <Image source={item.imageUrl} style={styles.serviceImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.serviceGradient}>
        <Text style={styles.serviceName}>{item.name}</Text>
       
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <Animated.ScrollView 
      style={[styles.container, { opacity: fadeAnim }]}
      scrollEventThrottle={8}>

      {/* Section Stories */}
      <View style={styles.section}>
        
        <View style={styles.storyWrapper}>
          <TouchableOpacity onPress={() => openStory(stories[0])} activeOpacity={0.9}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53', '#FFD93D']}
              style={styles.storyBorder}>
              <Image 
                source={{ uri: stories[0].url }} 
                style={styles.storyImage} 
                resizeMode="cover"
              />
              <Animated.View style={[
                styles.storyGlow,
                { transform: [{ translateX: lightPosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, 200],
                })}] }
              ]}/>
            </LinearGradient>
            <View style={styles.storyMeta}>
              <View style={styles.userContainer}>
                <Text style={styles.storyUser}>{stories[0].user}</Text>
                <MaterialIcons 
                  name="verified" 
                  size={14} 
                  color="#4A90E2" 
                  style={styles.verifiedBadge} 
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Section Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nos Prestations</Text>
        <FlatList
          horizontal
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesContainer}
        />
      </View>

      {/* Section Réalisations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notre Portfolio</Text>
        <FlatList
          data={achievements}
          numColumns={3}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.achievementsRow}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.achievementItem}
              onPress={() => navigation.navigate('Gallery', { photo: item })}>
              <Image
                source={{ uri: item.url }}
                style={styles.achievementImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.5)']}
                style={styles.achievementOverlay}>
                <AntDesign name="heart" size={16} color="#fff" />
                <Text style={styles.achievementLikes}>{item.likes}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Modal Story */}
      <Modal visible={!!selectedStory} transparent statusBarTranslucent animationType="fade">
        <View style={styles.modalContainer}>
          <Pressable style={styles.closeButton} onPress={closeModal}>
            <Feather name="x" size={28} color="#fff" />
          </Pressable>
          
          <Animated.View style={styles.progressBarContainer}>
            <Animated.View style={[
              styles.progressBar,
              { width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              })}
            ]}/>
          </Animated.View>

          <Image 
            source={{ uri: selectedStory?.url }} 
            style={styles.fullscreenImage} 
            resizeMode="contain"
          />
          
          <View style={styles.storyFooter}>
            <View style={styles.userContainer}>
              <Text style={styles.storyUserModal}>@{selectedStory?.user}</Text>
              <MaterialIcons 
                name="verified" 
                size={18} 
                color="#4A90E2" 
                style={styles.modalVerifiedBadge} 
              />
            </View>
           
          </View>
        </View>
      </Modal>
    </Animated.ScrollView>
  );
}

