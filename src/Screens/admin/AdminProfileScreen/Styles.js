import { StyleSheet } from "react-native";


const styles = StyleSheet.create({


    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
    },
    image: {
        
      
       
        width: '50%',
        height: '50%',
       
       

    },
    container1: {
        justifyContent: 'center',
        height: 350,
        borderBottomRightRadius:50,
        borderBottomLeftRadius: 50,
        width: '100%',
        backgroundColor: '#fec107',
    },
    containerImage:{
        width: '100%',
        Height: 50,
        justifyContent: 'center',
      
    },
    
        


    icon: {
        height: 150,
        
        justifyContent: 'center',
        alignItems: 'center',
      },
      uploadButton: {
        position: 'relative',
        width: 120,
        height: 120,
        borderRadius: 60, // Cercle parfait
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
      },
      profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', // Pour que l'image prenne toute la surface du cercle
        backgroundColor: '#ddd', // Fond gris en attendant le chargement de l'image
      },
      container2: {
        flexGrow: 1, // Permet à ScrollView d'être défilable
        paddingHorizontal: 20, // Marges sur les côtés
        paddingBottom: 50, // Ajoute un espace en bas
      },
      editIcon: {
        position: 'absolute',
        bottom: 15,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fond sombre pour le crayon
        padding: 5,
        borderRadius: 20,
      },
      form: {
        marginTop: 10, // Espace entre le logo et le formulaire
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
      },
      text: {
        fontSize: 16,
        marginBottom: 5,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
      },
      editButton:{
             
        fontSize:16,
        
        alignItems:'center'
       

      },
      editButtonText:{
        fontSize: 16,
        textAlign:'center'
      },
      textdeconnection:{
        fontSize: 20,
        color: 'red',
       textAlign:'center'

        
      },
      logoutButton: {
        position: 'absolute', // Positionner le bouton en absolu
        top: 58, // Ajuste la position du bouton
        right: 30, // Positionner à droite
        padding: 10, // Ajouter un peu de padding pour la taille du bouton
        backgroundColor: '#fec', // Fond semi-transparent
        borderRadius: 60, // Arrondir les bords
        color:'red',
        
      },



})

export default styles;