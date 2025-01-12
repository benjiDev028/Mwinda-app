import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { AuthContext } from "../../../context/AuthContext";

// Utilisation de "export default function" pour le composant
export default function ClientCodebarScreen() {
  const { barcodeBase64, reloadBarcode } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  // Cette fonction sera appelée à chaque fois que la page est visitée
  useEffect(() => {
    const fetchBarcode = async () => {
      setLoading(true); // Démarre le chargement
      await reloadBarcode(); // Rafraîchit le barcode
      setLoading(false); // Fin du chargement
    };

    fetchBarcode(); // Appel de la fonction lors du montage du composant

  }, []); // Le tableau vide [] signifie que cet effet ne se déclenche qu'au montage (lors de la navigation vers la page)

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Chargement...</Text>
      ) : barcodeBase64 ? (
        <Image
          source={{ uri: `data:image/png;base64,${barcodeBase64}` }}
          style={styles.barcode}
        />
      ) : (
        <Text>Aucun code-barres disponible</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcode: {
    width: '80%',
    height: 200,
    marginBottom: 20,
  },
});
