import {Button, Input, Layout, Spinner} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView} from 'react-native';
import Logo from '../../res/images/logo.svg';
import {LanguageContext, UiContext} from '../../context';
import {cargorocketAPIKey} from '../../res/config';

const styles = {
  view: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 10,
    borderRadius: 10,
    width: '95%',
    alignItems: 'center',
  },
  messageInput: {
    minHeight: 200,
  },
};

export const FeedbackView = ({navigation}) => {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const {
    popupMessage: [popupMessage, setPopupMessage],
  } = React.useContext(UiContext);
  const i18n = React.useContext(LanguageContext);

  const sendFeedback = () => {
    setLoading(true);
    fetch(`https://api.cargorocket.de/mail?key=${cargorocketAPIKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        type: 'APP Feedback',
        email,
      }),
    })
      .then(() => {
        setPopupMessage({
          title: i18n.modals.feedbackSendTitle,
          message: i18n.modals.feedbackSendMessage,
          status: 'info',
        });
        navigation.goBack();
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.view}>
      <Logo height={120} width={200} />
      <Layout style={styles.container}>
        <Input
          placeholder={i18n.settings.email}
          value={email}
          onChangeText={setEmail}
        />
        <Input
          multiline={true}
          textStyle={styles.messageInput}
          placeholder={i18n.settings.yourMessageToUs}
          value={message}
          onChangeText={setMessage}
        />
        {loading ? (
          <Spinner />
        ) : (
          <Button onPress={sendFeedback}>{i18n.settings.send}</Button>
        )}
      </Layout>
    </SafeAreaView>
  );
};
