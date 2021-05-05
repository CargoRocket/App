import {Button, Input, Layout} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView} from 'react-native';
import Logo from '../../res/images/logo.svg';
import {LanguageContext} from '../../context';

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
  },
  messageInput: {
    minHeight: 200,
  },
};

export const FeedbackView = () => {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const i18n = React.useContext(LanguageContext);

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
        <Button>{i18n.settings.send}</Button>
      </Layout>
    </SafeAreaView>
  );
};
