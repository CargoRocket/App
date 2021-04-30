import React from 'react';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from '@ui-kitten/components';

const PersonIcon = (props) => <Icon {...props} name="map-outline" />;

const BellIcon = (props) => <Icon {...props} name="navigation-outline" />;

const SettingsIcon = (props) => <Icon {...props} name="options-2-outline" />;

export const AppMenu = ({navigation, state}) => {
  // const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab icon={PersonIcon} title="Project" />
      <BottomNavigationTab icon={BellIcon} title="Navigation" />
      <BottomNavigationTab icon={SettingsIcon} title="Settings" />
    </BottomNavigation>
  );
};
