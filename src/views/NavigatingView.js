import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxNavigation from '@cargorocket/react-native-mapbox-navigation';
import {UiContext, LanguageContext} from '../context';
import {accessToken, cargorocketAPIKey} from '../res/config';

export const NavigatingView = ({navigation, route}) => {
  const {
    popupMessage: [popupMessage, setPopupMessage],
  } = React.useContext(UiContext);
  const i18n = React.useContext(LanguageContext);

  const navigationRef = React.useRef();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  const {routeResponse, destination} = route.params;

  return (
    <View style={styles.container}>
      <MapboxNavigation
        ref={navigationRef}
        origin={[9.177383, 48.776167]}
        destination={[9.116016, 48.823405]}
        shouldSimulateRoute={false}
        routes={JSON.stringify(routeResponse)}
        onLocationChange={(event) => {
          const {latitude, longitude} = event.nativeEvent;
        }}
        onRouteProgressChange={(event) => {
          const {
            distanceTraveled,
            durationRemaining,
            fractionTraveled,
            distanceRemaining,
          } = event.nativeEvent;
        }}
        onError={(event) => {
          setPopupMessage({
            title: i18n.modals.navigationErrorTitle,
            message: i18n.modals.navigationErrorMessage,
            status: 'success',
          });
          navigation.goBack();
        }}
        onUserOffRoute={(event) => {
          if (
            event.nativeEvent.offRoute &&
            event.nativeEvent.longitude &&
            event.nativeEvent.latitude
          ) {
            fetch(
              `https://api.cargorocket.de/route?from=[${event.nativeEvent.latitude},${event.nativeEvent.longitude}]&to=[${destination[1]},${destination[0]}]&access_token=${accessToken}&key=${cargorocketAPIKey}&format=mapbox`,
            )
              .then((routesResponse) => routesResponse.json())
              .then((routesData) => {
                navigationRef.current.updateRoute(
                  JSON.stringify({
                    duration: routesData.cargobike.routes[0].duration,
                    distance: routesData.cargobike.routes[0].distance,
                    geometry: routesData.cargobike.routes[0].geometry,
                    weight: routesData.cargobike.routes[0].weight,
                    legs: routesData.cargobike.routes[0].legs,
                  }),
                );
              })
              .catch((error) => {
                console.error(error);
              });
          }
        }}
        onCancelNavigation={() => {
          // User tapped the "X" cancel button in the nav UI
          // or canceled via the OS system tray on android.
          // Do whatever you need to here.
          // ToDo Show message?! -> feedback?!
          navigation.goBack();
        }}
        onArrive={() => {
          // Called when you arrive at the destination.
          setPopupMessage({
            title: i18n.modals.routeCompleteTitle,
            message: i18n.modals.routeCompleteMessage,
            status: 'success',
          });
          navigation.goBack();
        }}
      />
    </View>
  );
};
