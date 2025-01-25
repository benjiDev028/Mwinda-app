import { Text, View, Image, TextInput,TouchableOpacity, Alert } from "react-native";
import splash from '../../../../assets/splash.png';
import ResetPasswordService from "../../../Services/PasswordServices/ResetPasswordService";
import styles from './Styles';
import { useState } from "react";
import { validatePassword } from "../../../Configurations/Validators";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

 export default function NewPasswordScreen(){
    
    const[Password,setPassword] = useState('');
    const navigation = useNavigation();
    const [isloading, setIsLoading] = useState(false);
    
   



    const handleValidate = async ()=>{
    
            // Validation du mot de passe
            if (!validatePassword(Password)) {
              Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères, une lettre, un chiffre et un caractère spécial.');
              return;
            }

          
            
        const resetEmail = await AsyncStorage.getItem("reset");
        try {
            
            const response = await ResetPasswordService.NewPassword(resetEmail.toLowerCase(),Password);
            
            if(response){
               
               
                Alert.alert("Succès", "Mot de passe mis a jour !.",[
                    {text:"OK",onPress:()=>navigation.navigate('Login')}
                ])
                await AsyncStorage.removeItem("reset");
            }
            else{
                console.log('rep non',response);
                
                Alert.alert("Erreur", "Erreur lors de la mise a jour du mot de passe.")
                
            }}
            catch (error) {
                console.error("erreur", error);
                Alert.alert("Erreur", "Erreur lors de la mise a jor du mot de passe.");
            }

        }
    return (
        <View style={styles.container}>
            <View style={styles.container1}>
                <Image source={splash} style={styles.image} />
            </View>
            <View style={styles.container2}>
                <View style={styles.containerText}>
                    <Text style={styles.text}> Code newe</Text>
                </View>

                <View style={styles.containerInput}>
                    <TextInput
                        style={styles.input}
                        keyboardType="default"
                        onChangeText={setPassword}
                        
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
