import {Divider, Icon, Text, Layout, Card} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';

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

const SettingsEntry = (icon, title, subtitle, link) => (
  <Card style={styles.settingsEntry}>
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

export const SettingsView = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        {SettingsEntry('message-circle-outline', 'Feedback', 'subtitle', '')}
        <Divider />
        {SettingsEntry('globe-outline', 'Project Website', 'subtitle', '')}
        <Divider />
        {SettingsEntry('options-2-outline', 'Bike Settings', 'subtitle', '')}
        <Divider />
        {SettingsEntry('at-outline', 'About', 'subtitle', '')}
        <Divider />
        {SettingsEntry('info-outline', 'Privacy Policy', 'subtitle', '')}
        <Divider />
      </ScrollView>
    </SafeAreaView>
  );
};
