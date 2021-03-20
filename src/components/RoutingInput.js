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

  const shakeIconRef = React.useRef();

  const ChevronIcon = (props) => (
    <Icon
      {...props}
      name="chevron-right-outline"
      ref={shakeIconRef}
      animation="shake"
    />
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
              `https://api.mapbox.com/directions/v5/mapbox/cycling/${startPoint[0]}%2C${startPoint[1]}%3B${endPoint[0]}%2C${endPoint[1]}.json?geometries=polyline6&steps=true&overview=full&language=en&access_token=${accessToken}`
            )
              .then((rawData) => rawData.json())
              .then((routesResponse) => {
                setLoading(false);
                console.log(routesResponse);
                console.log(routesResponse.routes[0]);
                navigation.navigate('Navigating', {
                  routeResponse: routesResponse.routes[0],
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
      <Map />
    </View>
  );
};
