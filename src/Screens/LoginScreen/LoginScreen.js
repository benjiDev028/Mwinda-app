import { View,Text,Image, TextInput ,Button,TouchableOpacity} from "react-native";
import  styles  from './Styles';
import splash from '../../../assets/img/splash.png';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Colors } from "react-native/Libraries/NewAppScreen";





export default  function LoginScreen(){
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [isLogin, setIsLogin] = useState(true)

    return(
        <View style ={styles.container}>
            <View style={styles.container1}><Image source={splash} style={styles.image}/></View>  

            <View style={styles.container2}>
                <View style={styles.form}>
                    <Text style={styles.text}>{t('email')}</Text>
            {/* Champ Email */}
            <TextInput
                style={styles.input}
                placeholder="Email@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none" 
                
            />
            <Text style={styles.text}>{t('password')}</Text>
            {/* Champ Mot de passe */}
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry
            />
            <View style={styles.containerBtn}>

            <TouchableOpacity style={styles.activeButton} onPress={()=>navigation.navigate('Verification')}>
                <Text style={styles.activeText}>Log in</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text  style={styles.inactiveText}>Sign in</Text>
            </TouchableOpacity>

            </View> 

            <View>
            <TouchableOpacity>
                <Text style={styles.forgotPassword}>Password forgotten ?</Text>
            </TouchableOpacity>
            </View>
            
                
            
        </View>
            </View>
            <View style={styles.container3}></View>

        </View>
    )
}