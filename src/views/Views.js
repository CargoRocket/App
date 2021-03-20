import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StartView} from './StartView';
import {NavigatingView} from './NavigatingView';
import {Content} from './content/Content';

const {Navigator, Screen} = createStackNavigator();

const ViewNavigator = () => (
  <Navigator headerMode="none">
    <Screen name="Start" component={StartView} />
    <Screen name="Content" component={Content} />
    <Screen name="Navigating" component={NavigatingView} />
  </Navigator>
);

export const Views = () => (
  <NavigationContainer>
    <ViewNavigator />
  </NavigationContainer>
);
