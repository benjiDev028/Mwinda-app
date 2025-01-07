import { View,Text,Image, TextInput ,Button,TouchableOpacity,TouchableWithoutFeedback ,Keyboard} from "react-native";
import  styles  from './Styles';
import splash from '../../../assets/img/splash.png';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Colors } from "react-native/Libraries/NewAppScreen";
import  AuthService  from  "../../Services/UserServices/AuthService"
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';





export default  function LoginScreen(){
    const { t } = useTranslation();
    const navigation = useNavigation();

    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
      try {
        const { token, userRole } = await login(email, password);
        if (userRole === 'admin') {
          navigation.navigate('AdminHome');
        } else if (userRole === 'client') {
          navigation.navigate('ClientHome');
        }
      } catch (error) {
        setError('Échec de la connexion. Veuillez vérifier vos identifiants.');
      }
    };


    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>   
        <View style ={styles.container}>
            <View style={styles.container1}><Image source={splash} style={styles.image}/></View>  

            <View style={styles.container2}>
                <View style={styles.form}>
                    <Text style={styles.text}>{t('email')}</Text>
         
                <TextInput
                
                style={styles.input}
                placeholder="Email@gmail.com"
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCapitalize="none" 
                value={email}
                onChangeText={setEmail}
                required
                
            />
            <Text style={styles.text}>{t('password')}</Text>
           
            <TextInput
                style={styles.input}
                 textContentType="password"
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                required
            />
            <View style={styles.containerBtn}>

            <TouchableOpacity style={styles.activeButton} onPress={handleLogin}>
                <Text style={styles.activeText}>{t('login')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>navigation.navigate('signin')}>
                <Text  style={styles.inactiveText}>{t('signin')}</Text>
            </TouchableOpacity>
            {error && <Text>{error}</Text>}
            </View> 

            <View>
            <TouchableOpacity>
                <Text style={styles.forgotPassword}>{t('forgot password')} ?</Text>
            </TouchableOpacity>
            </View>
            
                
            
        </View>
            </View>
            <View style={styles.container3}></View>

        </View>
      </TouchableWithoutFeedback>
    )
}