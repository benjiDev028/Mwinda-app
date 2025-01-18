import { StyleSheet } from 'react-native';



const styles = StyleSheet.create({
    container: {
        flex: 1,
       width:'100%',
        backgroundColor:'#'
    },
    
image:{width:'100%', height:'100%' , resizeMode : 'contain', marginTop:'50'},
    

container1 :{color:'red',justifyContent:'center',height:'150',width:'100%',backgroundColor:'#fec107'},


container2 :{height:'79%',alignContent:'center',justifyContent:'center',backgroundColor:'#e4e4e4'},
form: {width: '100%', marginTop:100,padding: 30,paddingTop:120,shadowColor: '#000', shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,shadowRadius: 5,height:'100%'},
input: {height: 40,width:'100%',borderColor: '#ccc',borderWidth: 1,marginBottom: 20,paddingLeft: 10,borderRadius: 60,opacity:70},   
container3 :{height:'21%',backgroundColor:'#fec107'},

containerBtn:{flexDirection: 'row', marginBottom:20 ,justifyContent:'flex-start'},
activeButton: {backgroundColor: '#fec107', padding: 10, borderRadius: 20, marginRight: 60 ,width:'50%',alignItems: 'center', },
inactiveText: {fontSize: 18, color: 'black', marginTop: 9, textAlign: 'center',},
activeText: {fontSize: 18, fontWeight: 'bold',},
forgotPassword: {textAlign: 'center', color: 'black', marginTop: 10 },
    
   
title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
input: {height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
button: {backgroundColor: 'yellow', padding: 10, borderRadius: 5, alignItems: 'center' },
buttonText: {fontSize: 18, fontWeight: 'bold' },
errortext :{
    color:'red',
}
})


export default styles;