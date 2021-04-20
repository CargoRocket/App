export const distance = (lat1, lon1, lat2, lon2) =>{
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515 * 1.609344;
  return dist;
};

export const center = (lon1, lat1, lon2, lat2) => {
  let latOut = 0;
  let lonOut = 0;
  if (lat1 >= lat2) {
    latOut = lat2 + (lat1 - lat2) / 2;
  } else {
    latOut = lat1 + (lat2 - lat1) / 2;
  }

  if (lon1 >= lon2) {
    lonOut = lon2 + (lon1 - lon2) / 2;
  } else {
    lonOut = lon1 + (lon2 - lon1) / 2;
  }
  return [latOut, lonOut];
};