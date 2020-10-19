const camelToSnake = require('./filename');

describe('Filename', () => {
  it('returns the original string if there is no capital letter', () => {
    expect(camelToSnake('')).toEqual('');
    expect(camelToSnake('lotsofdata')).toEqual('lotsofdata');
    expect(camelToSnake('lots-of-data')).toEqual('lots-of-data');
    expect(camelToSnake('lots_of_data')).toEqual('lots_of_data');
    expect(camelToSnake('lots of data')).toEqual('lots of data');
  });

  it('returns the string in lowercase if only the first character is a capital letter', () => {
    expect(camelToSnake('Lotsofdata')).toEqual('lotsofdata');
  });

  it('transforms a CamelCase name into a snake_case name', () => {
    expect(camelToSnake('LotsOfData')).toEqual('lots_of_data');
    expect(camelToSnake('lotsOfData')).toEqual('lots_of_data');
    expect(camelToSnake('DATA')).toEqual('d_a_t_a');

  });
});
