import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {accessToken} from '../res/config';
import {default as theme} from '../res/custom-theme.json';
import {
  List,
  ListItem,
  Layout,
  Button,
  Icon,
  Input,
  Text,
  Card,
  Divider,
  TopNavigation,
} from '@ui-kitten/components';
import Base from '../helpers/base64';

MapboxGL.setAccessToken(Base.atob(accessToken));

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    zIndex: -2,
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
  mapCenter: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const MapLocationSelect = ({onChange}) => {
  React.useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  const bounds = {
    ne: [11.106090200587593, 46.94990650185683],
    sw: [9.595923969628181, 55.010052465795454],
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
  };

  return (
    <Layout style={{flex: 1}}>
      <MapboxGL.MapView
        style={styles.map}
        pitchEnabled={false}
        compassEnabled={false}
        onRegionDidChange={(event) =>
          onChange(
            `${event.geometry.coordinates[0].toFixed(4)}, ${event.geometry.coordinates[1].toFixed(4)}`,
            event.geometry.coordinates,
          )
        }>
        <MapboxGL.Camera bounds={bounds} />
      </MapboxGL.MapView>
      <View style={styles.mapCenter}>
        <View style={{...styles.marker, ...styles.markerStart}}></View>
      </View>
    </Layout>
  );
};
