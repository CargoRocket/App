import {
  List,
  ListItem,
  Layout,
  Button,
  Icon,
  Input,
  Text,
  Card,
  Divider,
  TopNavigation,
} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView} from 'react-native';
import {default as theme} from '../res/custom-theme.json';
import CenterIcon from '../res/images/icons/crosshairs-gps.svg';
import {RoutingContext, LanguageContext, UiContext} from '../context';
import {TouchableWithoutFeedback} from 'react-native';
import {accessToken} from '../res/config';
import {ScrollView} from 'react-native-gesture-handler';
import {setRoutePoint} from '../helpers/routePoints';
import RNLocation from 'react-native-location';

const styles = {
  routePoint: {},
  routePointList: {
    padding: 10,
  },
  routePointInput: {
    width: '100%',
    height: '100%',
    marginTop: -15,
  },
};

export const RouteSelection = ({navigation}) => {
  const [selectedRoutePoint, setSelectedRoutePoint] = React.useState(0);
  const [suggestions, setSuggestions] = React.useState([]);
  const i18n = React.useContext(LanguageContext);
  const {
    popupMessage: [popupMessage, setPopupMessage],
  } = React.useContext(UiContext);

  const {
    routePoints: [routePoints, setRoutePoints],
  } = React.useContext(RoutingContext);

  const onChangeText = (query) => {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${accessToken}&country=DE`,
    )
      .then((rawData) => rawData.json())
      .then((response) => {
        if (response.features && response.features.length > 0) {
          setSuggestions(response.features);
        } else {
          setSuggestions([]);
        }
      });
  };

  const selectCurrentLocation = () => {
    console.log('location');
    RNLocation.configure({
      distanceFilter: 0,
    });
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    });
    RNLocation.getLatestLocation({timeout: 1000})
      .then((latestLocation) => {
        setRoutePoints(
          setRoutePoint(
            routePoints,
            {
              name: i18n.navigation.yourLocation,
              coordinates: [latestLocation.longitude, latestLocation.latitude],
            },
            selectedRoutePoint,
          ),
        );
      })
      .catch((error) => {
        console.log('locationError', error);
        setPopupMessage({
          title: i18n.modals.locationErrorTitle,
          message: i18n.modals.locationErrorMessage,
          status: 'error',
        });
      });
  };

  const clearInput = () => {
    console.log('clear');
    setRoutePoints(
      setRoutePoint(
        routePoints,
        {
          name: '',
          coordinates: null,
        },
        selectedRoutePoint,
      ),
    );
  };

  const renderClear = (props) => (
    <TouchableWithoutFeedback onPress={clearInput}>
      <Icon {...props} name="close" />
    </TouchableWithoutFeedback>
  );

  const renderRoutePoint = (element) => {
    return (
      <ListItem
        style={styles.routePoint}
        key={`${element.index}-route-point-input`}
        accessoryRight={renderLocationIcon}>
        <Input
          key={`${element.index}-${JSON.stringify(routePoints)}`}
          style={styles.routePointInput}
          defaultValue={element.item.name}
          autoFocus={element.index === selectedRoutePoint}
          accessoryRight={element.index === selectedRoutePoint ? renderClear : null}
          placeholder={
            element.index === 0
              ? i18n.navigation.start
              : element.index === routePoints.length - 1
              ? i18n.navigation.destination
              : i18n.navigation.via
          }
          onFocus={() => {
            setSuggestions([]);
            setSelectedRoutePoint(element.index);
          }}
          onChangeText={onChangeText}
        />
      </ListItem>
    );
  };

  const renderIconMarker = (props) => <Icon {...props} name="pin-outline" />;

  const renderSuggestionItem = (suggestion, index) => {
    return (
      <ListItem
        key={`${index}-suggestion-input`}
        title={suggestion.place_name}
        accessoryLeft={renderIconMarker}
        onPress={() => {
          setRoutePoints(
            setRoutePoint(
              routePoints,
              {
                name: suggestion.place_name,
                coordinates: suggestion.geometry.coordinates,
              },
              selectedRoutePoint,
            ),
          );
          if (selectedRoutePoint < routePoints.length) {
            setSelectedRoutePoint(selectedRoutePoint + 1);
            setSuggestions([]);
          }
        }}
      />
    );
  };

  const renderMapIcon = (props) => <Icon {...props} name="map-outline" />;

  const renderLocationIcon = (props) => (
    <CenterIcon {...props} fill={theme['color-info-500']} />
  );

  return (
    <SafeAreaView style={styles.view}>
      <TopNavigation
        style={styles.topNavigation}
        accessoryRight={() => (
          <Button onPress={() => navigation.goBack()} appearance="ghost">
            Start
          </Button>
        )}
      />
      <Divider />
      <Layout level="2">
        <List style={styles.routePointList} data={routePoints} renderItem={renderRoutePoint} />
      </Layout>

      <ScrollView style={styles.container}>
        {suggestions.map((suggestion, index) =>
          renderSuggestionItem(suggestion, index),
        )}
        <ListItem
          key={`current-suggestion-input`}
          title="Your current Location"
          accessoryLeft={renderLocationIcon}
          onPress={selectCurrentLocation}
        />
        {/* <ListItem
          key={`map-suggestion-input`}
          title="Choose on map"
          accessoryLeft={renderMapIcon}
          onPress={() => console.log('map')}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
};
