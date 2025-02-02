import { Text, View, Image, TextInput, TouchableOpacity, Alert, Animated, Easing } from "react-native";
import { useState, useEffect } from "react";
import splash from '../../../../assets/img/splash.png';
import ResetPasswordService from "../../../Services/PasswordServices/ResetPasswordService";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from './Styles';

export default function CheckEmailScreen() {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(30))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleValidate = async () => {
        if(email === '') {
            Alert.alert("Avertissement", "Veuillez entrer un email");
            return;
        }
        try {
            const response = await ResetPasswordService.CheckEmail(email.toLowerCase());
            if (response) {
                await AsyncStorage.setItem("reset", email);
                Alert.alert("Succès", "Code envoyé dans votre email.", [
                    { text: "OK", onPress: () => navigation.navigate('verification') }
                ]);
            } else {
                Alert.alert("Erreur", "L'email saisi n'existe pas !");
            }
        } catch (error) {
            console.log("error", error);
            Alert.alert("Erreur", "Erreur lors de la validation de l'email.");
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View 
                style={[
                    styles.headerContainer,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}
            >
                <Image source={splash} style={styles.logo} />
            </Animated.View>

            <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
                <Text style={styles.title}>Réinitialisation de mot de passe</Text>
                <Text style={styles.subtitle}>Entrez votre adresse email pour recevoir le code de vérification</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Adresse email"
                    placeholderTextColor="#A0A0A0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={setEmail}
                    value={email}
                />

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleValidate}
                    activeOpacity={0.9}
                >
                    <Text style={styles.buttonText}>Envoyer le code</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}