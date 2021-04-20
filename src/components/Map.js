import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {accessToken} from '../res/config';
import {default as theme} from '../res/custom-theme.json';
import polyline from '@mapbox/polyline';
// import markerOne from '../res/images/marker1.png';
// import markerTwo from '../res/images/marker2.png';

MapboxGL.setAccessToken(accessToken);

export const Map = ({
  start,
  changeStart,
  destination,
  changeDestination,
  routes,
}) => {
  const bounds =
    destination && start
      ? {
          ne: destination,
          sw: start,
          paddingTop: 200,
          paddingLeft: 200,
          paddingRight: 200,
          paddingBottom: 200,
        }
      : {
          ne: [11.106090200587593, 46.94990650185683],
          sw: [9.595923969628181, 55.010052465795454],
          paddingTop: 200,
          paddingLeft: 200,
          paddingRight: 200,
          paddingBottom: 200,
        };

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

  const renderRoutes = () => {
    if (routes && routes.bike.routes) {
      const bikeRoute = routes.bike.routes[0].geometry;
      return (
        <MapboxGL.ShapeSource
          id="bike-route-source"
          shape={polyline.toGeoJSON(bikeRoute, 6)}>
          <MapboxGL.LineLayer
            id="bike-route-line"
            layerIndex={150}
            sourceID="bike-route-source"
            style={{lineWidth: 5, lineJoin: 'bevel', lineColor: '#ffffff'}}
          />
        </MapboxGL.ShapeSource>
      );
    }
  };

  const renderCargoBikeRoutes = () => {
    if (routes && routes.cargobike.routes) {
      const cargobikeRoute = routes.cargobike.routes[0].geometry;
      return (
        <MapboxGL.ShapeSource
          id="cargobike-route-source"
          shape={polyline.toGeoJSON(cargobikeRoute, 6)}>
          <MapboxGL.LineLayer
            id="cargobike-route-line"
            sourceID="cargobike-route-source"
            layerIndex={150}
            style={{lineWidth: 5, lineJoin: 'bevel', lineColor: '#515555'}}>
            <Text>Test</Text>
          </MapboxGL.LineLayer>
        </MapboxGL.ShapeSource>
      );
    }
  };

  const renderStartMarker = () => {
    if (start) {
      return (
        <MapboxGL.PointAnnotation
          id="start-marker"
          coordinate={start}
          draggable={true}
          onDragEnd={(point) => {
            changeStart(point.geometry.coordinates);
          }}>
          <View
            style={{
              ...styles.marker,
              ...styles.markerStart,
            }}
          />
        </MapboxGL.PointAnnotation>
        // <MapboxGL.ShapeSource
        //   id="symbolLayerSource-1"
        //   shape={{
        //     type: 'Feature',
        //     geometry: {
        //       type: 'Point',
        //       coordinates: start,
        //     },
        //     properties: {},
        //   }}>
        //   <MapboxGL.SymbolLayer
        //     id="symbol-1"
        //     aboveLayerID="cargobike-route-line"
        //     style={{
        //       iconImage: markerOne,
        //       iconSize: 1,
        //       iconAllowOverlap: true,
        //     }}
        //   />
        // </MapboxGL.ShapeSource>
      );
    }
  };

  const renderDestinationMarker = () => {
    if (destination) {
      return (
        <MapboxGL.PointAnnotation
          id="destination-marker"
          coordinate={destination}
          draggable={true}
          onDragEnd={(point) => {
            changeDestination(point.geometry.coordinates);
          }}>
          <View
            style={{
              ...styles.marker,
              ...styles.markerDestination,
            }}
          />
        </MapboxGL.PointAnnotation>
        // <MapboxGL.ShapeSource
        //   id="symbolLayerSource-2"
        //   shape={{
        //     type: 'Feature',
        //     geometry: {
        //       type: 'Point',
        //       coordinates: destination,
        //     },
        //     properties: {},
        //   }}>
        //   <MapboxGL.SymbolLayer
        //     id="symbol-2"
        //     aboveLayerID="cargobike-route-line"
        //     style={{
        //       iconImage: markerTwo,
        //       iconSize: 1,
        //       iconAllowOverlap: true,
        //     }}
        //   />
        // </MapboxGL.ShapeSource>
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
          <MapboxGL.Camera bounds={bounds} />
          {renderRoutes()}
          {renderCargoBikeRoutes()}
          {renderStartMarker()}
          {renderDestinationMarker()}
        </MapboxGL.MapView>
      </View>
    </View>
  );
};
