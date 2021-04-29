import React from 'react';
import {SafeAreaView} from 'react-native';
import {RoutingInput} from '../../components/RoutingInput';
import {MessagePopup} from '../../components/MessagePopup';
import {RoutingContext} from '../../context';
import {Map} from '../../components/Map';

export const NavigationView = (props) => {
  // Setting up Routing Context
  const start = React.useState(null);
  const destination = React.useState(null);
  const routes = React.useState(null);

  return (
    <RoutingContext.Provider value={{start, destination, routes}}>
      <SafeAreaView style={{flex: 1}}>
        <MessagePopup />
        <RoutingInput {...props} />
        <Map />
      </SafeAreaView>
    </RoutingContext.Provider>
  );
};
