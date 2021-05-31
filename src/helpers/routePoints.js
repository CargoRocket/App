export const addRoutePoint = (routePoints, routePoint, index) => {
  const tempList = routePoints;
  tempList.splice(index, 0, routePoint);
  return tempList;
};

export const setRoutePoint = (routePoints, routePoint, pointIndex) => {
  return routePoints.map((element, index) => {
    if (index !== pointIndex) {
      return element;
    }
    return routePoint;
  });
};

export const removeRoutePoint = (routePoints, pointIndex) => {
  if (routePoints.length > 2) {
    return routePoints.filter((element, index) => index !== pointIndex);
  }
  return routePoints;
};
