import React from 'react';
import {Button, Layout, Text, Icon} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import Logo from '../res/images/logo.svg';

export const StartView = () => {
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
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      textAlign: 'center',
    },
    likeButton: {
      marginVertical: 16,
    },
  });

  return (
    <Layout style={styles.container}>
      <Logo width={200} height={100} />
      <Text style={styles.text} category="h1">
        Cargobike Routing App
      </Text>
      <Text style={styles.text} category="s1">
        Finding the best for you and your cargo-bike.
      </Text>
      <Text style={styles.text} appearance="hint">
        Intelligent obstacle avoidance based on community experience.
      </Text>
      <Button
        style={styles.likeButton}
        accessoryLeft={ChevronIcon}
        onPress={() => shakeIconRef.current.startAnimation()}>
        GO DRIVING
      </Button>
    </Layout>
  );
};
