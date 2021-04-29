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
import {SettingsContext} from '../../context';
import theme from '../../res/custom-theme.json';

export const SelectUse = ({navigation}) => {
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
    use: [use, setUse],
  } = React.useContext(SettingsContext);

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
        title="Your Usecase"
        alignment="center"
        subtitle="What do you use your bike mainly for?"
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
        <Text>Private</Text>
      </Card>
      <Card
        style={
          use === 'commercial'
            ? {...styles.option, ...styles.optionSelected}
            : styles.option
        }
        onPress={() => setUse('commercial')}>
        <Text>Commercial Delivery</Text>
      </Card>
    </Layout>
  );
};
