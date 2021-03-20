import React from 'react';
import {Autocomplete, AutocompleteItem} from '@ui-kitten/components';
import {accessToken} from '../res/config';

export const LocationSelect = ({onChange, placeholder}) => {
  const [value, setValue] = React.useState(null);
  // [{}] is a workaround. As an empty array leads to no data presented.
  const [data, setData] = React.useState([{}]);

  const onSelect = (index) => {
    setValue(data[index].place_name);
    onChange(data[index]);
  };

  const onChangeText = (query) => {
    setValue(query);
    // Do request -> Update List
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${accessToken}`,
    )
      .then((rawData) => rawData.json())
      .then((response) => {
        if (response.features) {
          setData(response.features);
          console.log(data);
        }
      });
  };

  const renderOption = (item, index) => (
    <AutocompleteItem key={index} title={item.place_name} />
  );

  return (
    <Autocomplete
      placeholder={placeholder}
      value={value}
      onSelect={onSelect}
      onChangeText={onChangeText}>
      {data.map(renderOption)}
    </Autocomplete>
  );
};
