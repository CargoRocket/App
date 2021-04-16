import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {accessToken} from '../res/config';
import {default as theme} from '../res/custom-theme.json';
import polyline from '@mapbox/polyline';
import {lineString as makeLineString} from '@turf/helpers';

MapboxGL.setAccessToken(accessToken);

export const Map = ({
  start,
  changeStart,
  destination,
  changeDestination,
  routes,
}) => {
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
      );
    }
  };

  const renderRoutes = () => {
    if (routes) {
      const bikeRoute = routes.bike.routes[0].geometry;
      return (
        <MapboxGL.ShapeSource
          id="bike-route-source"
          shape={polyline.toGeoJSON(bikeRoute, 6)}>
          <MapboxGL.LineLayer
            id="bike-route-line"
            sourceID="bike-route-source"
            style={{lineWidth: 5, lineJoin: 'bevel', lineColor: '#ffffff'}}
          />
        </MapboxGL.ShapeSource>
      );
    }
  };

  const renderCargoBikeRoutes = () => {
    if (routes) {
      const cargobikeRoute = routes.cargobike.routes[0].geometry;
      return (
        <MapboxGL.ShapeSource
          id="cargobike-route-source"
          shape={polyline.toGeoJSON(cargobikeRoute, 6)}>
          <MapboxGL.LineLayer
            id="cargobike-route-line"
            sourceID="cargobike-route-source"
            style={{lineWidth: 5, lineJoin: 'bevel', lineColor: '#515555'}}
          />
        </MapboxGL.ShapeSource>
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
          {renderStartMarker()}
          {renderDestinationMarker()}
          {renderRoutes()}
          {renderCargoBikeRoutes()}
        </MapboxGL.MapView>
      </View>
    </View>
  );
};
