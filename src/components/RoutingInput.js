import React from 'react';
import {Card, Spinner} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {LocationSelect} from './LocationSelection';
import {RoutingContext, LanguageContext, UiContext} from '../../src/context';
import {accessToken, cargorocketAPIKey} from '../res/config';
import {deviceLanguage} from '../helpers/LanguageProvider';
import {setRoutePoint} from '../helpers/routePoints';

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

export const RoutingInput = ({navigation}) => {
  const {
    routePoints: [routePoints, setRoutePoints],
    routes: [routes, setRoutes],
  } = React.useContext(RoutingContext);
  const [loading, setLoading] = React.useState(false);
  const i18n = React.useContext(LanguageContext);
  const {
    popupMessage: [popupMessage, setPopupMessage],
  } = React.useContext(UiContext);
  let lastAbortController = React.useRef(null);

  // React.useEffect(() => {
  //   if (
  //     routePoints[0].coordinates &&
  //     routePoints[routePoints.length - 1].coordinates
  //   ) {
  //     setLoading(true);
  //     setRoutes(null);
  //     if (lastAbortController.current) {
  //       lastAbortController.current.abort();
  //     }
  //     lastAbortController.current = new window.AbortController();

  //     // Build url
  //     const endpointUrl = new URL('https://api.cargorocket.de/v1/routes');
  //     const start = [...routePoints[0].coordinates];
  //     endpointUrl.searchParams.append('from', JSON.stringify(start.reverse()));
  //     const destination = [...routePoints[routePoints.length - 1].coordinates];
  //     endpointUrl.searchParams.append(
  //       'to',
  //       JSON.stringify(destination.reverse()),
  //     );
  //     endpointUrl.searchParams.append('access_token', accessToken);
  //     endpointUrl.searchParams.append('key', cargorocketAPIKey);
  //     endpointUrl.searchParams.append('format', 'mapbox');
  //     endpointUrl.searchParams.append('lang', deviceLanguage.slice(0, 2));

  //     fetch(endpointUrl, {signal: lastAbortController.current.signal})
  //       .then((rawData) => rawData.json())
  //       .then((routesResponse) => {
  //         if (routesResponse.name && routesResponse.name === 'Error') {
  //           setLoading(false);
  //           setPopupMessage({
  //             title: i18n.modals.errorFindingRouteTitle,
  //             message: i18n.modals.errorFindingRouteTitleMessage,
  //             status: 'error',
  //           });
  //           return;
  //         }
  //         setLoading(false);
  //         setRoutes([
  //           {
  //             ...routesResponse.find(
  //               (route) => route.profile.name === 'cargobike',
  //             ),
  //             name: i18n.navigation.cargoBikeRoute,
  //             description: i18n.navigation.cargoBikeRouteDescription,
  //           },
  //           {
  //             ...routesResponse.find((route) => route.profile.name === 'bike'),
  //             name: i18n.navigation.classicBikeRoute,
  //             description: i18n.navigation.classicBikeRouteDescription,
  //           },
  //         ]);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         setPopupMessage({
  //           title: i18n.modals.errorFindingRouteTitle,
  //           message: i18n.modals.errorFindingRouteTitleMessage,
  //           status: 'error',
  //         });
  //         setLoading(false);
  //       });
  //   } else {
  //     setRoutes(null);
  //   }
  // }, [routePoints, setRoutes]);

  const renderLocationSelect = (routePoint, index) => {
    return (
      <LocationSelect
        key={`LocationInput-${index}`}
        onChange={(value) => {
          setRoutePoints(setRoutePoint(routePoints, value, index));
        }}
        value={routePoint}
        placeholder={
          index === 0
            ? i18n.navigation.start
            : index === routePoints.length - 1
            ? i18n.navigation.destination
            : i18n.navigation.via
        }
        liveLocation={index === 0 ? true : false}
      />
    );
  };

  return (
    <View style={styles.navigationOverview}>
      <Card style={styles.routingMenu}>
        {routePoints.map((routePoint, index) =>
          renderLocationSelect(routePoint, index),
        )}
      </Card>
      {loading ? (
        <Card style={styles.loader}>
          <Spinner />
        </Card>
      ) : null}
    </View>
  );
};
