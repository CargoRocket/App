import React from 'react';
import {StyleSheet} from 'react-native';
import {Card, Text, Icon, Modal} from '@ui-kitten/components';
import theme from '../res/custom-theme.json';
import {UiContext} from '../context';

export const MessagePopup = () => {
  const {
    popupMessage: [message, setMessage],
  } = React.useContext(UiContext);

  return (
    <Modal
      visible={message !== null}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => {
        setMessage(null);
      }}>
      {message !== null ? (
        <Card disabled={true} style={styles.message}>
          {message.type === 'info' ? (
            <Icon
              fill={theme['color-info-500']}
              style={styles.icon}
              name="alert-circle-outline"
            />
          ) : null}

          {message.type === 'error' ? (
            <Icon
              fill={theme['color-danger-500']}
              style={styles.icon}
              name="alert-triangle-outline"
            />
          ) : null}
          {message.type === 'success' ? (
            <Icon
              fill={theme['color-primary-500']}
              style={styles.icon}
              name="compass-outline"
            />
          ) : null}
          <Text style={styles.title} category="h3">
            {message.title}
          </Text>
          <Text>{message.message}</Text>
        </Card>
      ) : null}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  icon: {
    flex: 1,
    height: 40,
  },
  title: {
    textAlign: 'center',
    margin: 10,
  },
  message: {
    flex: 1,
    maxWidth: 300,
  },
});
