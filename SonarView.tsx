
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SonarViewProps {
  degrees: number; // Rotation angle of the thicker radius
}

const SonarView: React.FC<SonarViewProps> = ({ degrees }) => {
  const circleRadius = 50; // Radius of the inner circle
  const outerCircleDiameter = 200; // Diameter of the outer circle
  const lineLength = outerCircleDiameter; // Length of each line (equal to outer circle diameter)
  const thickerLineLength = outerCircleDiameter / 2; // Length of the thicker radius (half of the diameter)

  // Create lines at 45 degree intervals
  const lines = Array.from({ length: 8 }).map((_, index) => {
    const angle = (index * 45); // Angle for each line
    return {
      transform: [{ rotate: `${angle}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Outer circle */}
      <View style={[styles.circle, styles.outerCircle]} />
      {/* Inner circle */}
      <View style={[styles.circle, styles.innerCircle]} />
      {/* Render lines */}
      {lines.map((style, index) => (
        <View
          key={index}
          style={[
            styles.line,
            style,
            { width: lineLength, height: 2 }, // Set width and height for lines
          ]}
        />
      ))}
      {/* Thicker radius */}
      <View
        style={[
          styles.thickerLine,
          {
            transform: [
              { translateX: thickerLineLength / 2 }, // Move the line end to the center
              { rotate: `${degrees}deg` }, // Rotate around the end
              { translateX: -thickerLineLength / 2 }, // Move it back to its original position
            ],
            width: thickerLineLength, // Adjust width for thicker line
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200, // Width to ensure it fits the outer circle
    height: 200, // Height to ensure it fits the outer circle
  },
  circle: {
    position: 'absolute',
    borderRadius: 100, // Make it a circle
    borderWidth: 2,
    borderColor: 'green',
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderWidth: 2,
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderWidth: 1,
  },
  line: {
    position: 'absolute',
    backgroundColor: 'green',
    top: '50%',
    left: '50%',
    marginLeft: -100, // Center lines based on full diameter
    marginTop: -1,  // Center lines based on height
  },
  thickerLine: {
    position: 'absolute',
    backgroundColor: 'green',
    top: '50%',
    left: '50%',
    marginTop: -2, // Center based on height
    height: 4, // Thickness of the thicker line
  },
});

export default SonarView;
