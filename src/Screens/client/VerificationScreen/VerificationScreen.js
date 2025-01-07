import { Text, View, Image, TextInput } from "react-native";
import splash from '../../../assets/img/splash.png';
import styles from './Styles';

export default function VerificationScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.container1}>
                <Image source={splash} style={styles.image} />
            </View>
            <View style={styles.container2}>
                <View style={styles.containerText}>
                    <Text style={styles.text}>Verification</Text>
                </View>

                <View style={styles.containerInput}>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        
                        maxLength={1}
                    />
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        
                        maxLength={1}
                    /><TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    
                    maxLength={1}
                /><TextInput
                style={styles.input}
                keyboardType="numeric"
                
                maxLength={1}
            />

                </View>
            </View>
            <View style={styles.container3}></View>
        </View>
    );
}
