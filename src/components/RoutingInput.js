import React from 'react';
import {Card, Button, Icon, Text} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {LocationSelect} from './LocationSelection';
import {Map} from './Map';

export const RoutingInput = () => {
  const [start, setStart] = React.useState(null);
  const [destination, setDestination] = React.useState(null);

  const shakeIconRef = React.useRef();

  const ChevronIcon = (props) => (
    <Icon
      {...props}
      name="chevron-right-outline"
      ref={shakeIconRef}
      animation="shake"
    />
  );

  const styles = StyleSheet.create({
    routingMenu: {
      position: 'absolute',
      top: 4,
      left: '2.5%',
      width: '95%',
    },
  });

  return (
    <View>
      <Card style={styles.routingMenu}>
        <Text category="h5">Navigation</Text>
        <LocationSelect onChange={setStart} placeholder="Start" />
        <LocationSelect onChange={setDestination} placeholder="Destination" />
        <Button
          accessoryLeft={ChevronIcon}
          onPress={() => {
            shakeIconRef.current.startAnimation();
            // Navigate
          }}>
          Navigate
        </Button>
      </Card>
      <Map />
    </View>
  );
};
