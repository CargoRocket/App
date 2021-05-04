import {Divider, Icon, Text, Layout, Card} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import AboutHtml from '../../res/about.js';
import PrivacyPolicyHtml from '../../res/privacyPolicy';
import {UiContext} from '../../context';

const styles = {
  settingsEntry: {
    padding: 0,
    borderRadius: 0,
    borderColor: 'transparent',
  },
  settingsEntryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    marginRight: 20,
  },
};

export const SettingsView = ({navigation}) => {
  const {
    bikeSettingsShown: [isBikeSettingsShown, setBikeSettingsShown],
  } = React.useContext(UiContext);

  const SettingsEntry = (icon, title, subtitle, link, props = {}) => (
    <Card
      style={styles.settingsEntry}
      onPress={() => navigation.navigate(link, props)}>
      <Layout style={styles.settingsEntryRow}>
        <Icon
          style={styles.icons}
          name={icon}
          height={20}
          width={20}
          fill="#818888"
        />
        <Layout>
          <Text category="h6">{title}</Text>
          <Text appearance="hint">{subtitle}</Text>
        </Layout>
      </Layout>
    </Card>
  );

  const BikeSettings = (icon, title, subtitle) => (
    <Card
      style={styles.settingsEntry}
      onPress={() => {
        setBikeSettingsShown(true);
        // setOnBoarded();
        // navigation.navigate('InputBikeSize');
      }}>
      <Layout style={styles.settingsEntryRow}>
        <Icon
          style={styles.icons}
          name={icon}
          height={20}
          width={20}
          fill="#818888"
        />
        <Layout>
          <Text category="h6">{title}</Text>
          <Text appearance="hint">{subtitle}</Text>
        </Layout>
      </Layout>
    </Card>
  );

  return (
    <SafeAreaView>
      <ScrollView>
        {SettingsEntry(
          'message-circle-outline',
          'Feedback',
          'subtitle',
          'Feedback',
        )}
        <Divider />
        {SettingsEntry(
          'globe-outline',
          'Project Website',
          'subtitle',
          'ProjectWebView',
          {uri: 'https://cargorocket.de'},
        )}
        <Divider />
        {BikeSettings('options-2-outline', 'Bike Settings', 'subtitle')}
        <Divider />
        {SettingsEntry('at-outline', 'About', 'subtitle', 'ProjectWebView', {
          html: AboutHtml.html,
        })}
        <Divider />
        {SettingsEntry(
          'info-outline',
          'Privacy Policy',
          'subtitle',
          'ProjectWebView',
          {
            html: PrivacyPolicyHtml.html,
          },
        )}
        <Divider />
      </ScrollView>
    </SafeAreaView>
  );
};
