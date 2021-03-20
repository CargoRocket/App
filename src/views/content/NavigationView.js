import React from 'react';
import {SafeAreaView} from 'react-native';
import {Layout} from '@ui-kitten/components';
import {RoutingInput} from '../../components/RoutingInput';

export const NavigationView = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <RoutingInput />
      </Layout>
    </SafeAreaView>
  );
};
