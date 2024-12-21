import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
    },
    image: {
        marginTop:40,
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    container1: {
        justifyContent: 'center',
        height: 150,
        width: '100%',
        backgroundColor: '#fec107',
    },
    container2: {
        
        height: '79%',
        backgroundColor: '#e4e4e4',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerText: {
        marginTop:-340,
        width: '100%',
        alignItems: 'center', 
        marginBottom: 20, // Ajouter un espacement entre le texte et les inputs
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
    containerInput: {
        flexDirection: 'row', // Mettre les inputs côte à côte
        justifyContent: 'center', // Centrer horizontalement les inputs
        flexWrap: 'wrap', // Permettre aux inputs de passer à la ligne si nécessaire
        gap: 10, // Ajouter un espacement entre les inputs
    },
    input: {
        height: 40,
        width: 50, // Fixer une largeur pour les inputs
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        textAlign:'center',
        marginHorizontal: 5, // Ajouter un espacement horizontal
    },
});

export default styles;
