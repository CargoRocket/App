export const addRoutePoint = (routePoints, routePoint, index) => {
  const tempList = [...routePoints];
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

export const cleanUnusedVias = (routePoints, selectedIndex = 0) => {
  if (routePoints.length > 3) {
    let emptyCount = 0;
    return routePoints.filter((element, index) => {
      if (index === 0 || index === routePoints.length - 1 || index === selectedIndex) {
        return true;
      }
      if (element.name !== '') {
        return true;
      }
      if (emptyCount === 0) {
        emptyCount += 1;
        return true;
      }
    });
  }
  return routePoints;
};
