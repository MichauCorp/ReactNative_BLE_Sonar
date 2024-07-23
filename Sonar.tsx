import useBLE from "@/useBLE";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeviceModal from "@/DeviceConnectionModal";

const Sonar = () => {
    const {
      requestPermissions,
      scanForPeripherals,
      allDevices,
      connectToDevice,
      connectedDevice,
      disconnectFromDevice,
      writeValueToDevice,
    } = useBLE();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [rawDataToSend, setRawDataToSend] = useState<string>(''); // State for user input data

    const [degrees, setDegrees] = useState<number>(0);

    const handleWrite = () => {
      // Convert rawDataToSend to Uint8Array (if needed) and write to device
      const dataToSend = new Uint8Array(rawDataToSend.split(',').map(Number));
      writeValueToDevice(dataToSend);
    };

    const scanForDevices = async () => {
      const isPermissionsEnabled = await requestPermissions();
      if (isPermissionsEnabled) {
        scanForPeripherals();
      }
    };
  
    const hideModal = () => {
      setIsModalVisible(false);
    };
  
    const openModal = async () => {
      scanForDevices();
      setIsModalVisible(true);
    };
    
    return(
        <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={connectedDevice ? disconnectFromDevice : openModal}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaButtonText}>
            {connectedDevice ? "Disconnect" : "Connect"}
          </Text>
        </TouchableOpacity>
        <DeviceModal
          closeModal={hideModal}
          visible={isModalVisible}
          connectToPeripheral={connectToDevice}
          devices={allDevices}
        />
      </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000000",
    },
    ctaButton: {
      backgroundColor: "#3BC500",
      justifyContent: "center",
      alignItems: "center",
      height: 50,
      marginHorizontal: 20,
      marginBottom: 5,
      borderRadius: 8,
    },
    ctaButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "white",
    },
    textInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      margin: 20,
      paddingHorizontal: 10,
    },
  });

export default Sonar;