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
import {MapLocationSelect} from '../components/MapLocationSelect';

const styles = {
  view: {
    flex: 1,
  },
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
  const [mapSelectEnabled, setMapSelectEnabled] = React.useState(false);
  const i18n = React.useContext(LanguageContext);
  const {
    popupMessage: [popupMessage, setPopupMessage],
  } = React.useContext(UiContext);

  const {
    routePoints: [routePoints, setRoutePoints],
    routes: [routes, setRoutes],
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

  const updateRoutePoint = (name, coordinates) => {
    setRoutes(null);
    setRoutePoints(
      setRoutePoint(routePoints, {name, coordinates}, selectedRoutePoint),
    );
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
        updateRoutePoint(i18n.navigation.yourLocation, [
          latestLocation.longitude,
          latestLocation.latitude,
        ]);
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
    updateRoutePoint('', null);
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
          autoFocus={!mapSelectEnabled && element.index === selectedRoutePoint}
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
            setMapSelectEnabled(false);
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

  const renderListIcon = (props) => <Icon {...props} name="list-outline" />;

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

      {mapSelectEnabled ? (
        <Layout style={styles.view}>
          <ListItem
            key={`current-suggestion-input`}
            title={i18n.navigation.backToListView}
            accessoryLeft={renderListIcon}
            onPress={() => setMapSelectEnabled(false)}
          />
          <MapLocationSelect onChange={updateRoutePoint} />
        </Layout>
      ) : (
        <ScrollView style={styles.container}>
          {suggestions.map((suggestion, index) =>
            renderSuggestionItem(suggestion, index),
          )}
          <ListItem
            key={`current-suggestion-input`}
            title={i18n.navigation.yourLocation}
            accessoryLeft={renderLocationIcon}
            onPress={selectCurrentLocation}
          />
          <ListItem
            key={`map-suggestion-input`}
            title={i18n.navigation.chooseOnMap}
            accessoryLeft={renderMapIcon}
            onPress={() => setMapSelectEnabled(true)}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
