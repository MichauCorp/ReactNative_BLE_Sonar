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
import SonarView from "@/SonarView"; // Assuming SonarView is in the same directory

const Sonar = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    writeValueToDevice,
    angle,
    distance
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [rawDataToSend, setRawDataToSend] = useState<string>(''); // State for user input data
  const [manual, setManual] = useState<boolean>(false);

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

  const manualControl = () => {
    setManual(!manual);
    setRawDataToSend("0");
    handleWrite();
  }

  const turnLeft = () => {

  }
  const turnRight = () => {
    
  }

  return (
    <SafeAreaView style={styles.container}>
      {connectedDevice ? (
        <>
          <View style={styles.centerPlace}>
            <SonarView degrees={angle} distance={distance}/>
          </View>
          {manual ? (
            <>

            </>
          ) : (
            <>
              <View style = {styles.row}>
                <TouchableOpacity
                  onPress={turnLeft}
                  style = {styles.ctaButton}
                >
                  <Text>
                   {'<'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={turnRight}
                  style = {styles.ctaButton}
                >
                  <Text>
                   {'>'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          <TouchableOpacity
            onPress={manualControl}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaButtonText}>
              {manual ? "Automatic" : "manual"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={connectedDevice ? disconnectFromDevice : openModal}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaButtonText}>
              {connectedDevice ? "Disconnect" : "Connect"}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style = {styles.largeSpacing}></View>
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
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centerPlace: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeSpacing: {
    height: 675
  },
  mediumSpacing: {
    height: 200
  },
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
});

export default Sonar;
