'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var _pluginPermissionsQuery = require('./plugin/permissionsQuery');

var _pluginPermissionsQuery2 = _interopRequireDefault(_pluginPermissionsQuery);

var _testSharedPermissionQueryTest = require('./test/shared/permissionQueryTest');

var _testSharedPermissionQueryTest2 = _interopRequireDefault(_testSharedPermissionQueryTest);

exports.plugin = _pluginPermissionsQuery2['default'];
exports.sharedTest = _testSharedPermissionQueryTest2['default'];

//# sourceMappingURL=index-compiled.js.map