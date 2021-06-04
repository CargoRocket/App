import * as React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  ToastAndroid,
} from 'react-native';
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
import Geolocation from '@react-native-community/geolocation';
import {RouteFeedbackPopup} from '../components/navigation/RouteFeedbackPopup';
import {NavigationHeader} from '../components/navigation/NavigationHeader';
import Tts from 'react-native-tts';
import CenterIcon from '../res/images/icons/crosshairs-gps.svg';
import {deviceLanguage} from '../helpers/LanguageProvider';
import KeepAwake from 'react-native-keep-awake';
import RNDisableBatteryOptimizationsAndroid from 'react-native-disable-battery-optimizations-android';
import Base from '../helpers/base64';
import {setRoutePoint} from '../helpers/routePoints';

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
  bottomBoxDebug: {
    height: 'auto',
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

export const NavigatingView = ({navigation}) => {
  const reroutingMargin = 0.03;
  const arriveMargin = 0.01;
  const {
    popupMessage: [popupMessage, setPopupMessage],
    navigating: [navigating, setNavigating],
  } = React.useContext(UiContext);
  const {
    voiceInstructions: [voiceInstructionActive, setVoiceInstructionActive],
  } = React.useContext(SettingsContext);
  const {
    routePoints: [routePoints, setRoutePoints],
    routes: [routes, setRoutes],
    selectedRoute: [selectedRoute, setSelectedRoute],
    currentRouteInfo: [currentRouteInfo, setCurrentRouteInfo],
    routeStorage: [routeStorage, setRouteStorage],
  } = React.useContext(RoutingContext);

  const start = routePoints[0];
  const destination = routePoints[routePoints.length - 1];
  const i18n = React.useContext(LanguageContext);
  const route = routes[selectedRoute].routes[0];
  const legs = route.legs;

  const [feedbackShown, setFeedbackShown] = React.useState(false);
  const [debugCount, setDebugCount] = React.useState(0);
  const [debugModeActive, setDebugModeActive] = React.useState(false);

  const [currentStepId, setCurrentStepId] = React.useState(0);
  const [currentLocation, setCurrentLocation] = React.useState({
    longitude: start.coordinates[0],
    latitude: start.coordinates[1],
  });
  const [currentStrepProgress, setCurrentStrepProgress] = React.useState(0);
  const [currentLocationOnRoute, setCurrentLocationOnRoute] = React.useState(
    start.coordinates,
  );

  const locationSubscription = React.useRef(null);
  const [currentLeg, setCurrentLeg] = React.useState(0);

  const [rerouting, setRerouting] = React.useState(false);
  const [followUser, setFollowUser] = React.useState(true);
  const [routeGeometry, setRouteGeometry] = React.useState(
    polyline.toGeoJSON(route.geometry, 6),
  );

  const mapCamera = React.useRef(null);

  const handleDebugClick = () => {
    setDebugCount(debugCount + 1);
    if (debugCount > 1 && debugCount < 6) {
      ToastAndroid.showWithGravity(
        `You are ${6 - debugCount} clicks away from Debug mode`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else if (debugCount === 6) {
      ToastAndroid.showWithGravity(
        'Debug mode activated',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      setDebugModeActive(true);
    }
  };

  const startRerouting = () => {
    if (!rerouting) {
      setRerouting(true);

      const endpointUrl = new URL('https://api.cargorocket.de/v1/routes');
      endpointUrl.searchParams.append(
        'from',
        JSON.stringify([currentLocation.latitude, currentLocation.longitude]),
      );
      const destinationData = [
        ...routePoints[routePoints.length - 1].coordinates,
      ];
      endpointUrl.searchParams.append(
        'to',
        JSON.stringify(destinationData.reverse()),
      );
      let vias = routePoints
        .slice(1 + currentLeg, routePoints.length - 1)
        .filter((via) => via.coordinates)
        .map((via) => via.coordinates);
      if (vias.length > 0) {
        vias = vias.map((via) => [...via].reverse());
        endpointUrl.searchParams.append('vias', JSON.stringify(vias));
      }
      endpointUrl.searchParams.append('access_token', Base.atob(accessToken));
      endpointUrl.searchParams.append('key', Base.atob(cargorocketAPIKey));
      endpointUrl.searchParams.append('format', 'mapbox');
      endpointUrl.searchParams.append('lang', deviceLanguage.slice(0, 2));

      fetch(endpointUrl)
        .then((rawData) => rawData.json())
        .then((routesResponse) => {
          if (
            (routesResponse.name && routesResponse.name === 'Error') ||
            routesResponse.status === 400
          ) {
            setRerouting(false);
            return;
          }
          setRoutePoints(
            setRoutePoint(
              routePoints,
              {
                name: i18n.navigation.yourLocation,
                coordinates: [
                  currentLocation.longitude,
                  currentLocation.latitude,
                ],
              },
              0,
            ),
          );
          setRoutes([
            {
              ...routesResponse.find(
                (route) => route.profile.name === 'cargobike',
              ),
              name: i18n.navigation.cargoBikeRoute,
              description: i18n.navigation.cargoBikeRouteDescription,
            },
            {
              ...routesResponse.find((route) => route.profile.name === 'bike'),
              name: i18n.navigation.classicBikeRoute,
              description: i18n.navigation.classicBikeRouteDescription,
            },
          ]);
          if (currentRouteInfo) {
            setCurrentRouteInfo({
              ...currentRouteInfo,
              rerouting: [
                ...currentRouteInfo.rerouting,
                [currentLocation.latitude, currentLocation.longitude],
              ],
            });
          }
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
    }
  };

  // key can be duration or distance
  const calculateRemaning = (key) => {
    let remaning = route[key];
    const currentStepRemaning = legs[0].steps[currentStepId][key];
    for (let n = 0; n < currentStepId; n++) {
      remaning -= legs[0].steps[n][key];
    }
    remaning -= currentStepRemaning * currentStrepProgress;
    return remaning;
  };

  React.useEffect(() => {
    setNavigating(true);
    if (legs[0].steps[currentStepId]) {
      readVoiceInstructions(legs[0].steps[currentStepId].voiceInstructions);
    }
    RNDisableBatteryOptimizationsAndroid.isBatteryOptimizationEnabled().then(
      (value) => {
        if (value) {
          setPopupMessage({
            title: i18n.modals.powerSavingTitle,
            message: i18n.modals.powerSavingMessage,
            actionText: i18n.modals.powerSavingAction,
            action: () => {
              RNDisableBatteryOptimizationsAndroid.openBatteryModal();
            },
            status: 'info',
          });
        }
      },
    );

    setCurrentRouteInfo({
      routePoints,
      time: new Date().getTime(),
      rerouting: [],
      transmitted: false,
    });

    // Configure Default Language
    Tts.setDefaultLanguage(deviceLanguage).catch((e) => console.log(e));

    MapboxGL.setTelemetryEnabled(false);

    Geolocation.setRNConfiguration({
      authorizationLevel: 'always',
    });

    locationSubscription.current = Geolocation.watchPosition(
      (location) => {
        setCurrentLocation(location.coords);
      },
      (error) => {
        console.log(error);
      },
      {
        timeout: 10000,
        enableHighAccuracy: true,
        useSignificantChanges: false,
        maximumAge: 100,
        distanceFilter: 0,
      },
    );

    return () => {
      if (locationSubscription.current) {
        Geolocation.clearWatch(locationSubscription.current);
      }
    };
  }, []);

  const matchPointOntoLeg = (stepId) => {
    const currentLegData = legs[0].steps[stepId];
    const stepGeometry = polyline.toGeoJSON(currentLegData.geometry, 6);
    const stepCoordinates = stepGeometry.coordinates.map((coordinate) => ({
      x: coordinate[0],
      y: coordinate[1],
    }));
    if (stepCoordinates.length > 1) {
      return getClosestPointOnLines(
        {x: currentLocation.longitude, y: currentLocation.latitude},
        stepCoordinates,
      );
    }
    return stepCoordinates[0];
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
          if (
            distanceToNextStepPoint >
            currentLocation.accuracy / 1000 + reroutingMargin
          ) {
            // REROUTING
            startRerouting();
            return;
          }
          setCurrentStepId(currentStepId + 1);
          setCurrentLocationOnRoute([nextStepPoint.x, nextStepPoint.y]);
          setCurrentStrepProgress(nextStepPoint.fTo);
          if (legs[0].steps[currentStepId + 1].maneuver.type === 'arrive') {
            setCurrentLeg(currentLeg + 1);
          }
          if (legs[0].steps[currentStepId + 1]) {
            readVoiceInstructions(
              legs[0].steps[currentStepId + 1].voiceInstructions,
            );
          }
        } else {
          if (
            distanceToCurrentStepPoint >
            currentLocation.accuracy / 1000 + reroutingMargin
          ) {
            // REROUTING
            startRerouting();
            return;
          }
          setCurrentLocationOnRoute([currentStepPoint.x, currentStepPoint.y]);
          setCurrentStrepProgress(currentStepPoint.fTo);
        }
      } else {
        // Last Step
        if (
          distanceToCurrentStepPoint <
          currentLocation.accuracy / 1000 + arriveMargin
        ) {
          setRouteStorage([...routeStorage, currentRouteInfo]);
          if (
            navigation.dangerouslyGetParent() &&
            navigation.dangerouslyGetParent().state
          ) {
            const index = navigation.dangerouslyGetParent().state.index;
            if (index > 0) {
              navigation.goBack();
            } else {
              navigation.navigate('Content');
            }
          } else {
            navigation.navigate('Content');
          }
          setPopupMessage({
            title: i18n.modals.routeCompleteTitle,
            message: i18n.modals.routeCompleteMessage,
            status: 'success',
          });
          setNavigating(false);
        }
      }
    }
  }, [currentLocation, routeGeometry, currentStepId]);

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

  const renderRoutePoint = (routePoint, index) => {
    if (routePoint.coordinates) {
      return (
        <MapboxGL.PointAnnotation
          id={`routePoint-${index}`}
          key={`routePoint-${index}`}
          coordinate={routePoint.coordinates}>
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

  const feedbackIcon = (props) => (
    <Icon {...props} height={40} width={40} name="star-outline" />
  );

  const renderBottomBox = () => {
    const remaningDuration = calculateRemaning('duration');
    const remaningDistance = calculateRemaning('distance');

    const minutes = Math.round((remaningDuration % 3600) / 60);
    const hours = Math.floor(remaningDuration / 3600);

    let currentStepPoint,
      distanceToCurrentStepPoint,
      nextStepPoint,
      distanceToNextStepPoint;
    if (debugModeActive) {
      currentStepPoint = matchPointOntoLeg(currentStepId);
      distanceToCurrentStepPoint = distance(
        currentStepPoint.y,
        currentStepPoint.x,
        currentLocation.latitude,
        currentLocation.longitude,
      );

      if (currentStepId < legs[0].steps.length - 2) {
        nextStepPoint = matchPointOntoLeg(currentStepId + 1);
        distanceToNextStepPoint = distance(
          nextStepPoint.y,
          nextStepPoint.x,
          currentLocation.latitude,
          currentLocation.longitude,
        );
      }
    }

    return (
      <TouchableWithoutFeedback onPress={handleDebugClick}>
        <Layout
          style={
            debugModeActive
              ? {...styles.bottomBox, ...styles.bottomBoxDebug}
              : styles.bottomBox
          }>
          <Text style={styles.minutes}>
            {hours ? `${hours}h ${minutes} min` : `${minutes} min`}
          </Text>
          <Text style={styles.distance}>
            {`${(remaningDistance / 1000).toFixed(2)} km`}
          </Text>
          {debugModeActive ? (
            <Layout level="2">
              <Text style={styles.distance}>
                {`GPS: ${currentLocation.accuracy}`}
              </Text>
              <Text style={styles.distance}>
                {`Bearing: ${legs[0].steps[currentStepId].maneuver.bearing_after}`}
              </Text>
              <Text style={styles.distance}>
                {`Current: ${distanceToCurrentStepPoint.toFixed(4)}`}
              </Text>

              {distanceToNextStepPoint ? (
                <Text style={styles.distance}>
                  {`Next: ${distanceToNextStepPoint.toFixed(4)}`}
                </Text>
              ) : null}
            </Layout>
          ) : null}
        </Layout>
      </TouchableWithoutFeedback>
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
        compassEnabled={true}
        compassViewMargins={{x: 30, y: 100}}>
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
        {routePoints.map((routePoint, index) => {
          if (index === 0) {
            return renderRoutePoint(
              {
                name: i18n.navigation.yourLocation,
                coordinates: [
                  currentLocation.longitude,
                  currentLocation.latitude,
                ],
              },
              index,
            );
          }
          return renderRoutePoint(routePoint, index);
        })}
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
            if (!voiceInstructionActive) {
              Tts.getInitStatus().then(
                () => {
                  Tts.speak(
                    legs[0].steps[currentStepId].voiceInstructions[0].announcement,
                  );
                },
                (err) => {
                  if (err.code === 'no_engine') {
                    Tts.requestInstallEngine();
                  }
                },
              );
            }
            setVoiceInstructionActive(!voiceInstructionActive);
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
