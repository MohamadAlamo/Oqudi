import React, {useMemo, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useSelector} from 'react-redux';
import {RootState} from '../app/redux/store';
import {ThemeState} from '../app/redux/themeSlice';
import SvgPlus from '../assets/icons/AddButton.svg';
import SvgTrash from '../assets/icons/Remove.svg';

interface PhotoUploaderProps {
  onPhotoSelected: (photo: string | null) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({onPhotoSelected}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const styles = useMemo(() => Styles(theme), [theme]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleUploadPhoto = async () => {
    try {
      console.log('Upload photo button pressed');

      // Request permission to access media library
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission result:', permissionResult);

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Permission to access camera roll is required!',
        );
        return;
      }

      console.log('Opening image picker...');

      // Open image picker - using MediaTypeOptions for your version
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        console.log('Selected image URI:', uri);
        setSelectedImage(uri);
        onPhotoSelected(uri);
      } else {
        console.log('User cancelled image picker or no assets');
      }
    } catch (error) {
      console.error('Error in handleUploadPhoto:', error);
      Alert.alert('Error', `Failed to open image picker: ${error.message}`);
    }
  };

  const handleRemovePhoto = () => {
    console.log('Remove photo button pressed');
    setSelectedImage(null);
    onPhotoSelected(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={handleUploadPhoto}
          style={styles.uploadButton}
          activeOpacity={0.7}>
          {selectedImage ? (
            <Image source={{uri: selectedImage}} style={styles.selectedImage} />
          ) : (
            <SvgPlus style={styles.svgPlus} width={25} />
          )}
        </TouchableOpacity>
        {selectedImage && (
          <TouchableOpacity
            onPress={handleRemovePhoto}
            style={styles.removeButton}
            activeOpacity={0.7}>
            <SvgTrash style={styles.svgTrash} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const Styles = (theme: ThemeState) =>
  StyleSheet.create({
    container: {
      alignItems: 'flex-start',
    },
    iconContainer: {
      position: 'relative',
      width: '40%',
      height: 150,
      marginLeft: 15,
    },
    uploadButton: {
      backgroundColor: theme === 'light' ? '#F4F3F2' : '#383642',
      padding: 0,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      borderWidth: 2,
      borderStyle: 'dotted',
      borderColor: '#7E7D86',
    },
    svgPlus: {
      marginTop: 10,
    },
    selectedImage: {
      width: '100%',
      height: '100%',
      borderRadius: 5,
      resizeMode: 'cover',
    },
    removeButton: {
      position: 'absolute',
      top: -10,
      right: -10,
      backgroundColor: 'rgba(0,0,0,0.6)',
      padding: 8,
      borderRadius: 15,
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    svgTrash: {
      width: 16,
      height: 16,
      color: '#FFFFFF',
    },
  });

export default PhotoUploader;
