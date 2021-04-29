import React from 'react';
import {Card, Icon, Spinner} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import {LocationSelect} from './LocationSelection';
import {RoutingContext} from '../../src/context';
import {accessToken, cargorocketAPIKey} from '../res/config';
import RNLocation from 'react-native-location';

export const RoutingInput = ({navigation}) => {
  const {
    destination: [destination, setDestination],
    start: [start, setStart],
    routes: [routes, setRoutes],
  } = React.useContext(RoutingContext);
  const [loading, setLoading] = React.useState(false);

  // ToDo Should be cleared on unmount.
  let locationSubscription;

  RNLocation.configure({
    distanceFilter: 5.0,
  });

  RNLocation.requestPermission({
    ios: 'whenInUse',
    android: {
      detail: 'coarse',
    },
  }).then((granted) => {
    if (granted) {
      locationSubscription = RNLocation.subscribeToLocationUpdates(
        (locations) => {
          console.log(locations);
          setStart([locations[0].longitude, locations[0].latitude]);
        },
      );
    }
  });

  React.useEffect(() => {
    if (start && destination) {
      setLoading(true);
      fetch(
        `https://api.cargorocket.de/route?from=[${start[1]},${start[0]}]&to=[${destination[1]},${destination[0]}]&access_token=${accessToken}&key=${cargorocketAPIKey}&format=mapbox`,
      )
        .then((rawData) => rawData.json())
        .then((routesResponse) => {
          console.log(routesResponse);
          if (routesResponse.name && routesResponse.name === 'Error') {
            setLoading(false);
            return;
          }
          setLoading(false);
          setRoutes(routesResponse);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  }, [start, destination, setRoutes]);

  const ChevronIcon = (props) =>
    loading ? (
      <Spinner />
    ) : (
      <Icon {...props} name="chevron-right-outline" animation="shake" />
    );

  const styles = StyleSheet.create({
    routingMenu: {
      position: 'absolute',
      top: 4,
      left: '2.5%',
      width: '95%',
      backgroundColor: '#fff',
    },
    title: {
      fontWeight: 'bold',
      color: '#00002288',
      textAlign: 'center',
      marginBottom: 5,
    },
  });

  return (
    <Card style={styles.routingMenu}>
      <LocationSelect onChange={setDestination} placeholder="Destination" />
      {/* {destination && start ? (
        <Button
          accessoryLeft={ChevronIcon}
          onPress={() => {
            if (!destination) {
              // ToDo handle here!
              return;
            }
            if (!start) {
              // ToDo handle here!
              return;
            }
            if (!routes) {
              // ToDo handle here!
              return;
            }
            navigation.navigate('Navigating', {
              routeResponse: {
                duration: routes.cargobike.routes[0].duration,
                distance: routes.cargobike.routes[0].distance,
                geometry: routes.cargobike.routes[0].geometry,
                weight: routes.cargobike.routes[0].weight,
                legs: routes.cargobike.routes[0].legs,
              },
              destination: destination,
            });
          }}>
          {loading || !routes ? 'Loading' : 'Navigate'}
        </Button>
      ) : null} */}
    </Card>
  );
};
