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
import {SafeAreaView, View} from 'react-native';
import {default as theme} from '../res/custom-theme.json';
import CenterIcon from '../res/images/icons/crosshairs-gps.svg';
import {RoutingContext, LanguageContext, UiContext} from '../context';
import {TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import {accessToken} from '../res/config';
import {ScrollView} from 'react-native-gesture-handler';
import {
  addRoutePoint,
  setRoutePoint,
  cleanUnusedVias,
  removeRoutePoint,
} from '../helpers/routePoints';
import RNLocation from 'react-native-location';
import {MapLocationSelect} from '../components/MapLocationSelect';
import Base from '../helpers/base64';

const styles = {
  view: {
    flex: 1,
  },
  routePoint: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  routePointList: {
    padding: 10,
  },
  routePointInput: {
    flex: 1,
    height: '100%',
  },
  addVia: {
    borderRadius: 30,
    marginLeft: 15,
    width: 30,
    height: 30,
    display: 'flex',
    backgroundColor: '#EDF1F7',
    borderWidth: 2,
    borderColor: '#E4E9F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addViaText: {
    height: 20,
    width: 20,
  },
  removeVia: {
    marginRight: 5,
    width: 30,
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeViaText: {
    height: 20,
    width: 20,
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
    routePointStorage: [routePointStorage, setRoutePointStorage],
    routes: [routes, setRoutes],
  } = React.useContext(RoutingContext);

  const onChangeText = (query) => {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${Base.atob(accessToken)}&country=DE`,
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
    RNLocation.configure({
      distanceFilter: 0,
      desiredAccuracy: {
        ios: 'bestForNavigation',
        android: 'highAccuracy',
      },
    });
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'coarse',
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

  const addEmptyPoint = (index) => {
    setRoutePoints(
      addRoutePoint(
        routePoints,
        {
          name: '',
          coordinates: null,
        },
        index,
      ),
    );
  };

  const renderRoutePoint = (element) => {
    return (
      <View
        style={styles.routePoint}
        key={`${element.index}-route-point-input`}>
        {element.index != 0 && element.index != routePoints.length - 1 ? (
          <TouchableOpacity
            style={styles.removeVia}
            onPress={() =>
              setRoutePoints(removeRoutePoint(routePoints, element.index))
            }>
            <Icon
              style={styles.removeViaText}
              fill="#2E3A59"
              name="trash-outline"
            />
          </TouchableOpacity>
        ) : null}
        <Input
          key={`${element.index}-${JSON.stringify(routePoints)}`}
          style={styles.routePointInput}
          defaultValue={element.item.name}
          autoFocus={!mapSelectEnabled && element.index === selectedRoutePoint}
          accessoryRight={
            element.index === selectedRoutePoint ? renderClear : null
          }
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
            setRoutePoints(cleanUnusedVias(routePoints, selectedRoutePoint));
          }}
          onChangeText={onChangeText}
        />
        {element.index < routePoints.length - 1 ? (
          <TouchableOpacity
            style={styles.addVia}
            onPress={() => addEmptyPoint(element.index + 1)}>
            <Icon
              style={styles.addViaText}
              fill="#2E3A59"
              name="plus-outline"
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const renderIconMarker = (props) => <Icon {...props} name="pin-outline" />;

  const renderSuggestionItem = (name, coordinates, index) => {
    return (
      <ListItem
        key={`${index}-suggestion-input`}
        title={name}
        accessoryLeft={renderIconMarker}
        onPress={() => {
          setRoutePoints(
            setRoutePoint(
              routePoints,
              {
                name,
                coordinates,
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

  const goBack = () => {
    navigation.goBack();
    // Update Route Point Storage
    const routePointStorageList = [...routePointStorage];
    routePoints.forEach((routePoint) => {
      // ToDo Maybe replace with regex later
      if (
        routePoint.name !== i18n.navigation.yourLocation &&
        routePoint.name[7] !== ',' &&
        routePoint.coordinates
      ) {
        const elementIndex = routePointStorageList.findIndex(
          (element) => element === routePoint,
        );
        if (elementIndex !== -1) {
          routePointStorageList.splice(elementIndex, 1);
        }
        if (routePointStorageList.length > 5) {
          routePointStorageList.pop();
        }
        routePointStorageList.unshift(routePoint);
      }
    });
    setRoutePointStorage(routePointStorageList);
    console.log(routePointStorageList);
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
          <Button onPress={goBack} appearance="ghost">
            Start
          </Button>
        )}
      />
      <Divider />
      <Layout level="2">
        <List
          style={styles.routePointList}
          data={routePoints}
          renderItem={renderRoutePoint}
        />
      </Layout>

      {mapSelectEnabled ? (
        <Layout style={styles.view}>
          <ListItem
            key={`current-suggestion-input`}
            title={i18n.navigation.backToListView}
            accessoryLeft={renderListIcon}
            onPress={() => setMapSelectEnabled(false)}
          />
          <MapLocationSelect
            point={routePoints[selectedRoutePoint]}
            onChange={updateRoutePoint}
          />
        </Layout>
      ) : (
        <ScrollView style={styles.container}>
          {suggestions.length > 0
            ? suggestions.map((suggestion, index) =>
                renderSuggestionItem(
                  suggestion.place_name,
                  suggestion.geometry.coordinates,
                  index,
                ),
              )
            : routePointStorage.map((suggestion, index) =>
                renderSuggestionItem(
                  suggestion.name,
                  suggestion.coordinates,
                  index,
                ),
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
