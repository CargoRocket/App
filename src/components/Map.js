import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {accessToken} from '../res/config';
import {default as theme} from '../res/custom-theme.json';
import polyline from '@mapbox/polyline';
import {RoutingContext} from '../context';

MapboxGL.setAccessToken(accessToken);

export const Map = () => {
  const {
    destination: [destination, setDestination],
    start: [start, setStart],
    routes: [routes, setRoutes],
    selectedRoute: [selectedRoute, setSelectedRoute],
  } = React.useContext(RoutingContext);

  const camera = React.useRef();

  React.useEffect(() => {
    if (start && !destination) {
      camera.current.setCamera({
        centerCoordinate: start.coordinates,
        zoomLevel: 10,
        animationDuration: 2000,
      });
    }
  }, [start, destination]);

  const bounds =
    destination && start && destination.coordinates && start.coordinates
      ? {
          ne: destination.coordinates,
          sw: start.coordinates,
          paddingTop: 80,
          paddingLeft: 40,
          paddingRight: 40,
          paddingBottom: 140,
        }
      : {
          ne: [11.106090200587593, 46.94990650185683],
          sw: [9.595923969628181, 55.010052465795454],
          paddingTop: 40,
          paddingLeft: 40,
          paddingRight: 40,
          paddingBottom: 40,
        };

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
  });

  const renderRoute = (route, selected, index) => {
    const geometry = route.routes[0].geometry;
    return (
      <MapboxGL.ShapeSource
        id={`cargobike-route-source-${index}-${selectedRoute}`}
        shape={polyline.toGeoJSON(geometry, 6)}>
        <MapboxGL.LineLayer
          id={`cargobike-route-line-${index}-${selectedRoute}`}
          sourceID={`cargobike-route-source-${index}-${selectedRoute}`}
          layerIndex={selected ? 160 : 150}
          style={{lineWidth: 5, lineJoin: 'bevel', lineColor: `${selected ? '#515555' : '#f6f6f6'}` }} />
      </MapboxGL.ShapeSource>
    );
  };

  const renderStartMarker = () => {
    if (start && start.coordinates) {
      return (
        <MapboxGL.PointAnnotation
          id="start-marker"
          coordinate={start.coordinates}
          draggable={true}
          onDragEnd={(point) => {
            setStart({
              name: `${point.geometry.coordinates[0].toFixed(4)},
                ${point.geometry.coordinates[1].toFixed(4)}`,
              coordinates: point.geometry.coordinates,
            });
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
    if (destination && destination.coordinates) {
      return (
        <MapboxGL.PointAnnotation
          id="destination-marker"
          coordinate={destination.coordinates}
          draggable={true}
          onDragEnd={(point) => {
            setDestination({
              name: `${point.geometry.coordinates[0].toFixed(4)}, ${point.geometry.coordinates[1].toFixed(4)}`,
              coordinates: point.geometry.coordinates,
            });
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
    <MapboxGL.MapView
      style={styles.map}
      pitchEnabled={false}
      // styleURL={'mapbox://styles/thenewcivilian/ck6qr6ho60ypw1irod1yw005m'}
      compassEnabled={false}
      onLongPress={(point) => {
        if (!start) {
          setStart({
            name: `${point.geometry.coordinates[0].toFixed(4)}, ${point.geometry.coordinates[1].toFixed(4)}`,
            coordinates: point.geometry.coordinates,
          });
        } else {
          setDestination({
            name: `${point.geometry.coordinates[0].toFixed(4)}, ${point.geometry.coordinates[1].toFixed(4)}`,
            coordinates: point.geometry.coordinates,
          });
        }
        // Do something
      }}>
      <MapboxGL.Camera bounds={bounds} ref={camera} />
      {routes ? routes.map((route, index) => renderRoute(route, false, index)) : null}
      {routes ? renderRoute(routes[selectedRoute], true, -1) : null}
      {renderStartMarker()}
      {renderDestinationMarker()}
    </MapboxGL.MapView>
  );
};
