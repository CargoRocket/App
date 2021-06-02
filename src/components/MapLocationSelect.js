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
import RNLocation from 'react-native-location';

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
  mapInfo: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    paddingTop: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapInfoText: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
});

export const MapLocationSelect = ({point, onChange}) => {
  const camera = React.useRef();

  const bounds = {
    ne: [11.106090200587593, 46.94990650185683],
    sw: [9.595923969628181, 55.010052465795454],
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
  };

  React.useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);

    RNLocation.configure({
      distanceFilter: 0,
      desiredAccuracy: {
        ios: 'bestForNavigation',
        android: 'highAccuracy',
      },
    });
    RNLocation.getLatestLocation({timeout: 1000})
      .then((latestLocation) => {
        console.log(latestLocation);
        if (latestLocation && latestLocation.latitude) {
          // TODO: Fix this really bad workaround!
          setTimeout(() => {
            camera.current.setCamera({
              centerCoordinate: [
                latestLocation.longitude,
                latestLocation.latitude,
              ],
              zoomLevel: 10,
              animationDuration: 2000,
            });
          }, 1000);
        }
      })
      .catch((error) => {
        console.log('locationError', error);
      });
  }, []);

  return (
    <Layout style={{flex: 1}}>
      <MapboxGL.MapView
        style={styles.map}
        pitchEnabled={false}
        compassEnabled={false}
        onPress={(event) =>
          onChange(
            `${event.geometry.coordinates[0].toFixed(4)}, ${event.geometry.coordinates[1].toFixed(4)}`,
            event.geometry.coordinates,
          )
        }
        onLongPress={(event) =>
          onChange(
            `${event.geometry.coordinates[0].toFixed(4)}, ${event.geometry.coordinates[1].toFixed(4)}`,
            event.geometry.coordinates,
          )
        }>
        <MapboxGL.Camera bounds={bounds} ref={camera} />
        {point.coordinates ? (
          <MapboxGL.PointAnnotation
            id="select-marker"
            coordinate={point.coordinates}
            draggable={true}
            onDragEnd={(event) => {
              onChange(
                `${event.geometry.coordinates[0].toFixed(4)}, ${event.geometry.coordinates[1].toFixed(4)}`,
                event.geometry.coordinates,
              );
            }}>
            <View style={{...styles.marker, ...styles.markerStart}} />
          </MapboxGL.PointAnnotation>
        ) : null}
      </MapboxGL.MapView>
      {!point.coordinates ? (
        <View style={styles.mapInfo}>
          <Text style={styles.mapInfoText}>Tap to position marker</Text>
        </View>
      ) : null}
    </Layout>
  );
};
