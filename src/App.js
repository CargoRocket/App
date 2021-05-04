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
import {Platform, NativeModules} from 'react-native';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import {default as theme} from './res/custom-theme.json';
import {Views} from './views/Views';
import {UiContext, SettingsContext, LanguageContext} from './context';
import MMKVStorage from 'react-native-mmkv-storage';
import {makePersistent} from './helpers/persistantState';
import {LanguageProvider} from './helpers/LanguageProvider';

/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */

export const App = () => {
  const MMKV = new MMKVStorage.Loader().initialize();

  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
      : NativeModules.I18nManager.localeIdentifier;
  // Setting up UI Context
  const popupMessage = React.useState(null);
  const bikeSettingsShown = React.useState(false);
  const language = React.useState(deviceLanguage.slice(0, 2));
  console.log(language);
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
    React.useState(MMKV.getString('length')),
    'length',
    MMKV,
    'int',
  );

  const bikeWidth = makePersistent(
    React.useState(MMKV.getString('width')),
    'width',
    MMKV,
    'int',
  );

  return (
    <UiContext.Provider value={{onBoarding, popupMessage, bikeSettingsShown}}>
      <SettingsContext.Provider value={{use, bikeType, bikeLength, bikeWidth}}>
        <LanguageContext.Provider value={LanguageProvider(language)}>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider {...eva} theme={{...eva.light, ...theme}}>
            <Views />
          </ApplicationProvider>
        </LanguageContext.Provider>
      </SettingsContext.Provider>
    </UiContext.Provider>
  );
};
