import {Dimensions, PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// Base dimensions (iPhone 11 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Normalize font size based on screen dimensions
 * This ensures consistent font sizes across different screen sizes
 */
export const normalize = (size: number): number => {
  // Add safety checks
  if (typeof size !== 'number' || isNaN(size) || size <= 0) {
    console.warn('Invalid size passed to normalize:', size);
    return size || 16; // fallback to default
  }

  const screenWidth =
    SCREEN_WIDTH && SCREEN_WIDTH > 0 ? SCREEN_WIDTH : BASE_WIDTH;
  const scale = screenWidth / BASE_WIDTH;
  const newSize = size * scale;

  // Limit the scaling to prevent fonts from becoming too large or too small
  const minScale = 0.85;
  const maxScale = 1.3;

  const limitedScale = Math.max(minScale, Math.min(maxScale, scale));
  const result = Math.round(
    PixelRatio.roundToNearestPixel(size * limitedScale),
  );

  // Ensure we return a valid number
  return isNaN(result) ? size : result;
};

/**
 * Get responsive font size with controlled scaling
 * This allows some font scaling for accessibility but prevents layout breaking
 */
export const getResponsiveFontSize = (
  baseFontSize: number,
  maxScaleFactor: number = 1.3,
): number => {
  // Add safety checks
  if (
    typeof baseFontSize !== 'number' ||
    isNaN(baseFontSize) ||
    baseFontSize <= 0
  ) {
    console.warn(
      'Invalid baseFontSize passed to getResponsiveFontSize:',
      baseFontSize,
    );
    return baseFontSize || 16; // fallback to default
  }

  const normalizedSize = normalize(baseFontSize);

  // Limit the maximum scale factor to prevent layout issues
  const currentFontScale = PixelRatio.getFontScale();
  const safeFontScale = isNaN(currentFontScale) ? 1 : currentFontScale;
  const limitedFontScale = Math.min(safeFontScale, maxScaleFactor);

  const result = Math.round(normalizedSize * limitedFontScale);

  // Ensure we return a valid number
  return isNaN(result) ? baseFontSize : result;
};

/**
 * Responsive spacing based on screen size
 */
export const getResponsiveSpacing = (baseSpacing: number): number => {
  // Add safety checks
  if (typeof baseSpacing !== 'number' || isNaN(baseSpacing)) {
    console.warn(
      'Invalid baseSpacing passed to getResponsiveSpacing:',
      baseSpacing,
    );
    return baseSpacing || 0; // fallback to default
  }

  return normalize(baseSpacing);
};

/**
 * Get responsive dimensions for components
 */
export const getResponsiveDimensions = (
  baseWidth: number,
  baseHeight: number,
) => {
  return {
    width: normalize(baseWidth),
    height: normalize(baseHeight),
  };
};
