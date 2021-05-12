import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text, Icon, Modal, Button, Input} from '@ui-kitten/components';
import {UiContext, LanguageContext} from '../../context';
import {cargorocketAPIKey} from '../../res/config';
import theme from '../../res/custom-theme.json';

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
    maxHeight: '100%',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonGroup: {
    flexDirection: 'row',
    borderRadius: 5,
  },
  button: {
    borderRadius: 0,
    flex: 1,
  },
  buttonLeft: {
    borderTopLeftRadius: 5,
  },
  buttonRight: {
    borderTopRightRadius: 5,
  },
  icon: {
    height: 40,
    width: 40,
  },
  ratingTitle: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  messageInputContainer: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  messageInput: {
    height: 120,
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

export const RouteFeedbackPopup = ({
  currentLocation,
  feedbackShown,
  setFeedbackShown,
}) => {
  const StarIcon = (props) => <Icon {...props} name="star" />;
  const [message, setMessage] = React.useState('');
  const [rating, setRating] = React.useState(1);
  const {
    popupMessage: [popupMessage, setPopupMessage],
  } = React.useContext(UiContext);
  const i18n = React.useContext(LanguageContext);

  const sendFeedback = () => {
    fetch(`https://api.cargorocket.de/mail?key=${cargorocketAPIKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: JSON.stringify({
          message,
          rating,
          currentLocation,
        }),
        type: 'APP Route-Feedback',
      }),
    })
      .then(() => {
        setPopupMessage({
          title: i18n.modals.feedbackSendTitle,
          message: i18n.modals.feedbackSendMessage,
          status: 'info',
        });
        setMessage('');
        setFeedbackShown(false);
      })
      .catch((error) => {
        console.error(error);
        setFeedbackShown(false);
      });
  };

  return (
    <Modal
      visible={feedbackShown}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => {
        setFeedbackShown(false);
      }}>
      <Card disabled={true} style={styles.message}>
        <Icon
          fill={theme['color-primary-500']}
          style={styles.icon}
          name="pin-outline"
        />
        <Text category="h4">
          {i18n.routeFeedback.howBikeFriendlyIsTheWayRoute}
        </Text>
        <Text appearance="hint">{i18n.routeFeedback.areThereOpsticals}</Text>
        <Text style={styles.ratingTitle}>
          {i18n.routeFeedback.howWouldYouRate}
        </Text>
        <View style={styles.buttonGroup}>
          <Button
            style={{...styles.button, ...styles.buttonLeft}}
            accessoryLeft={StarIcon}
            onPress={() => setRating(1)}
          />
          <Button
            style={styles.button}
            status={rating >= 2 ? 'primary' : 'basic'}
            onPress={() => setRating(2)}
            accessoryLeft={StarIcon}
          />
          <Button
            style={styles.button}
            status={rating >= 3 ? 'primary' : 'basic'}
            onPress={() => setRating(3)}
            accessoryLeft={StarIcon}
          />
          <Button
            style={styles.button}
            status={rating >= 4 ? 'primary' : 'basic'}
            onPress={() => setRating(4)}
            accessoryLeft={StarIcon}
          />
          <Button
            style={{...styles.button, ...styles.buttonRight}}
            status={rating >= 5 ? 'primary' : 'basic'}
            onPress={() => setRating(5)}
            accessoryLeft={StarIcon}
          />
        </View>
        <Input
          multiline={true}
          style={styles.messageInputContainer}
          textStyle={styles.messageInput}
          placeholder={i18n.routeFeedback.whyDoYouRate}
          value={message}
          onChangeText={setMessage}
        />
        <Button onPress={sendFeedback}>{i18n.routeFeedback.send}</Button>
      </Card>
    </Modal>
  );
};
