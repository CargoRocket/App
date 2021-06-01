import React from 'react';
import {Layout, Button, Text, Icon, Spinner, Card} from '@ui-kitten/components';
import RouteIcon from '../res/images/icons/route.svg';
import {TouchableWithoutFeedback, View} from 'react-native';
import {RoutingContext, LanguageContext, UiContext} from '../../src/context';
import {accessToken, cargorocketAPIKey} from '../res/config';
import {deviceLanguage} from '../helpers/LanguageProvider';
import {default as theme} from '../res/custom-theme.json';
import Base from '../helpers/base64';

const styles = {
  navigationOverview: {
    position: 'absolute',
    top: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeInfoContainer: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    height: '90%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  header: {
    position: 'relative',
    width: '80%',
    minHeight: 60,
    borderRadius: 10,
    paddingVertical: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routeButton: {
    backgroundColor: theme['color-primary-500'],
    margin: 0,
    borderRadius: 10,
  },
  cancelButton: {
    width: 20,
    margin: 0,
  },
};

export const RouteHeader = ({navigation}) => {
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

  React.useEffect(() => {
    if (
      routePoints[0].coordinates &&
      routePoints[routePoints.length - 1].coordinates
    ) {
      setLoading(true);
      setRoutes(null);
      if (lastAbortController.current) {
        lastAbortController.current.abort();
      }
      lastAbortController.current = new window.AbortController();

      // Build url
      const endpointUrl = new URL('https://api.cargorocket.de/v1/routes');
      const start = [...routePoints[0].coordinates];
      endpointUrl.searchParams.append('from', JSON.stringify(start.reverse()));
      const destination = [...routePoints[routePoints.length - 1].coordinates];
      endpointUrl.searchParams.append(
        'to',
        JSON.stringify(destination.reverse()),
      );
      let vias = routePoints
        .slice(1, routePoints.length - 1)
        .filter((via) => via.coordinates)
        .map((via) => via.coordinates);
      if (vias.length > 0) {
        vias = vias.map((via) => [...via].reverse());
        endpointUrl.searchParams.append('vias', JSON.stringify(vias));
      }
      endpointUrl.searchParams.append('access_token', Base.atob(accessToken));
      endpointUrl.searchParams.append('key', Base.atob(cargorocketAPIKey));
      endpointUrl.searchParams.append('format', 'mapbox');
      endpointUrl.searchParams.append('lang', deviceLanguage.slice(0, 2));

      fetch(endpointUrl, {signal: lastAbortController.current.signal})
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
              ...routesResponse.find(
                (route) => route.profile.name === 'cargobike',
              ),
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
          if (error.name === 'AbortError') {
            console.log('Aborted', error);
            return;
          }
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
  }, [routePoints, setRoutes]);

  const cancelRouting = () => {
    setRoutes(null);
    setRoutePoints([
      {
        name: '',
        coordinates: null,
      },
      {
        name: '',
        coordinates: null,
      },
    ]);
  };

  const renderCloseIcon = (props) => <Icon {...props} name="close" />;

  return (
    <View style={styles.navigationOverview}>
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('RouteSelection')}>
        <Layout style={styles.header}>
          {routes ? (
            <Layout level="2" style={styles.routeInfoContainer}>
              <Text alignSelf="left">
                {routePoints[0].name.slice(0, 25)}{routePoints[0].name.length > 25 ? '...': ''}
              </Text>
              <Text alignSelf="left">
                <Text style={{fontWeight: 'bold'}}>{i18n.navigation.to}</Text> {routePoints[routePoints.length - 1].name.slice(0, 21)}{routePoints[routePoints.length - 1].name.length > 21 ? '...': ''}
              </Text>
            </Layout>
          ) : (
            <Layout level="2" style={styles.routeInfoContainer}>
              <Text category="h6">{i18n.navigation.whereToGo}</Text>
              <Text appearance='hint'>{i18n.navigation.clickBannerToChoose}</Text>
            </Layout>
          )}
          {routes ? (
            <Button
              appearance="ghost"
              status="basic"
              onPress={cancelRouting}
              style={styles.cancelButton}
              accessoryLeft={renderCloseIcon}
            />
          ) : null}
        </Layout>
      </TouchableWithoutFeedback>
      {loading ? (
        <Card style={styles.loader}>
          <Spinner />
        </Card>
      ) : null}
    </View>
  );
};
