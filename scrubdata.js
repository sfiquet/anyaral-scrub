const { version } = require('./package.json');

const scrubdata = sourceObj => {
  let resultObj = {};
  if (!sourceObj || !sourceObj.version || !sourceObj.data || !Array.isArray(sourceObj.data)){
    throw new Error('bad data passed to data scrubber');
  }
  resultObj.version = {
    source: sourceObj.version,
    script: version,
  };
  let data = [];
  data = sourceObj.data.filter(item => item.category !== "test" && item.hidden !== true);
  data.forEach(item => delete item.hidden);
  resultObj.data = data;
  return resultObj;
};

module.exports = scrubdata;
