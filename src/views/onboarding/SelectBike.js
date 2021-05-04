import React from 'react';
import {
  TopNavigationAction,
  Layout,
  TopNavigation,
  Icon,
  Divider,
  Card,
} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import {SettingsContext} from '../../context';
import theme from '../../res/custom-theme.json';

// Icons
import Lieferbike from '../../res/images/lieferbike.svg';
import LongJohn from '../../res/images/longjohn.svg';
import LongTail from '../../res/images/longtail.svg';
import Schwertransporter from '../../res/images/schwertransporter.svg';
import Trike from '../../res/images/trike.svg';

export const SelectBike = ({navigation}) => {
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

  const {
    bikeType: [bikeType, setBikeType],
    bikeLength: [length, setLength],
    bikeWidth: [width, setWidth],
  } = React.useContext(SettingsContext);

  const checkMarkIcon = (props) =>
    bikeType ? (
      <Icon {...props} fill={theme['color-primary-500']} name="checkmark" />
    ) : null;

  const renderCheckAction = () => (
    <TopNavigationAction
      icon={checkMarkIcon}
      onPress={() => {
        if (bikeType) {
          navigation.navigate('InputBikeSize');
        }
      }}
    />
  );

  return (
    <Layout style={{flex: 1}}>
      <TopNavigation
        title="Bike Type"
        alignment="center"
        subtitle="How does your bike look like?"
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
          if (!width) {
            setWidth(0.7);
            setLength(1.7);
          }
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
          if (!width) {
            setWidth(0.8);
            setLength(2.0);
          }
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
          if (!width) {
            setWidth(0.8);
            setLength(2.0);
          }
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
          if (!width) {
            setWidth(1.2);
            setLength(2.0);
          }
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
          if (!width) {
            setWidth(1.0);
            setLength(2.0);
          }
        }}>
        <Trike height={100} width={100} />
      </Card>
    </Layout>
  );
};
