import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import {Card, Text, Icon, Button, Layout} from '@ui-kitten/components';
import {LanguageContext} from '../../context';
import images from '../../res/images/projects';
import Logo from '../../res/images/icon_alt.svg';

const styles = StyleSheet.create({
  page: {
    //flex: 1,
  },
  container: {
    alignItems: 'center',
    margin: 20,
    paddingBottom: 50,
  },
  info: {
    padding: 20,
    width: '100%',
    margin: 20,
  },
  buttons: {
    marginBottom: 5,
    marginHorizontal: 10,
  },
  title: {
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
    paddingHorizontal: 0,
    paddingVertical: 0,
    maxWidth: 400,
    width: '100%',
  },
  banner: {
    flex: 0,
    margin: 0,
    width: '120%',
    height: 200,
    marginHorizontal: -24,
    marginVertical: -16,
  },
  links: {
    flexDirection: 'row',
  },
});

export const ProjectView = ({navigation}) => {
  const i18n = React.useContext(LanguageContext);
  const renderItemHeader = (headerProps, info) => (
    <View {...headerProps}>
      <Image style={styles.banner} source={images[info.item.image]} />
    </View>
  );

  const renderItemFooter = (footerProps, info) => (
    <Text {...footerProps}>{info.item.description}</Text>
  );

  const renderItem = (info) => (
    <Card
      status="primary"
      style={styles.item}
      header={(headerProps) => renderItemHeader(headerProps, info)}
      footer={(footerProps) => renderItemFooter(footerProps, info)}
      onPress={() => {
        navigation.navigate('ProjectWebView', {uri: info.item.uri});
      }}>
      <Text category="h5">{info.item.title}</Text>
    </Card>
  );

  const TwitterIcon = (props) => <Icon {...props} name="twitter-outline" />;
  const WebIcon = (props) => <Icon {...props} name="globe-outline" />;

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
        <Logo width={200} height={100} />
        <Text category="h2" style={styles.title}>
          {i18n.project.theProject}
        </Text>
        <Layout style={styles.info}>
          <Text appearance="hint">{i18n.project.description}</Text>
        </Layout>
        <View style={styles.links}>
          <Button
            style={styles.buttons}
            status="info"
            onPress={() => Linking.openURL('https://twitter.com/cargo_rocket')}
            accessoryLeft={TwitterIcon}>
            Twitter
          </Button>
          <Button
            style={styles.buttons}
            onPress={() => Linking.openURL('https://cargorocket.de')}
            accessoryLeft={WebIcon}>
            Website
          </Button>
        </View>
        {i18n.project.projects.map((item, index) => renderItem({item, index}))}
      </ScrollView>
    </SafeAreaView>
  );
};
