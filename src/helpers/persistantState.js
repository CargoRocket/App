export const makePersistent = (state, key, MMKV, type = 'string') => {
  const updateState = (value) => {
    try {
      switch (type) {
        case 'bool':
          MMKV.setBool(key, value, (error, result) => {
            if (error) {
              // Todo Figure out how to handle this in the future.
              console.error(error);
              return;
            }
          });
          break;
        case 'int':
          if (isNaN(parseInt(value))) {
            break;
          }
          MMKV.setInt(key, value, (error, result) => {
            if (error) {
              // Todo Figure out how to handle this in the future.
              console.error(error);
              return;
            }
          });
          break;
        case 'string':
        default:
          MMKV.setString(key, value, (error, result) => {
            if (error) {
              // Todo Figure out how to handle this in the future.
              console.error(error);
              return;
            }
          });
      }
    } catch (e) {
      console.error(e);
    }
    state[1](value);
  };

  return [state[0], updateState];
};
