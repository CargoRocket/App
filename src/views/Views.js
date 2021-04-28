import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigatingView} from './NavigatingView';
import {Content} from './content/Content';
import {ProjectWebView} from './ProjectWebView';
import {UiContext} from '../context';

import {StartView} from './onboarding/StartView';
import {SelectUse} from './onboarding/SelectUse';
import {SelectBike} from './onboarding/SelectBike';

const {Navigator, Screen} = createStackNavigator();

export const Views = () => {
  const {
    onBoarding: [isOnBoarded, setOnBoarded],
  } = React.useContext(UiContext);

  return (
    <NavigationContainer>
      <Navigator headerMode="none">
        {isOnBoarded ? (
          <>
            <Screen name="Content" component={Content} />
            <Screen name="Navigating" component={NavigatingView} />
            <Screen name="ProjectWebView" component={ProjectWebView} />
          </>
        ) : (
          <>
            <Screen name="Start" component={StartView} />
            <Screen name="SelectUse" component={SelectUse} />
            <Screen name="SelectBike" component={SelectBike} />
          </>
        )}
      </Navigator>
    </NavigationContainer>
  );
};
