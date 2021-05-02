import {Button, Input, Layout} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView} from 'react-native';
import Logo from '../../res/images/logo.svg';

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

  return (
    <SafeAreaView style={styles.view}>
      <Logo height={120} width={200} />
      <Layout style={styles.container}>
        <Input
          placeholder="E-mail (Optional)"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          multiline={true}
          textStyle={styles.messageInput}
          placeholder="YOUR MESSAGE TO US. Feel free to provide us any thought you have about the project, cargobike-index, routing etc."
          value={message}
          onChangeText={setMessage}
        />
        <Button>Send</Button>
      </Layout>
    </SafeAreaView>
  );
};
