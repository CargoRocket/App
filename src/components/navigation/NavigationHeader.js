import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Layout,
  Text,
  Icon,
  Button,
  Divider,
  Spinner,
} from '@ui-kitten/components';

const styles = StyleSheet.create({
  topBox: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 80,
    margin: 10,
    width: '90%',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(143, 155, 179, 0.24)',
  },
  divider: {
    height: '100%',
    width: 1,
  },
  message: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontWeight: 'bold',
  },
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: {
    width: 30,
  },
});

export const NavigationHeader = ({
  navigation,
  rerouting,
  legs,
  currentStepId,
}) => {
  const directionIcon = () => {
    const directionIcons = {
      'slight right': 'diagonal-arrow-right-up-outline',
      'slight left': 'diagonal-arrow-left-up-outline',
      right: 'corner-up-right-outline',
      left: 'corner-up-left-outline',
      'sharp right': 'arrow-forward-outline',
      'sharp left': 'arrow-back-outline',
      straight: 'arrow-upward-outline',
    };
    const icon =
      directionIcons[
        legs[0].steps[currentStepId].bannerInstructions[0].primary.modifier
      ];

    if (!icon) {
      return 'move-outline';
    }
    return icon;
  };

  const closeIcon = (props) => <Icon {...props} name="close-outline" />;

  return (
    <Layout style={styles.topBox} level="1">
      <Button
        style={styles.close}
        appearance="ghost"
        accessoryRight={closeIcon}
        onPress={() => navigation.goBack()}
      />
      <Divider style={styles.divider} />
      <View style={styles.message}>
        {rerouting ? (
          <Text style={styles.messageText}>Rerouting...</Text>
        ) : (
          <Text style={styles.messageText}>
            {legs[0].steps[currentStepId].bannerInstructions[0].primary.text}
          </Text>
        )}
      </View>
      <Divider style={styles.divider} />
      {rerouting ? (
        <View style={styles.spinner} height={'100%'} width={40}>
          <Spinner />
        </View>
      ) : (
        <Icon
          style={styles.direction}
          name={directionIcon()}
          height={'100%'}
          width={40}
          fill="#000"
        />
      )}
    </Layout>
  );
};
