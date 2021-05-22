/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the UI Kitten template
 * https://github.com/akveo/react-native-ui-kitten
 *
 * Documentation: https://akveo.github.io/react-native-ui-kitten/docs
 *
 * @format
 */

import React from 'react';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import {default as theme} from './res/custom-theme.json';
import {Views} from './views/Views';
import {
  UiContext,
  SettingsContext,
  LanguageContext,
  RoutingContext,
} from './context';
import MMKVStorage from 'react-native-mmkv-storage';
import {StatusBar} from 'react-native';
import {makePersistent} from './helpers/persistantState';
import {LanguageProvider} from './helpers/LanguageProvider';

/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */

export const App = () => {
  const MMKV = new MMKVStorage.Loader().initialize();
  // Setting up UI Context
  const popupMessage = React.useState(null);
  const bikeSettingsShown = React.useState(false);
  const onBoarding = makePersistent(
    React.useState(MMKV.getBool('isOnBoarded')),
    'isOnBoarded',
    MMKV,
    'bool',
  );

  // Setting up Setting Context
  const use = makePersistent(
    React.useState(MMKV.getString('use')),
    'use',
    MMKV,
  );
  const bikeType = makePersistent(
    React.useState(MMKV.getString('bikeType')),
    'bikeType',
    MMKV,
  );
  const bikeLength = makePersistent(
    React.useState(MMKV.getInt('length')),
    'length',
    MMKV,
    'int',
  );

  const bikeWidth = makePersistent(
    React.useState(MMKV.getInt('width')),
    'width',
    MMKV,
    'int',
  );

  const userLocationConsent = makePersistent(
    React.useState(MMKV.getBool('userLocationConsent')),
    'userLocationConsent',
    MMKV,
    'bool',
  );

  const voiceInstructions = makePersistent(
    React.useState(MMKV.getBool('voiceInstructions')),
    'voiceInstructions',
    MMKV,
    'bool',
  );

  const routeStorage = makePersistent(
    React.useState(MMKV.getArray('routeStorage')),
    'routeStorage',
    MMKV,
    'array',
  );
  const currentRouteInfo = React.useState(null);

  const start = React.useState(null);
  const destination = React.useState(null);
  const routes = React.useState(null);
  const selectedRoute = React.useState(0);

  return (
    <UiContext.Provider value={{onBoarding, popupMessage, bikeSettingsShown}}>
      <SettingsContext.Provider value={{
          use,
          bikeType,
          bikeLength,
          bikeWidth,
          userLocationConsent,
          voiceInstructions,
        }}>
        <LanguageContext.Provider value={LanguageProvider()}>
          <RoutingContext.Provider
            value={{
              start,
              destination,
              routes,
              selectedRoute,
              routeStorage,
              currentRouteInfo,
            }}>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={{...eva.light, ...theme}}>
              <StatusBar backgroundColor={theme['color-primary-500']} />
              <Views />
            </ApplicationProvider>
          </RoutingContext.Provider>
        </LanguageContext.Provider>
      </SettingsContext.Provider>
    </UiContext.Provider>
  );
};
