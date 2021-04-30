import React from 'react';
import {Card, Icon, Layout, Text, Spinner, Button} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {LocationSelect} from './LocationSelection';
import {RoutingContext} from '../../src/context';
import {accessToken, cargorocketAPIKey} from '../res/config';

export const RoutingInput = ({navigation}) => {
  const {
    destination: [destination, setDestination],
    start: [start, setStart],
    routes: [routes, setRoutes],
  } = React.useContext(RoutingContext);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (start && destination) {
      setLoading(true);
      console.log('TEST1', start);
      const requestStart = JSON.stringify(start);
      const requestEnd = JSON.stringify(destination);
      fetch(
        `https://api.cargorocket.de/route?from=[${start.coordinates[1]},${start.coordinates[0]}]&to=[${destination.coordinates[1]},${destination.coordinates[0]}]&access_token=${accessToken}&key=${cargorocketAPIKey}&format=mapbox`,
      )
        .then((rawData) => rawData.json())
        .then((routesResponse) => {
          console.log('TEST2', start);
          if (
            requestStart === JSON.stringify(start) &&
            requestEnd === JSON.stringify(destination)
          ) {
            console.log(routesResponse);
            if (routesResponse.name && routesResponse.name === 'Error') {
              setLoading(false);
              return;
            }
            setLoading(false);
            console.log(routesResponse);
            setRoutes([
              {...routesResponse.cargobike, name: 'Cargo-Bike'},
              {...routesResponse.bike, name: 'Classic Bike'},
            ]);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  }, [start, destination, setRoutes]);

  const styles = StyleSheet.create({
    navigationOverview: {
      position: 'absolute',
      width: '100%',
      flex: 1,
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      bottom: -20,
      width: 50,
      height: 50,
      borderRadius: 50,
    },
    routingMenu: {
      backgroundColor: '#ffffff',
      borderRadius: 0,
    },
    title: {
      fontWeight: 'bold',
      color: '#00002288',
      textAlign: 'center',
      marginBottom: 5,
    },
  });

  return (
    <View style={styles.navigationOverview}>
      <Card style={styles.routingMenu}>
        <LocationSelect
          onChange={setStart}
          value={start}
          placeholder="Start"
          liveLocation={true}
        />
        <LocationSelect
          onChange={setDestination}
          value={destination}
          placeholder="Destination"
        />
      </Card>
      {loading ? (
        <Card style={styles.loader}>
          <Spinner />
        </Card>
      ) : null}
    </View>
  );
};
