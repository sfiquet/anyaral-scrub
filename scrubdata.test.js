const scrubdata = require('./scrubdata');
const { version } = require('./package.json');

describe('scrubdata', () => {
  describe('Invalid data', () => {

    it('throws if the input doesn\'t have the correct structure', () => {
      expect(() => {
        scrubdata();
      }).toThrow();

      expect(() => {
        scrubdata('');
      }).toThrow();

      expect(() => {
        scrubdata([]);
      }).toThrow();

      expect(() => {
        scrubdata({version: 10});
      }).toThrow();

      expect(() => {
        scrubdata({data: []});
      }).toThrow();
    });

    it('doesn\'t throw if the input is an object with properties version and data', () => {
      expect(() => {
        scrubdata({version: 10, data: []});
      }).not.toThrow();

      expect(() => {
        scrubdata({version: 10, data: [], otherstuff: 'irrelevant'});
      }).not.toThrow();
    });
  }); // Invalid data

  describe('Version number', () => {
    it('returns an object with a version property that includes the source version and the script version', () => {
      expect(scrubdata({version: 10, data: []})).toMatchObject({version: {source: 10, script: version}});
      expect(scrubdata({version: 45, data: []})).toMatchObject({version: {source: 45, script: version}});
    });
  }); // Version number

  describe('Data', () => {
    describe('Base case: return all objects', () => {
      it('returns all the objects if none have a special property', () => {
        let data = [
          { name: "chocolate" }, 
          { name: "cookie" }, 
          { name: "cake" },
        ];
        let sourceObj = {
          version: 10, 
          data: data,
        };
        let result = scrubdata(sourceObj);

        expect(result.data).toEqual(data);
      });
    });

    describe('Remove objects with category: "test"', () => {

      it('returns an empty data array if all objects have category: "test"', () => {
        let data = [
            { name: "banana", category: "test" }, 
            { name: "orange", category: "test" }, 
            { name: "kiwi", category: "test" }, 
        ];
        let sourceObj = {
          version: 15,
          data: data,
        };
        let result = scrubdata(sourceObj);
        expect(result.data).toEqual([]);
      });

      it('returns all the objects if none have category: "test"', () => {
        let data = [
          { name: "apple", category: "system" }, 
          { name: "grapefruit", category: "other" }, 
          { name: "tomato", category: "game"},
        ];
        let sourceObj = {
          version: 10, 
          data: data,
        };
        let result = scrubdata(sourceObj);

        expect(result.data).toEqual(data);
      });

      it('removes all objects with category: "test"', () => {
        let data = [
          { name: "apple", category: "system" }, 
          { name: "orange", category: "test" }, 
          { name: "tomato", category: "game"},
          { name: "chocolate" }, 
        ];
        let sourceObj = {
          version: 10, 
          data: data,
        };
        let result = scrubdata(sourceObj);

        expect(result.data).toEqual([
          { name: "apple", category: "system" }, 
          { name: "tomato", category: "game"},
          { name: "chocolate" }, 
        ]);
      });

    }); // remove objects with category: "test"

    describe('Remove objects with hidden: true', () => {
      it('returns an empty array if all objects have hidden: true', () => {
        let data = [
            { name: "banana", hidden: true }, 
            { name: "orange", hidden: true }, 
            { name: "kiwi", hidden: true }, 
        ];
        let sourceObj = {
          version: 15,
          data: data,
        };
        let result = scrubdata(sourceObj);
        expect(result.data).toEqual([]);
      });

      it('returns all the objects if none have hidden: true', () => {
        let data = [
          { name: "apple", hidden: false }, 
          { name: "grapefruit" }, 
          { name: "tomato", hidden: "undecided" },
          { name: "carrot", hidden: "true" },
        ];
        let sourceObj = {
          version: 10, 
          data: data,
        };
        let result = scrubdata(sourceObj);

        expect(result.data).toEqual(data);

      });

      it('removes all objects with hidden: true', () => {
        let data = [
          { name: "apple", hidden: true }, 
          { name: "orange", hidden: false }, 
          { name: "tomato", hidden: true },
          { name: "chocolate" }, 
          { name: "potato", hidden: "rubbish" },
        ];
        let sourceObj = {
          version: 10, 
          data: data,
        };
        let result = scrubdata(sourceObj);

        expect(result.data).toHaveLength(3);
        expect(result.data).toMatchObject([
          { name: "orange" }, 
          { name: "chocolate" },
          { name: "potato" }
        ]);
      });

    }); // Remove objects with hidden: true

    describe('Remove objects with isScenarioSpecific: true', () => {
      // isScenarioSpecific is only present in creatures list

      it('returns an empty array if all objects have isScenarioSpecific: true', () => {
        let data = [
          { name: "banana", isScenarioSpecific: true }, 
          { name: "orange", isScenarioSpecific: true }, 
          { name: "kiwi", isScenarioSpecific: true }, 
        ];
        let sourceObj = {
          version: 15,
          data: data,
        };
        let result = scrubdata(sourceObj);
        expect(result.data).toEqual([]);
      });

      it('returns all the objects if none have isScenarioSpecific: true', () => {
        let data = [
          { name: "apple", isScenarioSpecific: false }, 
          { name: "grapefruit" }, 
          { name: "tomato", isScenarioSpecific: "undecided" },
          { name: "carrot", isScenarioSpecific: "true" },
        ];
        let sourceObj = {
          version: 10, 
          data: data,
        };
        let result = scrubdata(sourceObj);

        expect(result.data).toEqual(data);
      });

      it('removes all objects with isScenarioSpecific: true', () => {
        let data = [
          { name: "apple", isScenarioSpecific: true }, 
          { name: "orange", isScenarioSpecific: false }, 
          { name: "tomato", isScenarioSpecific: true },
          { name: "chocolate" }, 
          { name: "potato", isScenarioSpecific: "rubbish" },
        ];
        let sourceObj = {
          version: 10, 
          data: data,
        };
        let result = scrubdata(sourceObj);

        expect(result.data).toHaveLength(3);
        expect(result.data).toMatchObject([
          { name: "orange" }, 
          { name: "chocolate" },
          { name: "potato" }
        ]);
        
      });
    }); // Remove objects with isScenarioSpecific: true

    describe('Delete hidden property from all returned objects', () => {
      it('deletes property "hidden" from all remaining objects', () => {
        let data = [
          { name: "apple", hidden: true, code: "a" }, 
          { name: "orange", hidden: false, code: "b" }, 
          { name: "tomato", hidden: true, code: "c" },
          { name: "chocolate", code: "d" }, 
          { name: "potato", hidden: "rubbish", code: "e" },
        ];
        let sourceObj = {
          version: 10, 
          data: data,
        };
        let result = scrubdata(sourceObj);

        expect(result.data).toEqual([
          { name: "orange", code: "b" }, 
          { name: "chocolate", code: "d" },
          { name: "potato", code: "e" }
        ]);

      });
    }); // Delete hidden property from all returned objects

    describe('Delete isScenarioSpecific property from all returned objects', () => {
      it('deletes property "isScenarioSpecific" from all remaining objects', () => {
        let data = [
          { name: "apple", isScenarioSpecific: true, code: "a" }, 
          { name: "orange", isScenarioSpecific: false, code: "b" }, 
          { name: "tomato", isScenarioSpecific: true, code: "c" },
          { name: "chocolate", code: "d" }, 
          { name: "potato", isScenarioSpecific: "rubbish", code: "e" },
        ];
        let sourceObj = {
          version: 10, 
          data: data,
        };
        let result = scrubdata(sourceObj);

        expect(result.data).toEqual([
          { name: "orange", code: "b" }, 
          { name: "chocolate", code: "d" },
          { name: "potato", code: "e" }
        ]);

      });
    }); // Delete isScenarioSpecific property from all returned objects

  }); // Data

  describe('Irrelevant data', () => {
    it('doesn\'t include other data in the output', () => {
      let sourceObj = {
        version: 4,
        data: [],
        otherStuff: 'irrelevant',
        moreStuff: {name: 'cat', type: 'pet'},
      };
      
      let result = scrubdata(sourceObj);

      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('data');
      expect(result).not.toHaveProperty('otherStuff');
      expect(result).not.toHaveProperty('moreStuff');
    });
  }); // Irrelevant data
});