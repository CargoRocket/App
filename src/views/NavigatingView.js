import * as React from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {
  Layout,
  Text,
  Icon,
  Button,
  Divider,
  Spinner,
} from '@ui-kitten/components';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {default as theme} from '../res/custom-theme.json';
import {getClosestPointOnLines, distance} from '../helpers/geometry';
import polyline from '@mapbox/polyline';
// import Tts from 'react-native-tts';
// import MapboxNavigation from '@cargorocket/react-native-mapbox-navigation';
import {RoutingContext} from '../context';
import RNLocation from 'react-native-location';
// import {accessToken, cargorocketAPIKey} from '../res/config';

// Tts.setDefaultLanguage('de-DE');
// Tts.setDefaultVoice('com.apple.ttsbundle.Daniel-compact');

const styles = StyleSheet.create({
  view: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  map: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: -2,
  },
  topBox: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 80,
    margin: 10,
    width: '90%',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(143, 155, 179, 0.24)',
  },
  divider: {
    height: '100%',
    width: 1,
  },
  message: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontWeight: 'bold',
  },
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: {
    width: 30,
  },
  bottomBox: {
    position: 'absolute',
    width: 120,
    height: 80,
    margin: 10,
    bottom: 30,
    left: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(143, 155, 179, 0.24)',
  },
  minutes: {
    fontSize: 30,
  },
  feedbackButton: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    margin: 10,
    height: 80,
    width: 80,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(143, 155, 179, 0.24)',
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

