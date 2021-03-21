import React from 'react';
import {SafeAreaView, StyleSheet, View, Image} from 'react-native';
import {Card, List, Text} from '@ui-kitten/components';
import projects from '../../res/projects.json';
import images from '../../res/images/projects';

export const ProjectView = ({navigation}) => {
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
        navigation.navigate('ProjectWebView', {url: info.item.url});
      }}>
      <Text category="h5">
        {info.item.title} {info.index + 1}
      </Text>
    </Card>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <List
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={projects.projects}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  banner: {
    flex: 0,
    margin: 0,
    width: 400,
    height: 200,
    marginHorizontal: -24,
    marginVertical: -16,
  },
});
