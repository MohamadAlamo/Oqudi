import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../app/redux/store';
import {ThemeState} from '../app/redux/themeSlice';
import {COLORS} from '../lib/constants';

interface LoadingSkeletonProps {
  variant?: 'property' | 'unit' | 'default';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'default',
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    startAnimation();
  }, [animatedValue]);

  const animatedStyle = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    }),
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'light' ? COLORS.white : COLORS.backgroundDark,
      padding: 20,
    },
    imageContainer: {
      width: '100%',
      height: 250,
      borderRadius: 10,
      backgroundColor: theme === 'light' ? '#E5E5E5' : '#404040',
      marginBottom: 20,
    },
    dotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: COLORS.primary,
      marginRight: 8,
    },
    dotSmall: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    dotLarge: {
      width: 16,
      height: 16,
      borderRadius: 8,
    },
    barsContainer: {
      marginLeft: 20,
    },
    bar: {
      height: 12,
      borderRadius: 6,
      backgroundColor: theme === 'light' ? '#E5E5E5' : '#404040',
      marginBottom: 8,
    },
    barLong: {
      width: '70%',
    },
    barShort: {
      width: '40%',
    },
    titleBar: {
      width: '60%',
      height: 24,
      borderRadius: 12,
      backgroundColor: theme === 'light' ? '#E5E5E5' : '#404040',
      marginBottom: 10,
    },
    subtitleBar: {
      width: '40%',
      height: 16,
      borderRadius: 8,
      backgroundColor: theme === 'light' ? '#E5E5E5' : '#404040',
      marginBottom: 20,
    },
    contentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    contentBars: {
      flex: 1,
      marginLeft: 15,
    },
    contentBar: {
      height: 10,
      borderRadius: 5,
      backgroundColor: theme === 'light' ? '#E5E5E5' : '#404040',
      marginBottom: 6,
    },
    simpleBarsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      gap: 10,
    },
    primaryBar: {
      height: 8,
      width: '45%',
      borderRadius: 4,
      backgroundColor: COLORS.primary,
    },
    secondaryBar: {
      height: 8,
      width: '35%',
      borderRadius: 4,
      backgroundColor: theme === 'light' ? '#E5E5E5' : '#404040',
    },
  });

  if (variant === 'property') {
    return (
      <View style={styles.container}>
        {/* Image Skeleton */}
        <Animated.View style={[styles.imageContainer, animatedStyle]} />

        {/* Title and Subtitle */}
        <Animated.View style={[styles.titleBar, animatedStyle]} />
        <Animated.View style={[styles.subtitleBar, animatedStyle]} />

        {/* Simple animated bars */}
        <View style={styles.simpleBarsContainer}>
          <Animated.View style={[styles.primaryBar, animatedStyle]} />
          <Animated.View style={[styles.secondaryBar, animatedStyle]} />
        </View>

        {/* Additional content bars */}
        <Animated.View
          style={[styles.contentBar, {width: '80%'}, animatedStyle]}
        />
        <Animated.View
          style={[styles.contentBar, {width: '60%'}, animatedStyle]}
        />
        <Animated.View
          style={[styles.contentBar, {width: '90%'}, animatedStyle]}
        />
      </View>
    );
  }

  // Default skeleton - simple bars only
  return (
    <View style={styles.container}>
      <View style={styles.simpleBarsContainer}>
        <Animated.View style={[styles.primaryBar, animatedStyle]} />
        <Animated.View style={[styles.secondaryBar, animatedStyle]} />
      </View>
    </View>
  );
};

export default LoadingSkeleton;
