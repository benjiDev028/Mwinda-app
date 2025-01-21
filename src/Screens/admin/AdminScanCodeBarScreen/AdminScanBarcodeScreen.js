import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import Toast from "react-native-toast-message"; 
import { AuthContext } from "../../../context/AuthContext";
import { FlatList } from "react-native";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const { id } = useContext(AuthContext);
  const [manualCode, setManualCode] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [service, setService] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const fadeInModal = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const fadeOutModal = () => {
    Animated.timing(animationValue, {
      toValue: 0,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setManualCode(data); 

    if (!toastVisible) {
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Barcode scanned!",
        text2: `Code scanné: ${data}`,
      });
      setToastVisible(true); 
    }

    setCameraOpen(false); 
    setManualEntry(true); 
    fadeInModal(); 

    setTimeout(() => {
      setScanned(false);
      setToastVisible(false);
    }, 3000);
  };

  const handleOpenManualEntry = () => {
    setCameraOpen(false); 
    setManualEntry(true); 
    fadeInModal(); 
  };

  const handleCloseModal = () => {
    fadeOutModal(); 
    setTimeout(() => {
      setManualEntry(false); 
      setCameraOpen(true); 
    }, 400); 
  };

  const handleValidateForm = () => {
    console.log("ID:", id);
    console.log("Code manuel:", manualCode);
    console.log("Montant:", amount);
    console.log("Devise:", currency);
    console.log("Service:", service);

    setManualCode(""); 
    setAmount(""); 
    setCurrency("USD"); 
    setService(""); 

    setManualEntry(false); 
    setCameraOpen(true); 
  };

  if (hasPermission === null) {
    return <Text style={styles.text}>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text style={styles.text}>No access to the camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Bouton pour ouvrir la caméra */}
      {!cameraOpen && !manualEntry && (
        <Button
          title="Ouvrir la caméra"
          onPress={() => setCameraOpen(true)}
          color="#4CAF50"
        />
      )}

      {/* Caméra */}
      {cameraOpen && (
        <View style={styles.cameraContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["code128", "qr", "ean13", "pdf417", "upc_a"],
            }}
            style={styles.camera}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setCameraOpen(false)}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.manualEntryButton}
            onPress={handleOpenManualEntry}
          >
            <Text style={styles.manualEntryText}>Entrer le code manuellement</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Formulaire d'entrée manuelle */}
      {manualEntry && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={manualEntry}
          onRequestClose={() => handleCloseModal()}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Animated.View
              style={[styles.modalContainer, { opacity: animationValue }]}
            >
              <KeyboardAvoidingView
                behavior="padding"
                style={styles.formContainer}
              >
                <View style={styles.form}>
                  <Text style={styles.label}>ID (pré-rempli):</Text>
                  <TextInput
                    style={styles.input}
                    value={id}
                    editable={false}
                  />

                  <Text style={styles.label}>Code manuel:</Text>
                  <TextInput
                    style={styles.input}
                    value={manualCode}
                    onChangeText={setManualCode}
                    placeholder="Entrez le code manuel"
                  />

                  <Text style={styles.label}>Montant:</Text>
                  <TextInput
                    style={styles.input}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholder="Entrez le montant"
                  />

                  <Text style={styles.label}>Devise:</Text>
                  <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                    <TextInput
                      style={styles.input}
                      value={currency}
                      editable={false}
                      placeholder="Sélectionner la devise"
                    />
                  </TouchableOpacity>

                  {isModalVisible && (
                    <FlatList
                      data={['USD', 'CDF']}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            setCurrency(item);
                            setIsModalVisible(false);
                          }}
                        >
                          <Text style={styles.listItem}>{item}</Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item) => item}
                      style={styles.dropdown}
                    />
                  )}

                  <Text style={styles.label}>Service:</Text>
                  <TextInput
                    style={styles.input}
                    value={service}
                    onChangeText={setService}
                    placeholder="Entrez le nom"
                  />

                  <Button
                    title="Valider"
                    onPress={handleValidateForm}
                    color="#4CAF50"
                  />

                  <TouchableOpacity
                    style={styles.closeModalButton}
                    onPress={handleCloseModal}
                  >
                    <Text style={styles.closeModalText}>Fermer</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {/* Toast container */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#1c1c1c", // Teinte plus sombre pour un look élégant
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "90%",
    height: "50%",
    borderRadius: 15, // Coins arrondis pour plus de douceur
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#FF5722", // Couleur orange pour attirer l'attention
    padding: 12,
    borderRadius: 25,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  manualEntryButton: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#FF9800", // Couleur plus chaleureuse
    padding: 12,
    borderRadius: 25,
  },
  manualEntryText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)", // Fond sombre pour le modal
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  form: {
    backgroundColor: "#333",
    padding: 25,
    borderRadius: 12,
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    color: "#FF9800", // Utilisation de couleurs chaleureuses
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FF9800", // Assortir les bordures avec la palette
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    width: "100%",
    backgroundColor: "#333",
    color: "#fff",
  },
  closeModalButton: {
    backgroundColor: "#FF5722",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  closeModalText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dropdown: {
    position: "absolute",
    top: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  listItem: {
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
});
