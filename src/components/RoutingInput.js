import React from 'react';
import {Card, Button, Icon, Text, Spinner} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {LocationSelect} from './LocationSelection';
import {Map} from './Map';
import {accessToken, cargorocketAPIKey} from '../res/config';

export const RoutingInput = ({navigation}) => {
  const [start, setStart] = React.useState(null);
  const [destination, setDestination] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [routes, setRoutes] = React.useState(null);

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
  }, [start, destination]);

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
    <View>
      <Card style={styles.routingMenu}>
        <Text category="h5" style={styles.title} position="center">
          Bike-Navigation
        </Text>
        <LocationSelect onChange={setStart} placeholder="Start" />
        <LocationSelect onChange={setDestination} placeholder="Destination" />
        {destination && start ? (
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
              });
            }}>
            {loading || !routes ? 'Loading' : 'Navigate'}
          </Button>
        ) : null}
      </Card>
      <Map
        start={start}
        changeStart={setStart}
        destination={destination}
        changeDestination={setDestination}
        routes={routes}
      />
    </View>
  );
};
