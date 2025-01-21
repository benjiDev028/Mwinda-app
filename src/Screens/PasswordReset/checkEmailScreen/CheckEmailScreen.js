import { Text, View, Image, TextInput,TouchableOpacity } from "react-native";
import splash from '../../../../assets/img/splash.png';
import styles from './Styles';


export default function CheckEmailScreen(){
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
                    secureTextEntry
                    value=''
                    onChangeText=''
                    required
                    />            
                    
              <TouchableOpacity style={styles.activeButton} onPress=''>
                  <Text style={styles.activeText}>login</Text>
              </TouchableOpacity>                     
                </View>
            </View>
        </View>

    );



}