import {Spinner} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {Icon, TopNavigation, TopNavigationAction} from '@ui-kitten/components';
import {LanguageContext} from '../context';

export const ProjectWebView = ({navigation, route}) => {
  const [currentURI, setURI] = React.useState(route.params);
  const [back, setBack] = React.useState([]);
  const webViewRef = React.useRef();
  const i18n = React.useContext(LanguageContext);

  const styles = StyleSheet.create({
    activityContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 2,
      backgroundColor: 'black',
      height: '100%',
      width: '100%',
    },
    webView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const Loader = () => (
    <View style={styles.activityContainer}>
      <Spinner status="basic" />
    </View>
  );

  const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        if (back) {
          webViewRef.current.goBack();
          return;
        }
        navigation.goBack();
      }}
    />
  );

  const Navigation = () => (
    <TopNavigation accessoryLeft={BackAction} title={i18n.goBack} />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      {Navigation()}
      <WebView
        style={styles.webView}
        source={currentURI}
        renderLoading={Loader}
        ref={webViewRef}
        onNavigationStateChange={(navState) => {
          // Keep track of going back navigation within component
          setBack(navState.canGoBack);
        }}
        allowsBackForwardNavigationGestures={true}
        onShouldStartLoadWithRequest={(request) => {
          // If we're loading the current URI, allow it to load
          if (request.url === currentURI.uri) {
            return true;
          }
          // We're loading a new URL -- change state first
          setURI(request.url);
          return false;
        }}
      />
    </SafeAreaView>
  );
};
