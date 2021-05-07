import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigatingView} from './NavigatingView';
import {Content} from './content/Content';
import {ProjectWebView} from './ProjectWebView';
import {UiContext} from '../context';

import {StartView} from './onboarding/StartView';
import {SelectBike} from './onboarding/SelectBike';
import {InputBikeSize} from './onboarding/InputBikeSize';

const {Navigator, Screen} = createStackNavigator();

export const Views = () => {
  const {
    onBoarding: [isOnBoarded, setOnBoarded],
    bikeSettingsShown: [isBikeSettingsShown, setBikeSettingsShown],
  } = React.useContext(UiContext);

  return (
    <NavigationContainer key={`nav-container-${isBikeSettingsShown}`}>
      <Navigator
        headerMode="none"
        initialRouteName={isBikeSettingsShown ? 'SelectBike' : null}>
        {isOnBoarded && !isBikeSettingsShown ? (
          <>
            <Screen name="Content" component={Content} />
            <Screen name="Navigating" component={NavigatingView} />
            <Screen name="ProjectWebView" component={ProjectWebView} />
          </>
        ) : (
          <>
            <Screen name="Start" component={StartView} />
            <Screen name="SelectBike" component={SelectBike} />
            <Screen name="InputBikeSize" component={InputBikeSize} />
          </>
        )}
      </Navigator>
    </NavigationContainer>
  );
};
