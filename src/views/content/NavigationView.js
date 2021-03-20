import React from 'react';
import {SafeAreaView} from 'react-native';
import {RoutingInput} from '../../components/RoutingInput';

export const NavigationView = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <RoutingInput />
    </SafeAreaView>
  );
};
