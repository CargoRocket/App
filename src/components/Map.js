import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {accessToken} from '../res/config';
import {default as theme} from '../res/custom-theme.json';
import polyline from '@mapbox/polyline';
import {RoutingContext} from '../context';
import {setRoutePoint} from '../helpers/routePoints';

MapboxGL.setAccessToken(accessToken);

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

export const Map = () => {
  const {
    routePoints: [routePoints, setRoutePoints],
    routes: [routes, setRoutes],
    selectedRoute: [selectedRoute, setSelectedRoute],
  } = React.useContext(RoutingContext);

  const camera = React.useRef();

  React.useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  React.useEffect(() => {
    if (
      routePoints[0].coordinates &&
      !routePoints[routePoints.length - 1].coordinates
    ) {
      camera.current.setCamera({
        centerCoordinate: routePoints[0].coordinates,
        zoomLevel: 10,
        animationDuration: 2000,
      });
    }
  }, [routePoints]);

  const bounds =
    routePoints[routePoints.length - 1].coordinates && routePoints[0].coordinates
      ? {
          ne: routePoints[routePoints.length - 1].coordinates,
          sw: routePoints[0].coordinates,
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

  const renderRoute = (route, selected, index) => {
    const geometry = route.routes[0].geometry;
    return (
      <MapboxGL.ShapeSource
        id={`cargobike-route-source-${index}-${selectedRoute}`}
        key={`cargobike-route-source-${index}-${selectedRoute}`}
        shape={polyline.toGeoJSON(geometry, 6)}>
        <MapboxGL.LineLayer
          id={`cargobike-route-line-${index}-${selectedRoute}`}
          sourceID={`cargobike-route-source-${index}-${selectedRoute}`}
          layerIndex={selected ? 160 : 150}
          style={{lineWidth: 5, lineJoin: 'bevel', lineColor: `${selected ? '#515555' : '#f6f6f6'}` }} />
      </MapboxGL.ShapeSource>
    );
  };

  const renderRoutePoint = (routePoint, index) => {
    if (routePoint.coordinates) {
      return (
        <MapboxGL.PointAnnotation
          id={`routePoint-${index}`}
          key={`routePoint-${index}`}
          coordinate={routePoint.coordinates}
          draggable={true}
          onDragEnd={(point) => {
            setRoutePoints(
              setRoutePoint(
                routePoints,
                {
                  name: `${point.geometry.coordinates[0].toFixed(4)}, ${point.geometry.coordinates[1].toFixed(4)}`,
                  coordinates: point.geometry.coordinates,
                },
                index,
              ),
            );
          }}>
          <View
            style={
              index === 0
                ? {...styles.marker, ...styles.markerStart}
                : {...styles.marker, ...styles.markerDestination}
            }
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
        if (!routePoints[0].coordinates) {
          setRoutePoints(
            setRoutePoint(
              routePoints,
              {
                name: `${point.geometry.coordinates[0].toFixed(4)}, ${point.geometry.coordinates[1].toFixed(4)}`,
                coordinates: point.geometry.coordinates,
              },
              0,
            ),
          );
        } else {
          setRoutePoints(
            setRoutePoint(
              routePoints,
              {
                name: `${point.geometry.coordinates[0].toFixed(4)}, ${point.geometry.coordinates[1].toFixed(4)}`,
                coordinates: point.geometry.coordinates,
              },
              routePoints.length - 1,
            ),
          );
        }
        // Do something
      }}>
      <MapboxGL.Camera bounds={bounds} ref={camera} />
      {routes
        ? routes.map((route, index) => renderRoute(route, false, index))
        : null}
      {routes ? renderRoute(routes[selectedRoute], true, -1) : null}
      {routePoints.map((routePoint, index) =>
        renderRoutePoint(routePoint, index),
      )}
    </MapboxGL.MapView>
  );
};
