import { Text, View, Image, TextInput,TouchableOpacity, Alert } from "react-native";
import splash from '../../../../assets/splash.png';
import ResetPasswordService from "../../../Services/PasswordServices/ResetPasswordService";
import styles from './Styles';
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
export default function VerificationScreen() {

    const[Code,setCode] = useState('');
    const navigation = useNavigation();
    
    
    const handleValidate = async ()=>{
        const resetEmail = await AsyncStorage.getItem("reset");
        try {
            const response = await ResetPasswordService.CheckCode(resetEmail.toLowerCase(),Code);
            if(response){
               
               
                Alert.alert("Succès", "Code vérifié avec succès.",[
                    {text:"OK",onPress:()=>navigation.navigate('newpassword-screen')}
                ])
            }
            else{
                console.log(response);
                
                Alert.alert("Erreur", "Code incorrect.")
                
            }}
            catch (error) {
                console.error("Erreur lors de la vérification du code:", error);
                Alert.alert("Erreur", "Erreur lors de la vérification du code.");
            }

        }
    return (
        <View style={styles.container}>
            <View style={styles.container1}>
                <Image source={splash} style={styles.image} />
            </View>
            <View style={styles.container2}>
                <View style={styles.containerText}>
                    <Text style={styles.text}> Code de Verification</Text>
                </View>

                <View style={styles.containerInput}>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        onChangeText={setCode}
                        maxLength={5}
                    />
              <TouchableOpacity style={styles.activeButton} onPress={handleValidate}>
                  <Text style={styles.activeText}>Valider</Text>
              </TouchableOpacity>   

                </View>
            </View>
            <View style={styles.container3}></View>
        </View>
    );
}
