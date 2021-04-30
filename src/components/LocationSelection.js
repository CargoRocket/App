import React from 'react';
import {Autocomplete, AutocompleteItem, Icon} from '@ui-kitten/components';
import {accessToken} from '../res/config';

export const LocationSelect = ({value, onChange, placeholder}) => {
  // [{}] is a workaround. As an empty array leads to no data presented.
  const [data, setData] = React.useState([{}]);
  const [input, setInput] = React.useState('');
  const [active, setActive] = React.useState(false);

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

  const PinIcon = (props) => <Icon {...props} name="pin-outline" />;

  const renderOption = (item, index) => (
    <AutocompleteItem key={index} title={item.place_name} />
  );

  return (
    <Autocomplete
      placeholder={placeholder}
      value={active ? input : value ? value.name : ''}
      onSelect={onSelect}
      onFocus={() => {
        setActive(true);
      }}
      onBlur={() => {
        setActive(false);
      }}
      onChangeText={onChangeText}
      accessoryLeft={PinIcon}>
      {data.map(renderOption)}
    </Autocomplete>
  );
};
