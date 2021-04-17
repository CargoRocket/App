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
  const [mapCenter, setMapCenter] = React.useState([12.59, 51.64]);
  const [mapZoom, setZoom] = React.useState(4);

  React.useEffect(() => {
    setLoading(true);
    if (start && destination) {
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
          setMapCenter(
            center(start[1], start[0], destination[1], destination[0])
          );
          console.log(
            distance(start[1], start[0], destination[1], destination[0]),
          );
          console.log(
            Math.sqrt(
              distance(start[1], start[0], destination[1], destination[0]),
            ),
          );
          // ToDo Fix this bit
          setZoom(
            20 /
              Math.sqrt(
                distance(start[1], start[0], destination[1], destination[0]),
              ),
          );
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
      backgroundColor: '#88888888',
    },
    title: {
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginBottom: 5,
    },
  });

  const distance = (lat1, lon1, lat2, lon2) =>{
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    }
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344;
    return dist;
  };

  const center = (lon1, lat1, lon2, lat2) => {
    let latOut = 0;
    let lonOut = 0;
    if (lat1 >= lat2) {
      latOut = lat2 + (lat1 - lat2) / 2;
    } else {
      latOut = lat1 + (lat2 - lat1) / 2;
    }

    if (lon1 >= lon2) {
      lonOut = lon2 + (lon1 - lon2) / 2;
    } else {
      lonOut = lon1 + (lon2 - lon1) / 2;
    }
    return [latOut, lonOut];
  };

  return (
    <View>
      <Card style={styles.routingMenu}>
        <Text category="h5" style={styles.title} position="center">
          Bike-Navigation
        </Text>
        <LocationSelect onChange={setStart} placeholder="Start" />
        <LocationSelect onChange={setDestination} placeholder="Destination" />
        {destination && start ? (
          !routes ? (
            <Spinner />
          ) : (
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
          )
        ) : null}
      </Card>
      <Map
        start={start}
        changeStart={setStart}
        destination={destination}
        changeDestination={setDestination}
        routes={routes}
        mapCenter={mapCenter}
        mapZoom={mapZoom}
      />
    </View>
  );
};
