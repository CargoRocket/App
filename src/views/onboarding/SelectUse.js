import React from 'react';
import {
  TopNavigationAction,
  Layout,
  TopNavigation,
  Icon,
  Divider,
  Card,
  Text,
} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {SettingsContext, LanguageContext} from '../../context';
import theme from '../../res/custom-theme.json';
import PrivateUseIcon from '../../res/images/privateUse.svg';
import CommercialUseIcon from '../../res/images/commercialUse.svg';

const styles = StyleSheet.create({
  option: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    margin: 20,
    padding: 0,
    // width: '90%',
  },
  optionSelected: {
    textAlign: 'center',
    borderColor: theme['color-primary-500'],
    borderWidth: 2,
  },
  title: {
    alignSelf: 'center',
    backgroundColor: '#222B45',
    width: '100%',
    textAlign: 'center',
    color: '#fff',
  },
  illustration: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // divider: {
  //   width: '100%',
  // },
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

  const renderItemHeader = (headerProps, text) => (
    <Text category="h4" style={styles.title}>
      {text}
    </Text>
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
        header={(headerProps) => renderItemHeader(headerProps, i18n.onboarding.private)}
        onPress={() => setUse('private')}>
        {/* <Divider style={styles.divider} /> */}
        <View style={styles.illustration}>
          <PrivateUseIcon height="200" width="200" />
        </View>
      </Card>
      <Card
        style={
          use === 'commercial'
            ? {...styles.option, ...styles.optionSelected}
            : styles.option
        }
        header={(headerProps) => renderItemHeader(headerProps, i18n.onboarding.commercial)}
        onPress={() => setUse('commercial')}>
        <View style={styles.illustration}>
          <CommercialUseIcon height="200" width="200" />
        </View>
      </Card>
    </Layout>
  );
};
