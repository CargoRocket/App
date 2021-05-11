import {Divider, Icon, Text, Layout, Card} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import AboutHtml from '../../res/about.js';
import PrivacyPolicyHtml from '../../res/privacyPolicy';
import {UiContext, LanguageContext} from '../../context';

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
  const i18n = React.useContext(LanguageContext);

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
          i18n.settings.feedback,
          i18n.settings.feedbackSubtitle,
          'Feedback',
        )}
        <Divider />
        {SettingsEntry(
          'globe-outline',
          i18n.settings.projectWebsite,
          i18n.settings.projectWebsiteSubtitle,
          'ProjectWebView',
          {uri: 'https://cargorocket.de'},
        )}
        <Divider />
        {BikeSettings(
          'options-2-outline',
          i18n.settings.bikeSettings,
          i18n.settings.bikeSettingsSubtitle,
        )}
        <Divider />
        {SettingsEntry(
          'at-outline',
          i18n.settings.about,
          i18n.settings.aboutSubtitle,
          'ProjectWebView',
          {html: AboutHtml.html},
        )}
        <Divider />
        {SettingsEntry(
          'info-outline',
          i18n.settings.privacyPolicy,
          i18n.settings.privacyPolicySubtitle,
          'ProjectWebView',
          {
            uri: 'https://cargorocket.de/app_privacy_policy',
          },
        )}
        <Divider />
      </ScrollView>
    </SafeAreaView>
  );
};
