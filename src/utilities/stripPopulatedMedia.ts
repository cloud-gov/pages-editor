export const stripPopulatedMedia = (value: any): any => {
  if (value && typeof value === 'object') {
    return JSON.parse(JSON.stringify(value, (key, val) => {
      if (val && typeof val === 'object' && val.id && val.url) {
        return val.id;
      }
      return val;
    }));
  }
  return value;
};
