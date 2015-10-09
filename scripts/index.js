'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _pluginPermissionsQuery = require('./plugin/permissionsQuery');

var _pluginPermissionsQuery2 = _interopRequireDefault(_pluginPermissionsQuery);

var _testSharedPermissionsQueryTest = require('./test/shared/permissionsQuery-test');

var _testSharedPermissionsQueryTest2 = _interopRequireDefault(_testSharedPermissionsQueryTest);

exports['default'] = {
  permissionQuery: _pluginPermissionsQuery2['default'],
  sharedTest: _testSharedPermissionsQueryTest2['default']
};
module.exports = exports['default'];