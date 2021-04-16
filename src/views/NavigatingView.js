import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxNavigation from '@cargorocket/react-native-mapbox-navigation';

export const NavigatingView = ({navigation, route}) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  const {routeResponse} = route.params;

  return (
    <View style={styles.container}>
      <MapboxNavigation
        origin={[9.177383, 48.776167]}
        destination={[9.116016, 48.823405]}
        shouldSimulateRoute={false}
        routes={JSON.stringify(routeResponse)}
        onLocationChange={(event) => {
          const {latitude, longitude} = event.nativeEvent;
          console.log('locationChanged', latitude, longitude);
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
          // const { message } = ;
          // console.error( message );
          // console.error( event );
          // console.error( event.error );
          console.error(event.nativeEvent);
        }}
        onCancelNavigation={() => {
          // User tapped the "X" cancel button in the nav UI
          // or canceled via the OS system tray on android.
          // Do whatever you need to here.
        }}
        onArrive={() => {
          // Called when you arrive at the destination.
        }}
      />
    </View>
  );
};
