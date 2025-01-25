import { Text, View, Image, TextInput,TouchableOpacity ,Alert} from "react-native";
import { useState } from "react";
import splash from '../../../../assets/img/splash.png';
import ResetPasswordService from "../../../Services/PasswordServices/ResetPasswordService";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

import styles from './Styles';





export default function CheckEmailScreen(){

    const [email, setEmail] = useState(''); 
    const navigation = useNavigation();



    const handleValidate = async ()=>{

        if(email==='')
        {
            Alert.alert("Avertissement","veuillez entre un email")
            return
        }
        try {
          
            const response = await ResetPasswordService.CheckEmail(email.toLowerCase());
            
            if (response) {

           await AsyncStorage.setItem("reset",email);
           console.log("Email sauvegardé dans AsyncStorage:", email);
           


            
              Alert.alert("Succès", "code envoye dans votre email.",
                [{text:"OK",onPress:()=>navigation.navigate('verification')}]);
              
           
             

             
              
            } else {
              Alert.alert("Erreur", " l'email saisie n'existe pas !.");
            }
          } catch (error) {
            // Gestion des erreurs de réseau ou d'API
            console.log("error",error)
            Alert.alert("Erreur", "Erreur lors de la validation de l'email.",error.Text);
          }
        };

    
    




    return (
        <View style={styles.container}>
            <View style={styles.container1}>
                <Image source={splash} style={styles.image} />
            </View>

            <View style={styles.container2}>
                <View style={styles.containerText}>
                    <Text style={styles.text}>Verification  de l'email</Text>       
                    <TextInput
                    style={styles.input}
                    textContentType="email"
                    placeholder="entrer votre email"
                   
                    onChangeText={setEmail}
                    required
                    />            
                    
              <TouchableOpacity style={styles.activeButton} onPress={handleValidate}>
                  <Text style={styles.activeText}>Valider</Text>
              </TouchableOpacity>                     
                </View>
            </View>
        </View>

    );

}

