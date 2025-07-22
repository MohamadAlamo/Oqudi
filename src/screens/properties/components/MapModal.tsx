import React, {useState} from 'react';
import {View, Text, Modal, StyleSheet, Button} from 'react-native';
import MapView, {Marker} from 'react-native-maps'; // No MapEvent import

interface MapModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: {latitude: number; longitude: number}) => void;
}

const MapModal: React.FC<MapModalProps> = ({
  visible,
  onClose,
  onSelectLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Correct typing of event inline without needing a separate import
  const handleMapPress = (event: {
    nativeEvent: {coordinate: {latitude: number; longitude: number}};
  }) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setSelectedLocation({latitude, longitude});
  };

  const handleSaveLocation = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <MapView
          style={styles.map}
          onPress={handleMapPress}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
            />
          )}
        </MapView>
        <View style={styles.actions}>
          <Button title="Save Location" onPress={handleSaveLocation} />
          <Button title="Cancel" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  actions: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MapModal;
