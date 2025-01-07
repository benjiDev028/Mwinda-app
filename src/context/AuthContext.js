import { createContext,useState,useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from "../Services/UserServices/AuthService";



export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [userRole,setUserRole] = useState(null);
    const [authToken,setAuthToken] = useState(null);
    const [barcodeBase64, setBarcodeBase64] = useState(null);


    //verifier si l'utilisateur est connecté
    useEffect(() => {
        const checkSession  = async () => {
            try{
                const storedToken = await AsyncStorage.getItem('authToken');
                const storedRole = await AsyncStorage.getItem('userRole');
                const storedBarcode = await AsyncStorage.getItem('barcodeBase64');

                if (storedToken) {
                    setAuthToken(storedToken);
                    setUserRole(storedRole);
                    setBarcodeBase64(storedBarcode);
                  }
            }
        catch (error) {
            console.error('Erreur lors de la récupération du token ou du rôle:', error);
          }
        };
    
        checkSession();
       
    },[]);

    //fonction poour se connecter
    const login = async (email, password) => {
        const response = await AuthService.Login(email, password);
        if (response && response.access_token) {
          const token = response.access_token;
          const decodedToken = AuthService.decodeJWT(token);
          const userRole = decodedToken.role;
          const barcodeBase64 = response.barcode_base64;
          console.log('barcodeBase64',barcodeBase64);
    
          // Sauvegarder le token et le rôle dans AsyncStorag
          await AsyncStorage.setItem('authToken', token);
          await AsyncStorage.setItem('userRole', userRole);
          await AsyncStorage.setItem('barcodeBase64', barcodeBase64);
    
          setAuthToken(token);
          setUserRole(userRole);
    
          return { token, userRole,barcodeBase64  };
        } else {
          throw new Error('Échec de la connexion');
        }
      };


      const logout = async () => {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userRole');
        await AsyncStorage.removeItem('barcodeBase64');
    
        setAuthToken(null);
        setUserRole(null);
        setBarcodeBase64(null);
      };
    
      return (
        <AuthContext.Provider value={{ userRole, authToken,barcodeBase64, login, logout }}>
          {children}
        </AuthContext.Provider>
      );
    };
