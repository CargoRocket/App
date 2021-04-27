import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StartView} from './StartView';
// import {SelectUse} from './SelectUse';
// import {SelectBikes} from './SelectBikes';
import {NavigatingView} from './NavigatingView';
import {Content} from './content/Content';
import {ProjectWebView} from './ProjectWebView';
// import MMKVStorage from 'react-native-mmkv-storage';

const {Navigator, Screen} = createStackNavigator();

export const Views = () => {
  // async componentWillMount() {
  //   const MMKV = new MMKVStorage.Loader().initialize();
  //   await MMKV.setBooleanAsync('isOnBoarded', true);

  //   this.isOnBoarded = await MMKV.getStringAsync('isOnBoarded');
  // }

  return (
    <NavigationContainer>
      <Navigator headerMode="none">
        <Screen name="Start" component={StartView} />
        <Screen name="Content" component={Content} />
        <Screen name="Navigating" component={NavigatingView} />
        <Screen name="ProjectWebView" component={ProjectWebView} />
        {/* isOnBoarded ? (
        <>
          <Screen name="Start" component={StartView} />
          <Screen name="SelectUse" component={SelectUse} />
          <Screen name="SelectBikes" component={SelectBikes} />
        </>
        ) : (
        <>
          <Screen name="Content" component={Content} />
          <Screen name="Navigating" component={NavigatingView} />
          <Screen name="ProjectWebView" component={ProjectWebView} />
        </>
        ) */}
      </Navigator>
    </NavigationContainer>
  );
};
