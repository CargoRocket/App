import React from 'react';
import {
  TopNavigationAction,
  Layout,
  TopNavigation,
  Icon,
  Divider,
  Text,
} from '@ui-kitten/components';
import {StyleSheet, TextInput, View} from 'react-native';
import {SettingsContext, LanguageContext, UiContext} from '../../context';
import theme from '../../res/custom-theme.json';
import BikeIcon from '../../res/images/bike_settings.svg';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    padding: 20,
  },
  actionButton: {
    backgroundColor: theme['color-primary-500'],
    padding: 10,
    borderRadius: 50,
  },
  topNavigation: {
    width: '100%',
  },
  inputs: {
    width: '100%',
  },
  icon: {
    marginTop: 10,
    marginBottom: 20,
    flex: 1,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  TextInputStyle: {
    width: '100%',
    borderRadius: 5,
    borderColor: '#E4E9F2',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 6,
    paddingBottom: 6,
    borderWidth: 1,
    color: '#2E3A59',
    backgroundColor: '#F7F9FC',
  },
});

export const InputBikeSize = ({navigation}) => {
  const i18n = React.useContext(LanguageContext);

  const {
    bikeLength: [length, setLength],
    bikeWidth: [width, setWidth],
  } = React.useContext(SettingsContext);

  const {
    onBoarding: [isOnBoarded, setOnBoarded],
    popupMessage: [popupMessage, setPopupMessage],
    bikeSettingsShown: [isBikeSettingsShown, setBikeSettingsShown],
  } = React.useContext(UiContext);

  const checkMarkIcon = (props) =>
    length && width ? <Icon {...props} fill="#fff" name="checkmark" /> : null;

  const renderCheckAction = () => (
    <TopNavigationAction
      icon={checkMarkIcon}
      style={styles.actionButton}
      onPress={() => {
        if (length && width) {
          if (isBikeSettingsShown) {
            setBikeSettingsShown(false);
            setPopupMessage({
              title: i18n.modals.settingsUpdatedTitle,
              message: i18n.modals.settingsUpdatedMessage,
              status: 'success',
            });
            return;
          }
          setOnBoarded(true);
          setPopupMessage({
            title: i18n.modals.welcomeTitle,
            message: i18n.modals.welcomeMessage,
            status: 'success',
          });
        }
      }}
    />
  );

  return (
    <Layout>
      <TopNavigation
        title={i18n.onboarding.bikeDimensions}
        alignment="center"
        subtitle={i18n.onboarding.bikeDimensionsSubtitle}
        style={styles.topNavigation}
        accessoryRight={renderCheckAction}
      />
      <Divider style={styles.topNavigation} />
      <Layout style={styles.container}>
        <Layout style={styles.inputs}>
          <Text appearance="hint">{i18n.onboarding.bikeWidth}</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.TextInputStyle}
            placeholder={i18n.onboarding.widthInMillimeters}
            keyboardType={'numeric'}
            value={`${width}cm`}
            placeholderTextColor="#8F9BB3"
            onChangeText={(value) => {
              if (value.length > 2) {
                setWidth(parseInt([...value].filter(Number).join('')));
              } else {
                setWidth(0);
              }
            }}
          />
          <Text appearance="hint">{i18n.onboarding.bikeLength}</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.TextInputStyle}
            placeholder={i18n.onboarding.lengthInMillimeters}
            placeholderTextColor="#8F9BB3"
            keyboardType={'numeric'}
            value={`${length}cm`}
            onChangeText={(value) => {
              if (value.length > 2) {
                setLength(parseInt([...value].filter(Number).join('')));
              } else {
                setLength(0);
              }
            }}
          />
        </Layout>
        <View style={styles.icon}>
          <BikeIcon width={300} height={250} />
        </View>
        <Text style={{flex: 1}} appearance="hint">
          {i18n.onboarding.weEstimatedYourBikeDimensions}
        </Text>
      </Layout>
    </Layout>
  );
};
