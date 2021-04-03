import React from 'react';
import {Card, Button, Icon, Text} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {LocationSelect} from './LocationSelection';
import {Map} from './Map';
import {accessToken} from '../res/config';

export const RoutingInput = ({navigation}) => {
  const [start, setStart] = React.useState(null);
  const [destination, setDestination] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

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
            const startPoint = start.center;
            const endPoint = destination.center;
            fetch(
              `https://api.cargorocket.de/route-mb?from=[${startPoint[1]},${startPoint[0]}]&to=[${endPoint[1]},${endPoint[0]}]&access_token=${accessToken}`,
            )
              .then((rawData) => rawData.json())
              .then((routesResponse) => {
                setLoading(false);
                console.log(routesResponse);
                console.log(routesResponse.routes[0]);
                navigation.navigate('Navigating', {
                  routeResponse: {
                    duration: routesResponse.routes[0].duration,
                    distance: routesResponse.routes[0].distance,
                    geometry: routesResponse.routes[0].geometry,
                    weight: routesResponse.routes[0].weight,
                    legs: routesResponse.routes[0].legs,
                  },
                });
              })
              .catch((error) => {
                console.error(error);
                setLoading(false);
              });
          }}>
          {loading ? 'Loading' : 'Navigate'}
        </Button>
      </Card>
      <Map start={start} destination={destination} />
    </View>
  );
};
