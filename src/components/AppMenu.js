import React from 'react';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from '@ui-kitten/components';
import {LanguageContext} from '../../src/context';

const PersonIcon = (props) => <Icon {...props} name="map-outline" />;

const BellIcon = (props) => <Icon {...props} name="navigation-outline" />;

const SettingsIcon = (props) => <Icon {...props} name="options-2-outline" />;

export const AppMenu = ({navigation, state}) => {
  const i18n = React.useContext(LanguageContext);

  return (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab icon={PersonIcon} title={i18n.menu.project} />
      <BottomNavigationTab icon={BellIcon} title={i18n.menu.navigation} />
      <BottomNavigationTab icon={SettingsIcon} title={i18n.menu.settings} />
    </BottomNavigation>
  );
};
