// CamelCase to kebab-case
const camelToKebab = camelName => {
  let tokens = camelName.split(/([A-Z])/);
  let kebabName = tokens.reduce((acc, item) => {
    let lower = item.toLowerCase();
    if (lower !== item && acc.length > 0){
      acc += '-';
    }
    acc += lower;
    return acc;
  }, '');
  return kebabName;
};

module.exports = camelToKebab;
