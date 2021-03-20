import React from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';

export const AboutView = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        source={{uri: 'https://cargorocket.de/'}}
      />
    </SafeAreaView>
  );
};
