import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationView} from './NavigationView';
import {ProjectView} from './ProjectView';
import {SettingsView} from './SettingsView';
import {AppMenu} from '../../components/AppMenu';
import {FeedbackView} from './FeedbackView';

const {Navigator, Screen} = createBottomTabNavigator();

const ContentNavigator = (props) => (
  <Navigator
    headerMode="none"
    tabBar={(propsTab) => <AppMenu {...propsTab} />}
    initialRouteName="Navigation">
    <Screen name="Project" component={ProjectView} />
    <Screen name="Navigation" component={NavigationView} />
    <Screen
      name="Settings"
      component={SettingsView}
      initialParams={{...props}}
    />
    <Screen name="Feedback" component={FeedbackView} />
  </Navigator>
);

export const Content = () => <ContentNavigator />;
