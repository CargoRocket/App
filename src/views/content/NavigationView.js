import React from 'react';
import {SafeAreaView} from 'react-native';
import {RoutingInput} from '../../components/RoutingInput';
import {MessagePopup} from '../../components/MessagePopup';
import {RouteOptions} from '../../components/RouteOptions';
import {Map} from '../../components/Map';

export const NavigationView = (props) => {
  // Setting up Routing Context

  return (
    <SafeAreaView style={{flex: 1}}>
      <MessagePopup />
      <RoutingInput {...props} />
      <RouteOptions {...props} />
      <Map />
    </SafeAreaView>
  );
};