export const NavigatingView = ({navigation, route}) => {
  const rerouteingMargin = 0.5;
  const {
    destination: [destination, setDestination],
    start: [start, setStart],
  } = React.useContext(RoutingContext);

  const [currentStepId, setCurrentStepId] = React.useState(0);
  const [currentLocation, setCurrentLocation] = React.useState(start);
  const [rerouting, setRerouting] = React.useState(false);
  const [currentLocationOnRoute, setCurrentLocationOnRoute] = React.useState(
    start.coordinates,
  );
  const [routeGeometry, setRouteGeometry] = React.useState(
    polyline.toGeoJSON(route.params.route.geometry, 6),
  );

  const legs = route.params.route.legs;
  let locationSubscription = React.useRef(null);

  const startRerouting = () => {
    // setRerouting(true);
  };

  const directionIcon = () => {
    const directionIcons = {
      'slight right': 'diagonal-arrow-right-up-outline',
      'slight left': 'diagonal-arrow-left-up-outline',
      right: 'corner-up-right-outline',
      left: 'corner-up-left-outline',
      'sharp right': 'arrow-forward-outline',
      'sharp left': 'arrow-back-outline',
      straight: 'arrow-upward-outline',
    };
    const icon = directionIcons[legs[0].steps[currentStepId].maneuver.modifier];

    if (!icon) {
      return 'move-outline';
    }
    console.log(icon);
    return icon;
  };

  React.useEffect(() => {
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'coarse',
      },
    }).then((granted) => {
      if (granted) {
        locationSubscription.current = RNLocation.subscribeToLocationUpdates(
          (locations) => {
            setCurrentLocation(locations);
          },
        );
      }
    });
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current();
      }
    };
  }, []);

  React.useEffect(() => {
    if (currentLocation && currentLocation[0]) {
      const currentLeg = legs[0].steps[currentStepId];
      const stepGeometry = polyline.toGeoJSON(currentLeg.geometry, 6);
      const stepCoordinates = stepGeometry.coordinates.map((coordinate) => ({x: coordinate[0], y: coordinate[1]}));
      const currentStepPoint = getClosestPointOnLines({x: currentLocation[0].longitude, y: currentLocation[0].latitude}, stepCoordinates);
      const distanceToCurrentStepPoint = distance(currentStepPoint.y, currentStepPoint.x, currentLocation[0].latitude, currentLocation[0].longitude);

      if (currentStepId < legs[0].steps.length) {
        const nextStep = legs[0].steps[currentStepId + 1];
        const nextStepGeometry = polyline.toGeoJSON(nextStep.geometry, 6);
        const nextStepCoordinates = nextStepGeometry.coordinates.map((coordinate) => ({x: coordinate[0], y: coordinate[1]}));
        const nextStepPoint = getClosestPointOnLines({x: currentLocation[0].longitude, y: currentLocation[0].latitude}, nextStepCoordinates);
        const distanceToNextStepPoint = distance(nextStepPoint.y, nextStepPoint.x, currentLocation[0].latitude, currentLocation[0].longitude);

        if (distanceToCurrentStepPoint > distanceToNextStepPoint) {
          if (distanceToNextStepPoint > rerouteingMargin) {
            console.log('REROUTING');
            startRerouting();
            return;
          }
          setCurrentStepId(currentStepId + 1);
          console.log(nextStepPoint);
          setCurrentLocationOnRoute([nextStepPoint.x, nextStepPoint.y]);
        } else {
          if (distanceToCurrentStepPoint > rerouteingMargin) {
            console.log('REROUTING');
            startRerouting();
            return;
          }
          console.log(currentStepPoint);
          setCurrentLocationOnRoute([currentStepPoint.x, currentStepPoint.y]);
        }
      } else {
        // Last Step
        console.log('LAST STEP');
      }
    }
  }, [currentLocation, routeGeometry]);

  const bounds = () => {
    const currentLeg = legs[0].steps[currentStepId];
    const stepGeometry = polyline.toGeoJSON(currentLeg.geometry, 6);
    return stepGeometry && stepGeometry.coordinates
      ? {
          ne: stepGeometry.coordinates[0],
          sw: stepGeometry.coordinates[stepGeometry.coordinates.length - 1],
          paddingTop: 80,
          paddingLeft: 40,
          paddingRight: 40,
          paddingBottom: 40,
        }
      : {
          ne: [11.106090200587593, 46.94990650185683],
          sw: [9.595923969628181, 55.010052465795454],
          paddingTop: 150,
          paddingLeft: 40,
          paddingRight: 40,
          paddingBottom: 40,
        };
  };
  const renderRoute = (index) => {
    const geometry = route.params.route.geometry;
    return (
      <MapboxGL.ShapeSource
        id={`cargobike-route-source-${index}`}
        shape={polyline.toGeoJSON(geometry, 6)}>
        <MapboxGL.LineLayer
          id={`cargobike-route-line-${index}`}
          sourceID={`cargobike-route-source-${index}`}
          layerIndex={150}
          style={{lineWidth: 5, lineJoin: 'bevel', lineColor: "#515555" }} />
      </MapboxGL.ShapeSource>
    );
  };

  const renderStartMarker = () => {
    console.log(currentLocationOnRoute);
    if (currentLocationOnRoute) {
      return (
        <MapboxGL.PointAnnotation
          id="start-marker"
          coordinate={currentLocationOnRoute}
          onDragEnd={(point) => {
            // const lat = Math.round(point.geometry.coordinates[0], 2);
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

  const closeIcon = (props) => <Icon {...props} name="close-outline" />;

  const feedbackIcon = (props) => <Icon {...props} name="alert-triangle-outline" />;

  return (
    <SafeAreaView style={styles.view}>
      <MapboxGL.MapView
        style={styles.map}
        // styleURL={'mapbox://styles/thenewcivilian/ck6qr6ho60ypw1irod1yw005m'}
        pitchEnabled={false}
        compassEnabled={false}>
        <MapboxGL.Camera
          pitch={400}
          heading={legs[0].steps[currentStepId].maneuver.bearing_after}
          bounds={bounds()}
        />
        {renderRoute()}
        {renderStartMarker()}
        {renderDestinationMarker()}
      </MapboxGL.MapView>
      <Layout style={styles.topBox} level='1'>
        <Button
          style={styles.close}
          appearance="ghost"
          accessoryRight={closeIcon}
          onPress={() => navigation.goBack()}
        />
        <Divider style={styles.divider} />
        <View style={styles.message}>
          {rerouting ? (
            <Text style={styles.messageText}>Rerouting...</Text>
          ) : (
            <Text style={styles.messageText}>
              {legs[0].steps[currentStepId].maneuver.instruction}
            </Text>
          )}
        </View>
        <Divider style={styles.divider} />
        {rerouting ? (
          <View style={styles.spinner} height={'100%'} width={40}>
            <Spinner />
          </View>
        ) : (
          <Icon style={styles.direction} name={directionIcon()} height={'100%'} width={40} fill="#000" />
        )}
      </Layout>

      <Layout style={styles.bottomBox}>
        <Text style={styles.minutes}>42min</Text>
        <Text style={styles.distance}>100km</Text>
      </Layout>

      <Button style={styles.feedbackButton} accessoryLeft={feedbackIcon}></Button>
    </SafeAreaView>
  );
};
