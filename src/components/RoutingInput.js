import React from 'react';
import {Card, Button, Icon, Text} from '@ui-kitten/components';
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
      fetch(
        `https://api.cargorocket.de/route?from=[${start[1]},${start[0]}]&to=[${destination[1]},${destination[0]}]&access_token=${accessToken}&key=${cargorocketAPIKey}&format=mapbox`,
      )
        .then((rawData) => rawData.json())
        .then((routesResponse) => {
          setLoading(false);
          setRoutes(routesResponse);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  }, [start, destination]);

  const ChevronIcon = (props) => (
    <Icon {...props} name="chevron-right-outline" animation="shake" />
  );

  const styles = StyleSheet.create({
    routingMenu: {
      position: 'absolute',
      top: 4,
      left: '2.5%',
      width: '95%',
    },
  });

  return (
    <View>
      <Card style={styles.routingMenu}>
        <Text category="h5">Navigation</Text>
        <LocationSelect onChange={setStart} placeholder="Start" />
        <LocationSelect onChange={setDestination} placeholder="Destination" />
        <Button
          accessoryLeft={ChevronIcon}
          onPress={() => {
            if (!destination) {
              return;
            }
            if (!start) {
              return;
            }
            setLoading(true);
            // navigation.navigate('Navigating', {
            //   routeResponse: {
            //     duration: routesResponse.cargobike.routes[0].duration,
            //     distance: routesResponse.cargobike.routes[0].distance,
            //     geometry: routesResponse.cargobike.routes[0].geometry,
            //     weight: routesResponse.cargobike.routes[0].weight,
            //     legs: routesResponse.cargobike.routes[0].legs,
            //   },
            // });
          }}>
          {loading ? 'Loading' : 'Navigate'}
        </Button>
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
