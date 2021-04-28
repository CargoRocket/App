export const makePersistent = (state, key, MMKV, type = 'string') => {
  const updateState = (value) => {
    switch (type) {
      case 'bool':
        MMKV.setBoolAsync(key, value, (error, result) => {
          if (error) {
            // Todo Figure out how to handle this in the future.
            console.error(error);
            return;
          }
        });
        break;
      case 'int':
        MMKV.setIntAsync(key, value, (error, result) => {
          if (error) {
            // Todo Figure out how to handle this in the future.
            console.error(error);
            return;
          }
        });
        break;
      case 'string':
      default:
        MMKV.setStringAsync(key, value, (error, result) => {
          if (error) {
            // Todo Figure out how to handle this in the future.
            console.error(error);
            return;
          }
        });
    }
    state[1](value);
  };

  return [state[0], updateState];
};
