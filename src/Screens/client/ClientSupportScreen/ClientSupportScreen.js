import { View, Text,StyleSheet } from 'react-native';


export default function ClientSupportScreen()  {
    return (
        <View style={styles.container}>
            <Text style={styles.text}> non disponible !</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        },
        container: {
            flex: 1,
            justifyContent: 'center',}
        });