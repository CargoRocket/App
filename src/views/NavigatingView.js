import * as React from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {Layout, Text, Icon, Button} from '@ui-kitten/components';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {default as theme} from '../res/custom-theme.json';
import {getClosestPointOnLines, distance} from '../helpers/geometry';
import polyline from '@mapbox/polyline';
import {RoutingContext, UiContext, LanguageContext} from '../context';
import {accessToken, cargorocketAPIKey} from '../res/config';
import RNLocation from 'react-native-location';
import {RouteFeedbackPopup} from '../components/navigation/RouteFeedbackPopup';
import {NavigationHeader} from '../components/navigation/NavigationHeader';
import Tts from "react-native-tts";

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
  bottomBox: {
    position: 'absolute',
    minWidth: 120,
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
    // backgroundColor: '#F7F9FC',
    borderRadius: 80,
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

export const NavigatingView = ({navigation}) => {
  const rerouteingMargin = 0.5;
  const {
    popupMessage: [popupMessage, setPopupMessage],
  } = React.useContext(UiContext);
  const {
    destination: [destination, setDestination],
    start: [start, setStart],
    routes: [routes, setRoutes],
    selectedRoute: [selectedRoute, setSelectedRoute],
  } = React.useContext(RoutingContext);
  const i18n = React.useContext(LanguageContext);
  const route = routes[selectedRoute].routes[0];
  const legs = route.legs;

  const [feedbackShown, setFeedbackShown] = React.useState(false);

  const [currentStepId, setCurrentStepId] = React.useState(0);
  const [currentLocation, setCurrentLocation] = React.useState(start[0]);
  const [currentLegProgress, setCurrentLegProgress] = React.useState(0);
  const [currentLocationOnRoute, setCurrentLocationOnRoute] = React.useState(
    start.coordinates,
  );

  const [rerouting, setRerouting] = React.useState(false);
  const [routeGeometry, setRouteGeometry] = React.useState(
    polyline.toGeoJSON(route.geometry, 6),
  );

  let locationSubscription = React.useRef(null);
  Tts.speak('Hello, world!');

  const startRerouting = () => {
    setRerouting(true);
    fetch(
      `https://api.cargorocket.de/route?from=[${currentLocation.latitude},${currentLocation.longitude}]&to=[${destination.coordinates[1]},${destination.coordinates[0]}]&access_token=${accessToken}&key=${cargorocketAPIKey}&format=mapbox`,
    )
      .then((rawData) => rawData.json())
      .then((routesResponse) => {
        if ((routesResponse.name && routesResponse.name === 'Error') || routesResponse.status === 400) {
          setRerouting(false);
          return;
        }
        setRoutes([
          {
            ...routesResponse.cargobike,
            name: i18n.navigation.cargoBikeRoute,
            description: i18n.navigation.cargoBikeRouteDescription,
          },
          {
            ...routesResponse.bike,
            name: i18n.navigation.classicBikeRoute,
            description: i18n.navigation.classicBikeRouteDescription,
          },
        ]);
        setRerouting(false);
      })
      .catch((error) => {
        console.error(error);
        setRerouting(false);
      });
  };

  // key can be duration or distance
  const calculateRemaning = (key) => {
    let remaning = route[key];
    const currentStepRemaning = route.legs[0].steps[currentStepId][key];
    for (let n = 0; n < currentStepId; n++) {
      remaning -= route.legs[0].steps[n][key];
    }
    remaning -= currentStepRemaning * currentLegProgress;
    return remaning;
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
            setCurrentLocation(locations[0]);
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

  const matchPointOntoLeg = (stepId) => {
    const currentLeg = legs[0].steps[stepId];
    const stepGeometry = polyline.toGeoJSON(currentLeg.geometry, 6);
    const stepCoordinates = stepGeometry.coordinates.map((coordinate) => ({
      x: coordinate[0],
      y: coordinate[1],
    }));
    return getClosestPointOnLines(
      {x: currentLocation.longitude, y: currentLocation.latitude},
      stepCoordinates,
    );
  };

  React.useEffect(() => {
    if (currentLocation) {
      const currentStepPoint = matchPointOntoLeg(currentStepId);
      const distanceToCurrentStepPoint = distance(
        currentStepPoint.y,
        currentStepPoint.x,
        currentLocation.latitude,
        currentLocation.longitude,
      );

      if (currentStepId < legs[0].steps.length) {
        const nextStepPoint = matchPointOntoLeg(currentStepId + 1);
        const distanceToNextStepPoint = distance(
          nextStepPoint.y,
          nextStepPoint.x,
          currentLocation.latitude,
          currentLocation.longitude,
        );

        if (distanceToCurrentStepPoint > distanceToNextStepPoint) {
          if (distanceToNextStepPoint > rerouteingMargin) {
            // REROUTING
            startRerouting();
            return;
          }
          setCurrentStepId(currentStepId + 1);
          setCurrentLocationOnRoute([nextStepPoint.x, nextStepPoint.y]);
          setCurrentLegProgress(nextStepPoint.fTo);
        } else {
          if (distanceToCurrentStepPoint > rerouteingMargin) {
            // REROUTING
            startRerouting();
            return;
          }
          setCurrentLocationOnRoute([currentStepPoint.x, currentStepPoint.y]);
          setCurrentLegProgress(currentStepPoint.fTo);
        }
      } else {
        // Last Step
        if (distanceToCurrentStepPoint > rerouteingMargin) {
          navigation.goBack();
          setPopupMessage({
            title: i18n.modals.routeCompleteTitle,
            message: i18n.modals.routeCompleteMessage,
            status: 'success',
          });
        }
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
    const geometry = route.geometry;
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
    if (currentLocation) {
      return (
        <MapboxGL.PointAnnotation
          id="start-marker"
          coordinate={[currentLocation.longitude, currentLocation.latitude]}
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

  const feedbackIcon = (props) => (
    <Icon {...props} height={40} width={40} name="star-outline" />
  );

  const renderBottomBox = () => {
    const remaningDuration = calculateRemaning('duration');
    const remaningDistance = calculateRemaning('distance');

    const minutes = Math.round((remaningDuration % 3600) / 60);
    const hours = Math.floor(remaningDuration / 3600);

    return (
      <Layout style={styles.bottomBox}>
        <Text style={styles.minutes}>
          {hours ? `${hours}h ${minutes} min` : `${minutes} min`}
        </Text>
        <Text style={styles.distance}>
          {`${(remaningDistance / 1000).toFixed(2)} km`}
        </Text>
      </Layout>
    );
  };

  return (
    <SafeAreaView style={styles.view}>
      <RouteFeedbackPopup
        feedbackShown={feedbackShown}
        setFeedbackShown={setFeedbackShown}
        currentLocation={currentLocation}
      />
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
      <NavigationHeader
        navigation={navigation}
        rerouting={rerouting}
        legs={legs}
        currentStepId={currentStepId}
      />
      {renderBottomBox()}
      <Button
        // appearance="outline"
        onPress={() => setFeedbackShown(true)}
        style={styles.feedbackButton}
        accessoryLeft={feedbackIcon}
      />
    </SafeAreaView>
  );
};
