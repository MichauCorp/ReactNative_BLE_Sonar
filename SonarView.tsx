import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface SonarViewProps {
  degrees: number;
  distance?: number;
}

interface Dot {
  id: number;
  x: number;
  y: number;
  opacity: Animated.Value;
  createdAt: number;
}

const COOLDOWN_DURATION = 1000; // 1 second
const FADE_DURATION = 3000; // 3 seconds
const MAX_DISTANCE = 150; // Maximum distance

const SonarView: React.FC<SonarViewProps> = ({ degrees, distance }) => {
  const [dots, setDots] = useState<Dot[]>([]);
  const dotIdRef = useRef(0);
  const lastDotTimeRef = useRef(0);

  const circleRadius = 50;
  const outerCircleDiameter = 200;
  const lineLength = outerCircleDiameter;
  const thickerLineLength = outerCircleDiameter / 2;

  const lines = Array.from({ length: 8 }).map((_, index) => {
    const angle = (index * 45);
    return {
      transform: [{ rotate: `${angle}deg` }],
    };
  });

  const removeDot = useCallback((id: number) => {
    setDots(prevDots => prevDots.filter(dot => dot.id !== id));
  }, []);

  useEffect(() => {
    const now = Date.now();
    if (distance !== undefined && distance >= 0 && distance < MAX_DISTANCE) {
      if (now - lastDotTimeRef.current >= COOLDOWN_DURATION) {
        // Map distance to dot position
        const dotPosition = (distance / MAX_DISTANCE) * thickerLineLength;
        const angleInRadians = ((degrees + 180) % 360 * Math.PI) / 180;
        const x = dotPosition * Math.cos(angleInRadians);
        const y = dotPosition * Math.sin(angleInRadians);

        const newDot: Dot = {
          id: dotIdRef.current,
          x,
          y,
          opacity: new Animated.Value(1),
          createdAt: Date.now(),
        };

        dotIdRef.current += 1;
        lastDotTimeRef.current = now;

        setDots(prevDots => [...prevDots, newDot]);

        Animated.timing(newDot.opacity, {
          toValue: 0,
          duration: FADE_DURATION,
          useNativeDriver: true,
        }).start(() => removeDot(newDot.id));
      }
    }
  }, [degrees, distance, removeDot]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setDots(prevDots => prevDots.filter(dot => now - dot.createdAt < FADE_DURATION));
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.circle, styles.outerCircle]} />
      <View style={[styles.circle, styles.innerCircle]} />
      {lines.map((style, index) => (
        <View
          key={index}
          style={[
            styles.line,
            style,
            { width: lineLength, height: 2 },
          ]}
        />
      ))}
      <View
        style={[
          styles.thickerLine,
          {
            transform: [
              { translateX: thickerLineLength / 2 },
              { rotate: `${degrees}deg` },
              { translateX: -thickerLineLength / 2 },
            ],
            width: thickerLineLength,
          }
        ]}
      />
      {dots.map(dot => (
        <Animated.View
          key={dot.id}
          style={[
            styles.dot,
            {
              transform: [
                { translateX: dot.x },
                { translateY: dot.y },
              ],
              opacity: dot.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
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
    marginLeft: -100,
    marginTop: -1,
  },
  thickerLine: {
    position: 'absolute',
    backgroundColor: 'green',
    top: '50%',
    left: '50%',
    marginTop: -2,
    height: 4,
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#94F903',
    top: '50%',
    left: '50%',
    marginTop: -5,
    marginLeft: -5,
  }
});

export default SonarView;
