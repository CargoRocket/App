import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {accessToken} from '../res/config';
import {default as theme} from '../res/custom-theme.json';
import {Layout, Text} from '@ui-kitten/components';
import Base from '../helpers/base64';
import {LanguageContext} from '../context';
import Geolocation from '@react-native-community/geolocation';

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
  const i18n = React.useContext(LanguageContext);

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

    Geolocation.setRNConfiguration({
      authorizationLevel: 'whenInUse',
    });
    Geolocation.getCurrentPosition(
      (location) => {
        // ToDo Fix workaround
        setTimeout(() => {
          if (camera.current) {
            camera.current.setCamera({
              centerCoordinate: [
                location.coords.longitude,
                location.coords.latitude,
              ],
              zoomLevel: 10,
              animationDuration: 2000,
            });
          }
        }, 1000);
      },
      (error) => {
        console.log('locationError', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 1000,
        maximumAge: 200000,
      },
    );
  }, []);

  const selectPoint = (event) => {
    fetch(
      `https://photon.komoot.io/reverse?lon=${event.geometry.coordinates[0]}&lat=${event.geometry.coordinates[1]}`,
    )
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        if (
          responseData.features &&
          responseData.features[0] &&
          responseData.features[0].properties.city &&
          responseData.features[0].properties.street
        ) {
          onChange(
            `${responseData.features[0].properties.street}, ${responseData.features[0].properties.city}`,
            event.geometry.coordinates,
          );
        } else {
          onChange(
            `${event.geometry.coordinates[0].toFixed(4)}, ${event.geometry.coordinates[1].toFixed(4)}`,
            event.geometry.coordinates,
          );
        }
      })
      .catch(() => {
        onChange(
          `${event.geometry.coordinates[0].toFixed(4)}, ${event.geometry.coordinates[1].toFixed(4)}`,
          event.geometry.coordinates,
        );
      });
  };

  return (
    <Layout style={{flex: 1}}>
      <MapboxGL.MapView
        style={styles.map}
        pitchEnabled={false}
        compassEnabled={false}
        onPress={selectPoint}
        onLongPress={selectPoint}>
        <MapboxGL.Camera bounds={bounds} ref={camera} />
        {point.coordinates ? (
          <MapboxGL.PointAnnotation
            id="select-marker"
            coordinate={point.coordinates}
            draggable={true}
            onDragEnd={selectPoint}>
            <View style={{...styles.marker, ...styles.markerStart}} />
          </MapboxGL.PointAnnotation>
        ) : null}
      </MapboxGL.MapView>
      {!point.coordinates ? (
        <View style={styles.mapInfo}>
          <Text style={styles.mapInfoText}>
            {i18n.mapLocationSelect.tapMap}
          </Text>
        </View>
      ) : null}
    </Layout>
  );
};
