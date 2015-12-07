'use strict';

describe('webapp.version module', function() {
  beforeEach(module('webapp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
