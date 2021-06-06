import React from 'react';
import {Button, Text, Icon} from '@ui-kitten/components';
import {StyleSheet, SafeAreaView} from 'react-native';
import {PrivacyPolicy} from '../../components/PrivacyPolicyDialog';
import {LanguageContext, UiContext} from '../../context';
import Logo from '../../res/images/cargo_bike.svg';

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

export const StartView = ({navigation}) => {
  const {
    onBoarding: [isOnBoarded, setOnBoarded],
  } = React.useContext(UiContext);
  const i18n = React.useContext(LanguageContext);

  const ChevronIcon = (props) => (
    <Icon {...props} name="chevron-right-outline" />
  );

  return (
    <SafeAreaView style={styles.container}>
      <PrivacyPolicy navigation={navigation} />
      <Logo width={400} height={200} />
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
          navigation.navigate('SelectBike');
        }}>
        {i18n.onboarding.goCycling}
      </Button>
    </SafeAreaView>
  );
};
