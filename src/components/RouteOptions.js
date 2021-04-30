import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text, ViewPager, Button, Icon, Radio} from '@ui-kitten/components';
import {RoutingContext} from '../context';

const styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  route: {
    flex: 1,
    height: 150,
    width: '80%',
  },
  routeOptions: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    // marginRight: -30,
    // marginLeft: -30,
  },
  radios: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  radio: {
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  navigationButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  spacer: {
    flexGrow: 1,
  },
});

export const RouteOptions = ({navigation}) => {
  const {
    destination: [destination, setDestination],
    start: [start, setStart],
    routes: [routes, setRoutes],
    selectedRoute: [selectedRoute, setSelectedRoute],
  } = React.useContext(RoutingContext);

  const startNavigation = (route) => {
    console.log('Check');
    console.log(route);
    navigation.navigate('Navigating', {
      routeResponse: {
        duration: route.routes[0].duration,
        distance: route.routes[0].distance,
        geometry: route.routes[0].geometry,
        weight: route.routes[0].weight,
        legs: route.routes[0].legs,
      },
    });
  };

  const navigationIcon = (props) => <Icon {...props} name="navigation" />;

  const renderRoute = (route) => {
    const minutes = Math.round((route.routes[0].duration % 3600) / 60);
    const hours = Math.floor(route.routes[0].duration / 3600);

    return (
      <View style={styles.tab}>
        <Card style={styles.route} level="1">
          <Text category="h5">{`${route.name} Route`} </Text>
          <Text appearance="hint">optimized for your bike</Text>
          <View style={styles.spacer} />
          <Text category="h6">
            {hours ? `${hours}h ${minutes} min` : `${minutes} min`}
          </Text>
          <Text category="h6">{`${(route.routes[0].distance / 1000).toFixed(2)} km`}</Text>
          <Button
            style={styles.navigationButton}
            accessoryLeft={navigationIcon}
            onPress={() => startNavigation(route)}
          />
        </Card>
      </View>
    );
  };

  return routes ? (
    <View style={styles.routeOptions}>
      <ViewPager
        style={styles.routes}
        selectedIndex={selectedRoute}
        onSelect={(index) => setSelectedRoute(index)}>
        {routes.map((route) => renderRoute(route))}
      </ViewPager>
      <View style={styles.radios}>
        {routes.map((route, index) => (
          <Radio
            style={styles.radio}
            status="basic"
            checked={index === selectedRoute}
            onChange={() => setSelectedRoute(index)}
          />
        ))}
      </View>
    </View>
  ) : null;
};
