import React from 'react';
import {SafeAreaView} from 'react-native';
import {RoutingInput} from '../../components/RoutingInput';

export const NavigationView = (props) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <RoutingInput {...props} />
    </SafeAreaView>
  );
};
