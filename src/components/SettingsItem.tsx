import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Switch,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {SvgProps} from 'react-native-svg';
import NextIcon from '../assets/icons/Right.svg';

interface SettingsItemProps {
  title: string;
  icon?: string;
  imageIcon?: React.ComponentType<SvgProps>;
  onPress: () => void;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  switchStyle?: StyleProp<ViewStyle>;
  isDarkMode?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  imageIcon,
  onPress,
  isToggle = false,
  toggleValue = false,
  onToggleChange,
  containerStyle,
  titleStyle,
  iconStyle,
  switchStyle,
  isDarkMode = false,
}) => {
  const renderIcon = () => {
    if (imageIcon && typeof imageIcon !== 'string') {
      if (typeof imageIcon === 'function') {
        const IconComponent = imageIcon as React.ComponentType<SvgProps>;
        return <IconComponent style={[styles.icon, iconStyle]} />;
      } else {
        return <Image source={imageIcon} style={[styles.icon]} />;
      }
    }
    return null;
  };

  const dynamicContainerStyle = isDarkMode
    ? darkStyles.itemContainer
    : styles.itemContainer;
  const dynamicTitleStyle = isDarkMode ? darkStyles.title : styles.title;

  return (
    <TouchableOpacity
      style={[containerStyle, dynamicContainerStyle]}
      onPress={onPress}>
      {renderIcon()}
      <Text style={[dynamicTitleStyle, titleStyle]}>{title}</Text>
      {isToggle ? (
        <Switch
          style={switchStyle}
          trackColor={{
            false: isDarkMode ? '#767577' : '#E0E0E0',
            true: isDarkMode ? '#F4F3F2' : '#24232A',
          }}
          thumbColor={isDarkMode ? '#24232A' : '#FFFFFF'}
          ios_backgroundColor="#ADACB1"
          onValueChange={onToggleChange}
          value={toggleValue}
        />
      ) : (
        <NextIcon style={[styles.icon]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    // borderBottomWidth: 0.3,
    borderBottomColor: '#ADACB1',
    backgroundColor: 'white',
  },
  title: {
    flex: 1,
    marginLeft: 20,
    fontSize: 18,
    color: '#333',
  },
  icon: {
    width: 24,
    height: 24,
  },
  chevron: {
    color: '#CCCCCC',
  },
});

const darkStyles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    // borderBottomWidth: 0.3,
    borderBottomColor: '#ADACB1',
    backgroundColor: '#383642',
  },
  title: {
    flex: 1,
    marginLeft: 20,
    fontSize: 18,
    color: '#303030',
  },
  icon: {
    width: 24,
    height: 24,
  },
  chevron: {
    color: '#CCCCCC',
  },
});

export default SettingsItem;
