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
import {UiContext} from './context/UiContext';
import MMKVStorage from 'react-native-mmkv-storage';


/**
 * Use any valid `name` property from eva icons (e.g `github`, or `heart-outline`)
 * https://akveo.github.io/eva-icons
 */

export const App = () => {
  const MMKV = new MMKVStorage.Loader().initialize();
  const [isOnBoarded, setOnBoarded] = React.useState(
    MMKV.getBool('isOnBoarded'),
  );
  return (
    <UiContext.Provider value={[isOnBoarded, setOnBoarded]}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{...eva.light, ...theme}}>
        <Views />
      </ApplicationProvider>
    </UiContext.Provider>
  );
};
