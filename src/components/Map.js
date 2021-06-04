import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {accessToken} from '../res/config';
import {default as theme} from '../res/custom-theme.json';
import polyline from '@mapbox/polyline';
import {RoutingContext} from '../context';
import {setRoutePoint} from '../helpers/routePoints';
import Base from '../helpers/base64';
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

    if (
      !routePoints[routePoints.length - 1].coordinates &&
      !routePoints[0].coordinates
    ) {
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
          timeout: 10000,
          maximumAge: 200000,
        },
      );
    }
  }, [routePoints]);

  React.useEffect(() => {
    if (
      routePoints[0].coordinates &&
      !routePoints[routePoints.length - 1].coordinates &&
      camera.current
    ) {
      camera.current.setCamera({
        centerCoordinate: routePoints[0].coordinates,
        zoomLevel: 10,
        animationDuration: 2000,
      });
    }
  }, [routePoints]);

  const handleLongTouch = (point) => {
    if (!routePoints[0].coordinates) {
      selectPoint(point, 0);
    } else if (!routePoints[routePoints.length - 1].coordinates) {
      selectPoint(point, routePoints.length - 1);
    }
  };

  const bounds =
    routePoints[routePoints.length - 1].coordinates &&
    routePoints[0].coordinates
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
          onDragEnd={(point) => selectPoint(point, index)}>
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

  const selectPoint = (event, index) => {
    fetch(
      `https://photon.komoot.io/reverse?lon=${event.geometry.coordinates[0]}&lat=${event.geometry.coordinates[1]}`,
    )
      .then((response) => response.json())
      .then((responseData) => {
        if (
          responseData.features &&
          responseData.features[0] &&
          responseData.features[0].properties.city &&
          responseData.features[0].properties.street
        ) {
          setRoutePoints(
            setRoutePoint(
              routePoints,
              {
                name: `${responseData.features[0].properties.street}, ${responseData.features[0].properties.city}`,
                coordinates: event.geometry.coordinates,
              },
              index,
            ),
          );
        } else {
          setRoutePoints(
            setRoutePoint(
              routePoints,
              {
                name: `${event.geometry.coordinates[0].toFixed(4)}, ${event.geometry.coordinates[1].toFixed(4)}`,
                coordinates: event.geometry.coordinates,
              },
              index,
            ),
          );
        }
      })
      .catch(() => {
        setRoutePoints(
          setRoutePoint(
            routePoints,
            {
              name: `${event.geometry.coordinates[0].toFixed(4)}, ${event.geometry.coordinates[1].toFixed(4)}`,
              coordinates: event.geometry.coordinates,
            },
            index,
          ),
        );
      });
  };

  return (
    <MapboxGL.MapView
      style={styles.map}
      pitchEnabled={false}
      // styleURL={'mapbox://styles/thenewcivilian/ck6qr6ho60ypw1irod1yw005m'}
      compassEnabled={false}
      onLongPress={handleLongTouch}>
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
