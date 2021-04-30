import React from 'react';
import {Card, Icon, Layout, Spinner, Button} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
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

  RNLocation.configure({
    distanceFilter: 5.0,
  });

  RNLocation.requestPermission({
    ios: 'whenInUse',
    android: {
      detail: 'fine',
    },
  });

  React.useEffect(() => {
    if (start && destination) {
      setLoading(true);
      fetch(
        `https://api.cargorocket.de/route?from=[${start.coordinates[1]},${start.coordinates[0]}]&to=[${destination.coordinates[1]},${destination.coordinates[0]}]&access_token=${accessToken}&key=${cargorocketAPIKey}&format=mapbox`,
      )
        .then((rawData) => rawData.json())
        .then((routesResponse) => {
          console.log(routesResponse);
          if (routesResponse.name && routesResponse.name === 'Error') {
            setLoading(false);
            return;
          }
          setLoading(false);
          console.log(routesResponse);
          setRoutes(routesResponse);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  }, [start, destination, setRoutes]);

  const setCurrentLocation = () => {
    RNLocation.getLatestLocation({timeout: 60000})
      .then((latestLocation) => {
        console.log(latestLocation);
        setStart({
          name: 'Your Location',
          coordinates: [latestLocation.longitude, latestLocation.latitude],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const ChevronIcon = (props) =>
  //   loading ? (
  //     <Spinner />
  //   ) : (
  //     <Icon {...props} name="chevron-right-outline" animation="shake" />
  //   );

  const styles = StyleSheet.create({
    routingMenu: {
      position: 'absolute',
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: 0,
      borderColor: 'transparent',
    },
    layoutRow: {
      flex: 1,
      flexDirection: 'row',
    },
    searchBars: {
      flex: 1,
    },
    locationButton: {
      height: '40%',
      width: 20,
    },
    title: {
      fontWeight: 'bold',
      color: '#00002288',
      textAlign: 'center',
      marginBottom: 5,
    },
  });

  const locationIcon = (props) => (
    <Icon {...props} fill="#8F9BB3" name="radio-button-on-outline" />
  );

  return (
    <Card style={styles.routingMenu}>
      <View style={styles.layoutRow}>
        <View style={styles.searchBars}>
          <LocationSelect
            onChange={setStart}
            value={start}
            placeholder="Start"
          />
          <LocationSelect
            onChange={setDestination}
            value={destination}
            placeholder="Destination"
          />
        </View>
        <View style={styles.layout}>
          <Button
            appearance="ghost"
            onPress={setCurrentLocation}
            style={styles.locationButton}
            accessoryLeft={locationIcon}
          />
        </View>
      </View>
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
