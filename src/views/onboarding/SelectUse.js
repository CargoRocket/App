import React from 'react';
import {
  TopNavigationAction,
  Layout,
  TopNavigation,
  Icon,
  Divider,
  Card,
} from '@ui-kitten/components';
import {StyleSheet, Text} from 'react-native';
import {SettingsContext, LanguageContext} from '../../context';
import theme from '../../res/custom-theme.json';

const styles = StyleSheet.create({
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  optionSelected: {
    textAlign: 'center',
    borderColor: theme['color-primary-500'],
    borderWidth: 2,
  },
});

export const SelectUse = ({navigation}) => {
  const {
    use: [use, setUse],
  } = React.useContext(SettingsContext);
  const i18n = React.useContext(LanguageContext);

  const checkMarkIcon = (props) =>
    use ? (
      <Icon {...props} fill={theme['color-primary-500']} name="checkmark" />
    ) : null;

  const renderCheckAction = () => (
    <TopNavigationAction
      icon={checkMarkIcon}
      onPress={() => {
        if (use) {
          navigation.navigate('SelectBike');
        }
      }}
    />
  );

  return (
    <Layout style={{flex: 1}}>
      <TopNavigation
        title={i18n.onboarding.yourUseCase}
        alignment="center"
        subtitle={i18n.onboarding.yourUseCaseSubtitle}
        accessoryRight={renderCheckAction}
      />
      <Divider />
      <Card
        style={
          use === 'private'
            ? {...styles.option, ...styles.optionSelected}
            : styles.option
        }
        onPress={() => setUse('private')}>
        <Text>{i18n.onboarding.private}</Text>
      </Card>
      <Card
        style={
          use === 'commercial'
            ? {...styles.option, ...styles.optionSelected}
            : styles.option
        }
        onPress={() => setUse('commercial')}>
        <Text>{i18n.onboarding.yourUseCaseSubtitle}</Text>
      </Card>
    </Layout>
  );
};
