const camelToKebab = require('./filename');

describe('Filename', () => {
  it('returns the original string if there is no capital letter', () => {
    expect(camelToKebab('')).toEqual('');
    expect(camelToKebab('lotsofdata')).toEqual('lotsofdata');
    expect(camelToKebab('lots-of-data')).toEqual('lots-of-data');
    expect(camelToKebab('lots_of_data')).toEqual('lots_of_data');
    expect(camelToKebab('lots of data')).toEqual('lots of data');
  });

  it('returns the string in lowercase if only the first character is a capital letter', () => {
    expect(camelToKebab('Lotsofdata')).toEqual('lotsofdata');
  });

  it('transforms a CamelCase name into a kebab-case name', () => {
    expect(camelToKebab('LotsOfData')).toEqual('lots-of-data');
    expect(camelToKebab('lotsOfData')).toEqual('lots-of-data');
    expect(camelToKebab('DATA')).toEqual('d-a-t-a');

  });
});
