import React from 'react';
import {
  Autocomplete,
  AutocompleteItem,
  Icon,
  Button,
} from '@ui-kitten/components';
import {accessToken} from '../res/config';
import RNLocation from 'react-native-location';
import {default as theme} from '../res/custom-theme.json';
import {LanguageContext, UiContext} from '../../src/context';

const styles = {
  locationButton: {
    width: 20,
    margin: -10,
  },
};

export const LocationSelect = ({
  value,
  onChange,
  placeholder,
  liveLocation,
}) => {
  // [{}] is a workaround. As an empty array leads to no data presented.
  const [data, setData] = React.useState([{}]);
  const [input, setInput] = React.useState('');
  const [active, setActive] = React.useState(false);
  const i18n = React.useContext(LanguageContext);
  const {
    popupMessage: [popupMessage, setPopupMessage],
  } = React.useContext(UiContext);

  const onSelect = (index) => {
    onChange({
      name: data[index].place_name,
      coordinates: data[index].center,
    });
  };

  const onChangeText = (query) => {
    setInput(query);
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${accessToken}&country=DE`,
    )
      .then((rawData) => rawData.json())
      .then((response) => {
        if (response.features) {
          setData(response.features);
        }
      });
  };

  const setCurrentLocation = () => {
    RNLocation.configure({
      distanceFilter: 5.0,
    });
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine',
      },
    });
    RNLocation.getLatestLocation({timeout: 60000})
      .then((latestLocation) => {
        onChange({
          name: i18n.navigation.yourLocation,
          coordinates: [latestLocation.longitude, latestLocation.latitude],
        });
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

  const PinIcon = (props) => <Icon {...props} name="pin-outline" />;

  const locationIcon = (props) => (
    <Icon
      {...props}
      fill={theme['color-info-500']}
      name="radio-button-on-outline"
    />
  );

  const renderOption = (item, index) => (
    <AutocompleteItem key={index} title={item.place_name} />
  );

  const renderLiveLocation = () =>
    liveLocation ? (
      <Button
        appearance="ghost"
        onPress={setCurrentLocation}
        style={styles.locationButton}
        accessoryLeft={locationIcon}
      />
    ) : null;

  return (
    <Autocomplete
      placeholder={placeholder}
      value={active ? input : value ? value.name : ''}
      onSelect={onSelect}
      onFocus={() => {
        setInput('');
        setActive(true);
      }}
      onBlur={() => {
        setActive(false);
      }}
      onChangeText={onChangeText}
      accessoryRight={renderLiveLocation}
      accessoryLeft={PinIcon}>
      {data.map(renderOption)}
    </Autocomplete>
  );
};
