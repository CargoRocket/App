import React from 'react';
import {SafeAreaView} from 'react-native';
import {RoutingInput} from '../../components/RoutingInput';
import {MessagePopup} from '../../components/MessagePopup';

export const NavigationView = (props) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <MessagePopup />
      <RoutingInput {...props} />
    </SafeAreaView>
  );
};
