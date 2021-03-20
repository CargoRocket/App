import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {accessToken} from '../res/config';

MapboxGL.setAccessToken(accessToken);

export const Map = () => {
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
  });

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          pitchEnabled={false}
          compassEnabled={false}
          onLongPress={() => {
            // Do something
          }}
        />
      </View>
    </View>
  );
};
