import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationView} from './NavigationView';
import {ProjectView} from './ProjectView';
import {AboutView} from './AboutView';
import {AppMenu} from '../../components/AppMenu';

const {Navigator, Screen} = createBottomTabNavigator();

const ContentNavigator = () => (
  <Navigator
    headerMode="none"
    tabBar={(props) => <AppMenu {...props} />}
    initialRouteName="Navigation">
    <Screen name="Project" component={ProjectView} />
    <Screen name="Navigation" component={NavigationView} />
    <Screen name="About" component={AboutView} />
  </Navigator>
);

export const Content = () => <ContentNavigator />;
