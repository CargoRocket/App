import React from 'react';
import {Card, Button, Icon, Text} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import {LocationSelect} from './LocationSelection';

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
      top: 0,
      width: '100%',
    },
  });

  return (
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
  );
};
