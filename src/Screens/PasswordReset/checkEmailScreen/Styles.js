import { StyleSheet } from "react-native";




const styles =StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor:'#'
},

image:{width:'100%', height:'100%' , resizeMode : 'contain', marginTop:'50'},


container1 :{color:'red',justifyContent:'center',height:'150',width:'100%',backgroundColor:'#fec107'},


container2 :{
    height:'79%',
    alignContent:'center',
    justifyContent:'center',
    backgroundColor:'#e4e4e4',
    
  


},



containerText:{
   marginTop :'-80%',
   alignItems :'center',
  
  
   



   
},
input: {height: 40,
    width:'100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 60,
    opacity:70,
    marginTop:100
    


},   
text :{
    fontSize: 22,
    padding:15
},
activeButton: {
    backgroundColor: '#fec107',
     padding: 10, 
     borderRadius: 20,
      marginRight: 60 ,
      width:'90%',
      alignItems: 'center', 
      marginLeft:53

   
    
    
    
    },





})

export default styles;