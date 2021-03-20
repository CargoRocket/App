import React from 'react';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from '@ui-kitten/components';

const PersonIcon = (props) => <Icon {...props} name="map-outline" />;

const BellIcon = (props) => <Icon {...props} name="navigation-outline" />;

const EmailIcon = (props) => <Icon {...props} name="at-outline" />;

export const AppMenu = ({navigation, state}) => {
  // const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab icon={PersonIcon} title="" />
      <BottomNavigationTab icon={BellIcon} title="" />
      <BottomNavigationTab icon={EmailIcon} title="" />
    </BottomNavigation>
  );
};
