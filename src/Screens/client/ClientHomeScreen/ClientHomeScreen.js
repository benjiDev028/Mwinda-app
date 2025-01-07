import React, { useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, Image, ScrollView, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { AuthContext } from '../../../context/AuthContext';

export default function ClientHomeScreen() {
    const { authToken, userRole, logout, barcodeBase64 } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false); // État pour le pull-to-refresh
    const [loading, setLoading] = useState(true); // Indicateur de chargement de l'image
    const [imageUri, setImageUri] = useState(null); // État local pour l'image

    // Mettre à jour l'image à partir de barcodeBase64
    useEffect(() => {
        if (barcodeBase64) {
            setImageUri(`data:image/png;base64,${barcodeBase64}`);
            setLoading(false); // L'image est prête
        }
    }, [barcodeBase64]);

    // Fonction de rafraîchissement
    const onRefresh = useCallback(async () => {
        setRefreshing(true); // Active l'indicateur de rafraîchissement
        try {
            // Ici, vous pouvez appeler une API pour actualiser les données ou mettre à jour les informations
            // Simule un rafraîchissement avec un délai de 1.5 secondes
            await new Promise((resolve) => setTimeout(resolve, 1500));
        } catch (error) {
            console.error('Erreur lors du rafraîchissement des données :', error);
        } finally {
            setRefreshing(false); // Désactive l'indicateur de rafraîchissement
        }
    }, []);

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.content}>
                {/* Informations utilisateur */}
                <Text style={styles.title}>Bienvenue, votre rôle est : {userRole}</Text>
                <Text style={styles.token}>Token : {authToken}</Text>
                <Text style={styles.label}>Code barre :</Text>

                {/* Affichage de l'image avec indicateur de chargement */}
                {loading ? (
                    <ActivityIndicator size="large" color="#007bff" />
                ) : (
                    imageUri && (
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    )
                )}

                {/* Bouton de déconnexion */}
                <Button
                    title="Se déconnecter"
                    onPress={logout}
                    buttonStyle={styles.logoutButton}
                    containerStyle={styles.logoutContainer}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    token: {
        fontSize: 14,
        color: '#555',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#ff5252',
    },
    logoutContainer: {
        width: '80%',
        marginTop: 20,
    },
});
