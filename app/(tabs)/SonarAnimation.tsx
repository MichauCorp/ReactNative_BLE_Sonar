// App.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import SonarView from '@/SonarView'; // Adjust the import path as necessary

const SonarAnimation = () => {
  const [angle, setAngle] = useState(0); // State for rotation angle
  const [isRotating, setIsRotating] = useState(true); // State for rotation status
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store interval ID

  // Function to update the rotation angle
  const updateRotation = useCallback(() => {
    setAngle(prevAngle => (prevAngle + 1) % 360); // Rotate 1 degree at a time, wrap around at 360
  }, []);

  // Start or stop rotation based on the isRotating state
  useEffect(() => {
    if (isRotating) {
      // Set up interval and store interval ID in the ref
      intervalRef.current = setInterval(updateRotation, 30); // Update every 30 milliseconds
    } else {
      // Clear the interval if rotation is stopped
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function to clear interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRotating, updateRotation]);

  // Function to toggle rotation
  const toggleRotation = () => {
    setIsRotating(prevIsRotating => !prevIsRotating); // Toggle the rotation state
  };

  return (
    <SafeAreaView style={styles.container}>
      <SonarView degrees={angle} />
      {/* Styled TouchableOpacity to toggle rotation */}
      <TouchableOpacity style={styles.button} onPress={toggleRotation}>
        <Text style={styles.buttonText}>
          {isRotating ? 'Stop Rotation' : 'Resume Rotation'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Set background color to black
  },
  button: {
    backgroundColor: '#28a745', // Green background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff', // White text color
    fontSize: 16,
  },
});

export default SonarAnimation;
