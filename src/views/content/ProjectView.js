import React from 'react';
import {SafeAreaView} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';

export const ProjectView = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text category="h1">Cargobike Index</Text>
      </Layout>
    </SafeAreaView>
  );
};
