// CamelCase to snake_case
const camelToSnake = camelName => {
  let tokens = camelName.split(/([A-Z])/);
  let snakeName = tokens.reduce((acc, item) => {
    let lower = item.toLowerCase();
    if (lower !== item && acc.length > 0){
      acc += '_';
    }
    acc += lower;
    return acc;
  }, '');
  return snakeName;
};

module.exports = camelToSnake;
