import React from 'react';
import {Card, Spinner} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {LocationSelect} from './LocationSelection';
import {RoutingContext, LanguageContext, UiContext} from '../../src/context';
import {accessToken, cargorocketAPIKey} from '../res/config';
import {deviceLanguage} from '../helpers/LanguageProvider';

export const RoutingInput = ({navigation}) => {
  const {
    destination: [destination, setDestination],
    start: [start, setStart],
    routes: [routes, setRoutes],
  } = React.useContext(RoutingContext);
  const [loading, setLoading] = React.useState(false);
  const i18n = React.useContext(LanguageContext);
  const {
    popupMessage: [popupMessage, setPopupMessage],
  } = React.useContext(UiContext);
  let lastAbortController = React.useRef(null);

  React.useEffect(() => {
    if (start && destination) {
      setLoading(true);
      setRoutes(null);
      if (lastAbortController.current) {
        lastAbortController.current.abort();
      }
      lastAbortController.current = new window.AbortController();
      fetch(
        `https://api.cargorocket.de/v1/routes?from=[${start.coordinates[1]},${start.coordinates[0]}]&to=[${destination.coordinates[1]},${destination.coordinates[0]}]&access_token=${accessToken}&key=${cargorocketAPIKey}&format=mapbox&lang=${deviceLanguage.slice(0,2)}`,
        {signal: lastAbortController.current.signal},
      )
        .then((rawData) => rawData.json())
        .then((routesResponse) => {
          if (routesResponse.name && routesResponse.name === 'Error') {
            setLoading(false);
            setPopupMessage({
              title: i18n.modals.errorFindingRouteTitle,
              message: i18n.modals.errorFindingRouteTitleMessage,
              status: 'error',
            });
            return;
          }
          setLoading(false);
          setRoutes([
            {
              ...routesResponse.find((route) => route.profile.name === 'cargobike'),
              name: i18n.navigation.cargoBikeRoute,
              description: i18n.navigation.cargoBikeRouteDescription,
            },
            {
              ...routesResponse.find((route) => route.profile.name === 'bike'),
              name: i18n.navigation.classicBikeRoute,
              description: i18n.navigation.classicBikeRouteDescription,
            },
          ]);
        })
        .catch((error) => {
          console.log(error);
          setPopupMessage({
            title: i18n.modals.errorFindingRouteTitle,
            message: i18n.modals.errorFindingRouteTitleMessage,
            status: 'error',
          });
          setLoading(false);
        });
    } else {
      setRoutes(null);
    }
  }, [start, destination, setRoutes]);

  const styles = StyleSheet.create({
    navigationOverview: {
      position: 'relative',
      width: '100%',
    },
    loader: {
      position: 'absolute',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      bottom: -60,
      width: 50,
      height: 50,
      borderRadius: 50,
    },
    routingMenu: {
      backgroundColor: '#ffffff',
      borderRadius: 0,
    },
    title: {
      fontWeight: 'bold',
      color: '#00002288',
      textAlign: 'center',
      marginBottom: 5,
    },
  });

  return (
    <View style={styles.navigationOverview}>
      <Card style={styles.routingMenu}>
        <LocationSelect
          onChange={setStart}
          value={start}
          placeholder={i18n.navigation.start}
          liveLocation={true}
        />
        <LocationSelect
          onChange={setDestination}
          value={destination}
          placeholder={i18n.navigation.destination}
        />
      </Card>
      {loading ? (
        <Card style={styles.loader}>
          <Spinner />
        </Card>
      ) : null}
    </View>
  );
};
