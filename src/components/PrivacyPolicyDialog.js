import React, {useState} from 'react';
import {StyleSheet, View, BackHandler} from 'react-native';
import {Button} from '@ui-kitten/components';
import Dialog from 'react-native-dialog';
import {LanguageContext} from '../context';
import {useFocusEffect} from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const PrivacyPolicy = ({navigation}) => {
  const [visible, setVisible] = useState(true);
  const i18n = React.useContext(LanguageContext);

  const handleDelete = () => {
    setVisible(false);
  };

  useFocusEffect(() => {
    setVisible(true);
  });

  return (
    <View style={styles.container}>
      <Dialog.Container visible={visible && navigation.dangerouslyGetState().index === 0}>
        <Dialog.Title>{i18n.privacyPolicy.title}</Dialog.Title>
        <Dialog.Description>{i18n.privacyPolicy.doYouAgree}</Dialog.Description>
        <Dialog.Button
          label={i18n.privacyPolicy.agb}
          onPress={() => {
            setVisible(false);
            navigation.navigate('ProjectWebView', {
              uri: i18n.privacyPolicy.agblink,
            });
          }}
        />
        <Dialog.Button
          label={i18n.privacyPolicy.privacyPolicy}
          onPress={() => {
            setVisible(false);
            navigation.navigate('ProjectWebView', {
              uri: i18n.privacyPolicy.privacylink,
            });
          }}
        />
        <Dialog.Button
          label={i18n.privacyPolicy.agree}
          onPress={handleDelete}
        />
      </Dialog.Container>
    </View>
  );
};
