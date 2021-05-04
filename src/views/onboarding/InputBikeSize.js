import React from 'react';
import {
  TopNavigationAction,
  Layout,
  TopNavigation,
  Icon,
  Divider,
  Text,
} from '@ui-kitten/components';
import {StyleSheet, TextInput} from 'react-native';
import {SettingsContext, LanguageContext, UiContext} from '../../context';
import theme from '../../res/custom-theme.json';
import BikeIcon from '../../res/images/bike_settings.svg';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    padding: 20,
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
    length && width ? (
      <Icon {...props} fill={theme['color-primary-500']} name="checkmark" />
    ) : null;

  const renderCheckAction = () => (
    <TopNavigationAction
      icon={checkMarkIcon}
      onPress={() => {
        if (length && width) {
          if (isBikeSettingsShown) {
            setBikeSettingsShown(false);
            setPopupMessage({
              message: 'Updated',
              status: 'success',
              title: 'test',
            });
            return;
          }
          setOnBoarded(true);
          setPopupMessage({
            message: 'test',
            status: 'success',
            title: 'test',
          });
        }
      }}
    />
  );

  return (
    <Layout>
      <TopNavigation
        title="Bike Dimensions"
        alignment="center"
        subtitle="subtitle"
        style={styles.topNavigation}
        accessoryRight={renderCheckAction}
      />
      <Divider style={styles.topNavigation} />
      <Layout style={styles.container}>
        <Layout style={styles.inputs}>
          <Text appearance="hint">Bike width (W):</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.TextInputStyle}
            placeholder="Width in millimeters"
            keyboardType={'numeric'}
            value={`${width}mm`}
            placeholderTextColor="#8F9BB3"
            onChangeText={(value) => {
              if (value.length > 2) {
                setWidth(parseInt([...value].filter(Number).join('')));
              } else {
                setWidth(0);
              }
            }}
          />
          <Text appearance="hint">Bike length (L):</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.TextInputStyle}
            placeholder="Length in millimeters"
            placeholderTextColor="#8F9BB3"
            keyboardType={'numeric'}
            value={`${length}mm`}
            onChangeText={(value) => {
              if (value.length > 2) {
                setLength(parseInt([...value].filter(Number).join('')));
              } else {
                setLength(0);
              }
            }}
          />
        </Layout>
        <BikeIcon width={300} height={250} style={styles.icon} />
        <Text appearance="hint">{i18n.weEstimatedYourBikeDimensions}</Text>
      </Layout>
    </Layout>
  );
};
