import { StyleSheet } from 'react-native';



const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container1: {
    alignItems: 'center',
    paddingVertical: 20, // Ajoute un espace autour du logo
    backgroundColor: '#fec107', // Couleur de fond du logo
    
  },
  activeButton: {backgroundColor: '#fec107',
    padding: 10,
    borderRadius: 20,
    marginRight: 60 ,
    width:'100%',
    alignItems: 'center', 
    marginBottom: 30,
    
    


  },
  already: {textAlign: 'center', color: 'black', marginTop: 10 },


  image: {
    width: 170, // Largeur du logo
    height: 80, // Hauteur du logo
    marginTop: 30, // Marge en haut du logo
    padding: -10, // Espace autour du logo
    
    
  },
  
  container2: {
    flexGrow: 1, // Permet à ScrollView d'être défilable
    paddingHorizontal: 20, // Marges sur les côtés
    paddingBottom: 50, // Ajoute un espace en bas
  },
  form: {
    marginTop: 20, // Espace entre le logo et le formulaire
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 100,

  },
  picker: {
    height: 50,
    width: '100%',
  },
  selectedCountry: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
};




export default styles;