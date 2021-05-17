import React from 'react';
import {
  TopNavigationAction,
  Layout,
  TopNavigation,
  Icon,
  Divider,
  Card,
} from '@ui-kitten/components';
import {StyleSheet, SafeAreaView} from 'react-native';
import {SettingsContext, LanguageContext} from '../../context';
import theme from '../../res/custom-theme.json';

// Icons
import Lieferbike from '../../res/images/lieferbike.svg';
import LongJohn from '../../res/images/longjohn.svg';
import LongTail from '../../res/images/longtail.svg';
import Schwertransporter from '../../res/images/schwertransporter.svg';
import Trike from '../../res/images/trike.svg';

const styles = StyleSheet.create({
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  actionButton: {
    backgroundColor: theme['color-primary-500'],
    padding: 10,
    borderRadius: 50,
  },
  optionSelected: {
    textAlign: 'center',
    borderColor: theme['color-primary-500'],
    borderWidth: 2,
  },
});

export const SelectBike = ({navigation}) => {
  const i18n = React.useContext(LanguageContext);
  const {
    bikeType: [bikeType, setBikeType],
    bikeLength: [length, setLength],
    bikeWidth: [width, setWidth],
  } = React.useContext(SettingsContext);

  const checkMarkIcon = (props) =>
    bikeType ? <Icon {...props} fill="#fff" name="checkmark" /> : null;

  const renderCheckAction = () => (
    <TopNavigationAction
      icon={checkMarkIcon}
      style={bikeType ? styles.actionButton : ''}
      onPress={() => {
        if (bikeType) {
          navigation.navigate('InputBikeSize');
        }
      }}
    />
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        title={i18n.onboarding.bikeType}
        alignment="center"
        subtitle={i18n.onboarding.howDoesYourBikeLookLike}
        accessoryRight={renderCheckAction}
      />
      <Divider />
      <Card
        style={
          bikeType === 'delivery'
            ? {...styles.option, ...styles.optionSelected}
            : styles.option
        }
        onPress={() => {
          setBikeType('delivery');
          setWidth(70);
          setLength(170);
        }}>
        <Lieferbike height={100} width={100} />
      </Card>
      <Card
        style={
          bikeType === 'longjohn'
            ? {...styles.option, ...styles.optionSelected}
            : styles.option
        }
        onPress={() => {
          setBikeType('longjohn');
          setWidth(80);
          setLength(200);
        }}>
        <LongJohn height={100} width={100} />
      </Card>
      <Card
        style={
          bikeType === 'longtail'
            ? {...styles.option, ...styles.optionSelected}
            : styles.option
        }
        onPress={() => {
          setBikeType('longtail');
          setWidth(80);
          setLength(200);
        }}>
        <LongTail height={100} width={100} />
      </Card>
      <Card
        style={
          bikeType === 'heavy'
            ? {...styles.option, ...styles.optionSelected}
            : styles.option
        }
        onPress={() => {
          setBikeType('heavy');
          setWidth(120);
          setLength(200);
        }}>
        <Schwertransporter height={100} width={100} />
      </Card>
      <Card
        style={
          bikeType === 'trike'
            ? {...styles.option, ...styles.optionSelected}
            : styles.option
        }
        onPress={() => {
          setBikeType('trike');
          setWidth(100);
          setLength(200);
        }}>
        <Trike height={100} width={100} />
      </Card>
    </SafeAreaView>
  );
};
