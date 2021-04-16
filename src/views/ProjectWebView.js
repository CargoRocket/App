import {Spinner} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {Icon, TopNavigation, TopNavigationAction} from '@ui-kitten/components';

export const ProjectWebView = ({route}) => {
  const [currentURI, setURI] = React.useState(route.params.url);
  const [back, setBack] = React.useState([]);
  const webViewRef = React.useRef();

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
        webViewRef.current.goBack();
      }}
    />
  );
  const Navigation = () => {
    if (back) {
      return <TopNavigation accessoryLeft={BackAction} title="Go Back" />;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {Navigation()}
      <WebView
        style={styles.webView}
        source={{uri: currentURI}}
        renderLoading={Loader}
        ref={webViewRef}
        onNavigationStateChange={(navState) => {
          // Keep track of going back navigation within component
          setBack(navState.canGoBack);
        }}
        allowsBackForwardNavigationGestures={true}
        onShouldStartLoadWithRequest={(request) => {
          // If we're loading the current URI, allow it to load
          if (request.url === currentURI) {
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
