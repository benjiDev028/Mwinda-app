import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default function AdminScanBarcodeScreen() {
    const [scanned, setScanned] = useState(false); // Évite les scans multiples

    const handleBarCodeRead = ({ data }) => {
        if (!scanned) {
            setScanned(true); // Empêche un nouveau scan immédiat
            Alert.alert("Code scanné", `Contenu : ${data}`, [
                { text: "OK", onPress: () => setScanned(false) },
            ]);
        }
    };

    return (
        <View style={styles.container}>
            <RNCamera
                style={styles.camera}
                onBarCodeRead={handleBarCodeRead} // Détecte et lit le code-barres
                captureAudio={false} // Désactive l'audio pour cette utilisation
            >
                <View style={styles.overlay}>
                    <Text style={styles.text}>Scannez un code-barres</Text>
                </View>
            </RNCamera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        top: '10%',
        width: '100%',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
