import * as React from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import {Layout, Text, Icon, Button} from '@ui-kitten/components';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {default as theme} from '../res/custom-theme.json';
import {getClosestPointOnLines, distance} from '../helpers/geometry';
import polyline from '@mapbox/polyline';
import {
  RoutingContext,
  UiContext,
  LanguageContext,
  SettingsContext,
} from '../context';
import {accessToken, cargorocketAPIKey} from '../res/config';
import RNLocation from 'react-native-location';
import {RouteFeedbackPopup} from '../components/navigation/RouteFeedbackPopup';
import {NavigationHeader} from '../components/navigation/NavigationHeader';
import Tts from 'react-native-tts';
import CenterIcon from '../res/images/icons/crosshairs-gps.svg';
import {deviceLanguage} from '../helpers/LanguageProvider';
import KeepAwake from 'react-native-keep-awake';

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
  buttonPane: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    margin: 10,
    alignItems: 'center',
  },
  utilButton: {
    height: 60,
    width: 60,
    margin: 5,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
  },
  minutes: {
    fontSize: 30,
  },
  feedbackButton: {
    height: 80,
    width: 80,
    marginTop: 5,
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

Tts.setDefaultLanguage(deviceLanguage);
RNLocation.configure({
  distanceFilter: 0,
  desiredAccuracy: {
    ios: 'bestForNavigation',
    android: 'highAccuracy',
  },
  // interval: 1000,
  // maxWaitTime: 1000,
});

export const NavigatingView = ({navigation}) => {
  const reroutingMargin = 0.03;
  const arriveMargin = 0.02;
  const {
    popupMessage: [popupMessage, setPopupMessage],
  } = React.useContext(UiContext);
  const {
    voiceInstructions: [voiceInstructionActive, setVoiceInstructionActive],
  } = React.useContext(SettingsContext);
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
  const [currentLocation, setCurrentLocation] = React.useState({longitude: start.coordinates[0], latitude: start.coordinates[1]});
  const [currentLegProgress, setCurrentLegProgress] = React.useState(0);
  const [currentLocationOnRoute, setCurrentLocationOnRoute] = React.useState(
    start.coordinates,
  );

  const [rerouting, setRerouting] = React.useState(false);
  const [followUser, setFollowUser] = React.useState(true);
  const [routeGeometry, setRouteGeometry] = React.useState(
    polyline.toGeoJSON(route.geometry, 6),
  );

  const locationSubscription = React.useRef(null);
  const mapCamera = React.useRef(null);

  const startRerouting = () => {
    setRerouting(true);
    fetch(
      `https://api.cargorocket.de/v1/routes?from=[${currentLocation.latitude},${currentLocation.longitude}]&to=[${destination.coordinates[1]},${destination.coordinates[0]}]&access_token=${accessToken}&key=${cargorocketAPIKey}&format=mapbox&lang=${deviceLanguage.slice(0,2)}`,
    )
      .then((rawData) => rawData.json())
      .then((routesResponse) => {
        if (
          (routesResponse.name && routesResponse.name === 'Error') ||
          routesResponse.status === 400
        ) {
          setRerouting(false);
          return;
        }
        setRoutes([
          {
            ...routesResponse.find((route) => route.profile.name === 'cargobike'),
            name: i18n.navigation.cargoBikeRoute,
            description: i18n.navigation.cargoBikeRouteDescription,
          },
          {
            ...routesResponse.find((route) => route.profile.name === 'bike'),
            name: i18n.navigation.classicBikeRoute,
            description: i18n.navigation.classicBikeRouteDescription,
          },
        ]);
        setRerouting(false);
      })
      .catch((error) => {
        console.error(error);
        setPopupMessage({
          title: i18n.modals.errorUpdatingRouteTitle,
          message: i18n.modals.errorUpdatingRouteTitleMessage,
          status: 'error',
        });
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
    if (legs[0].steps[currentStepId]) {
      readVoiceInstructions(legs[0].steps[currentStepId].voiceInstructions);
    }
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

  const readVoiceInstructions = (instructions) => {
    if (voiceInstructionActive) {
      Tts.speak(instructions[0].announcement);
    }
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

      if (currentStepId < legs[0].steps.length - 2) {
        const nextStepPoint = matchPointOntoLeg(currentStepId + 1);
        const distanceToNextStepPoint = distance(
          nextStepPoint.y,
          nextStepPoint.x,
          currentLocation.latitude,
          currentLocation.longitude,
        );

        if (distanceToCurrentStepPoint > distanceToNextStepPoint) {
          if (distanceToNextStepPoint > reroutingMargin) {
            // REROUTING
            startRerouting();
            return;
          }
          setCurrentStepId(currentStepId + 1);
          setCurrentLocationOnRoute([nextStepPoint.x, nextStepPoint.y]);
          setCurrentLegProgress(nextStepPoint.fTo);
          if (legs[0].steps[currentStepId + 1]) {
            readVoiceInstructions(
              legs[0].steps[currentStepId + 1].voiceInstructions,
            );
          }
        } else {
          if (distanceToCurrentStepPoint > reroutingMargin) {
            // REROUTING
            startRerouting();
            return;
          }
          setCurrentLocationOnRoute([currentStepPoint.x, currentStepPoint.y]);
          setCurrentLegProgress(currentStepPoint.fTo);
        }
      } else {
        // Last Step
        if (distanceToCurrentStepPoint < arriveMargin) {
          navigation.navigate('Content');
          setPopupMessage({
            title: i18n.modals.routeCompleteTitle,
            message: i18n.modals.routeCompleteMessage,
            status: 'success',
          });
        }
      }
    }
  }, [currentLocation, routeGeometry]);

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

  const centerIcon = (props) => (
    <CenterIcon
      {...props}
      fill={followUser ? theme['color-info-500'] : '#2E3A59'}
      onPress={() => {
        setFollowUser(true);
      }}
    />
  );

  const voiceInstructionIcon = (props) => (
    <Icon
      {...props}
      name={voiceInstructionActive ? 'volume-up-outline' : 'volume-off-outline'}
    />
  );

  return (
    <SafeAreaView style={styles.view}>
      <KeepAwake />
      <RouteFeedbackPopup
        feedbackShown={feedbackShown}
        setFeedbackShown={setFeedbackShown}
        currentLocation={currentLocation}
      />
      <MapboxGL.MapView
        style={styles.map}
        // styleURL={'mapbox://styles/thenewcivilian/ck6qr6ho60ypw1irod1yw005m'}
        pitchEnabled={false}
        onRegionWillChange={(value) => {
          if (value.properties.isUserInteraction) {
            setFollowUser(false);
          }
        }}
        compassEnabled={false}>
        <MapboxGL.Camera
          pitch={400}
          centerCoordinate={
            followUser
              ? [currentLocation.longitude, currentLocation.latitude]
              : undefined
          }
          zoomLevel={17}
          heading={legs[0].steps[currentStepId].maneuver.bearing_after}
          ref={mapCamera}
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
      <View style={styles.buttonPane}>
        <Button
          status="basic"
          onPress={() => {
            setVoiceInstructionActive(!voiceInstructionActive);
            if (voiceInstructionActive) {
              Tts.getInitStatus().then(
                () => {
                  readVoiceInstructions(
                    legs[0].steps[currentStepId].voiceInstructions,
                  );
                },
                (err) => {
                  if (err.code === 'no_engine') {
                    Tts.requestInstallEngine();
                  }
                },
              );
            }
          }}
          style={styles.utilButton}
          accessoryLeft={voiceInstructionIcon}
        />
        <Button
          status="basic"
          onPress={() => {
            setFollowUser(true);
          }}
          style={styles.utilButton}
          accessoryLeft={centerIcon}
        />
        <Button
          onPress={() => setFeedbackShown(true)}
          style={styles.feedbackButton}
          accessoryLeft={feedbackIcon}
        />
      </View>
    </SafeAreaView>
  );
};
