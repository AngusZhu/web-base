'use strict';

angular.module('webapp.version', [
  'webapp.version.interpolate-filter',
  'webapp.version.version-directive'
])

.value('version', '0.1');
