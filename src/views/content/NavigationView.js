import React from 'react';
import {SafeAreaView} from 'react-native';
import {RoutingInput} from '../../components/RoutingInput';
import {MessagePopup} from '../../components/MessagePopup';
import {RouteOptions} from '../../components/RouteOptions';
import {RoutingContext} from '../../context';
import {Map} from '../../components/Map';

export const NavigationView = (props) => {
  // Setting up Routing Context
  const start = React.useState(null);
  const destination = React.useState(null);
  const routes = React.useState(null);
  const selectedRoute = React.useState(null);

  return (
    <RoutingContext.Provider value={{start, destination, routes, selectedRoute}}>
      <SafeAreaView style={{flex: 1}}>
        <MessagePopup />
        <RoutingInput {...props} />
        <RouteOptions {...props} />
        <Map />
      </SafeAreaView>
    </RoutingContext.Provider>
  );
};
