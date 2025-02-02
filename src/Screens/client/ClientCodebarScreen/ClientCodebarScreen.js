import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, Animated, Easing } from 'react-native';
import { AuthContext } from "../../../context/AuthContext";
import { LinearGradient } from 'expo-linear-gradient'; // Pour les dégradés
import { MaterialIcons } from '@expo/vector-icons'; // Pour les icônes
import { styles } from './Styles';

export default function ClientCodebarScreen() {
  const { barcodeBase64, reloadBarcode } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [scanHistory, setScanHistory] = useState([]);

  // Animation pour le code-barres
  const barcodeScale = useRef(new Animated.Value(1)).current;
  const lightPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (barcodeBase64) {
      setLoading(false);
      addToHistory(barcodeBase64);
      startLightAnimation();
    } else {
      setLoading(true);
    }
  }, [barcodeBase64]);

  const addToHistory = (barcode) => {
    setScanHistory((prevHistory) => [
      { id: Date.now().toString(), barcode },
      ...prevHistory,
    ]);
  };

  // Animation de la lumière qui traverse le code-barres
  const startLightAnimation = () => {
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
  };

  // Animation du bouton "Recharger"
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(barcodeScale, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(barcodeScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleReload = () => {
    animateButton();
    reloadBarcode();
  };

  return (
    <View style={styles.container}>
      {/* Section principale pour le code-barres */}
      <LinearGradient
        colors={['#ffffff', '#f5f5f5']}
        style={styles.barcodeContainer}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#FEC107" />
        ) : barcodeBase64 ? (
          <>
            <Text style={styles.title}>Votre Code-barres</Text>
            <View style={styles.barcodeWrapper}>
              <Animated.View
                style={[
                  styles.barcodeImageContainer,
                  { transform: [{ scale: barcodeScale }] },
                ]}
              >
                <Image
                  source={{ uri: `data:image/png;base64,${barcodeBase64}` }}
                  style={styles.barcode}
                  resizeMode="contain"
                />
                {/* Effet de lumière animé */}
                <Animated.View
                  style={[
                    styles.lightEffect,
                    {
                      transform: [
                        {
                          translateX: lightPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-100, 300],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </Animated.View>
              <MaterialIcons name="qr-code-scanner" size={40} color="#FEC107" style={styles.barcodeIcon} />
            </View>
            <TouchableOpacity  activeOpacity={0.8}>
              <View style={styles.reloadButton}>
                <Text style={styles.reloadButtonText}>Recharger</Text>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.noBarcodeText}>Aucun code-barres disponible</Text>
        )}
      </LinearGradient>

      {/* Section pour l'historique des scans */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Historique des scans</Text>
        {scanHistory.length > 0 ? (
          <FlatList
            data={scanHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <Text style={styles.historyText}>Scan ID: {item.id}</Text>
                <Text style={styles.historyText}>Code: {item.barcode.slice(0, 20)}...</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noHistoryText}>Aucun historique disponible</Text>
        )}
      </View>
    </View>
  );
}