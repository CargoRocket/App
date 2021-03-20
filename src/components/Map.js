import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {accessToken} from '../res/config';
import {default as theme} from '../res/custom-theme.json';

MapboxGL.setAccessToken(accessToken);

export const Map = ({start, changeStart, destination, changeDestination}) => {
  const styles = StyleSheet.create({
    page: {
      position: 'absolute',
      zIndex: -2,
      flex: 1,
    },
    container: {
      height: 700,
      width: 500,
    },
    map: {
      flex: 1,
    },
    marker: {
      height: 30,
      width: 30,
      borderRadius: 50,
      borderColor: '#fff',
      borderWidth: 3,
    },
    markerStart: {
      backgroundColor: theme['color-info-300'],
    },
    markerDestination: {
      backgroundColor: theme['color-warning-300'],
    },
  });

  const StartMarker = () => {
    if (start) {
      return (
        <MapboxGL.PointAnnotation
          coordinate={start.center}
          // draggable={true}
          onDragEnd={() => {
            // Do Something
          }}>
          <View
            style={{
              ...styles.marker,
              ...styles.markerStart,
            }}
          />
        </MapboxGL.PointAnnotation>
      );
    }
  };

  const DestinationMarker = () => {
    if (destination) {
      return (
        <MapboxGL.PointAnnotation
          coordinate={destination.center}
          // draggable={true}
          onDragEnd={() => {
            // Do Something
          }}>
          <View
            style={{
              ...styles.marker,
              ...styles.markerDestination,
            }}
          />
        </MapboxGL.PointAnnotation>
      );
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          pitchEnabled={false}
          compassEnabled={false}
          onLongPress={() => {
            // Do something
          }}>
          <MapboxGL.Camera zoomLevel={4} centerCoordinate={[12.59, 51.64]} />
          {StartMarker()}
          {DestinationMarker()}
        </MapboxGL.MapView>
      </View>
    </View>
  );
};
