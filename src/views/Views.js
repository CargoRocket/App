import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StartView} from './StartView';
import {SelectUse} from './SelectUse';
import {SelectBikes} from './SelectBikes';
import {NavigatingView} from './NavigatingView';
import {Content} from './content/Content';
import {ProjectWebView} from './ProjectWebView';
import {UiContext} from '../context/UiContext';

const {Navigator, Screen} = createStackNavigator();

export const Views = () => {
  console.log(React.useContext(UiContext));
  const [isOnBoarded, setOnBoarded] = React.useContext(UiContext);

  // const isOnBoarded = false;
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
            <Screen name="SelectBikes" component={SelectBikes} />
          </>
        )}
      </Navigator>
    </NavigationContainer>
  );
};
