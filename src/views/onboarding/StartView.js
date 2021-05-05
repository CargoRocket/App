import React from 'react';
import {Button, Layout, Text, Icon} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import {LanguageContext, UiContext} from '../../context';
import Logo from '../../res/images/logo.svg';

export const StartView = ({navigation}) => {
  const shakeIconRef = React.useRef();

  const {
    onBoarding: [isOnBoarded, setOnBoarded],
  } = React.useContext(UiContext);
  const i18n = React.useContext(LanguageContext);

  const ChevronIcon = (props) => (
    <Icon
      {...props}
      name="chevron-right-outline"
      ref={shakeIconRef}
      animation="shake"
    />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      textAlign: 'center',
    },
    startButton: {
      marginVertical: 16,
    },
  });

  return (
    <Layout style={styles.container}>
      <Logo width={200} height={100} />
      <Text style={styles.text} category="h1">
        {i18n.onboarding.title}
      </Text>
      <Text style={styles.text} category="s1">
        {i18n.onboarding.subtitle}
      </Text>
      <Text style={styles.text} appearance="hint">
        {i18n.onboarding.description}
      </Text>
      <Button
        style={styles.startButton}
        accessoryLeft={ChevronIcon}
        onPress={() => {
          shakeIconRef.current.startAnimation();
          navigation.navigate('SelectUse');
        }}>
        {i18n.onboarding.goCycling}
      </Button>
    </Layout>
  );
};
