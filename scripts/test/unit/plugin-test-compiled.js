'use strict';

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _sharedPermissionsQueryTest = require('../shared/permissionsQuery-test');

var _sharedPermissionsQueryTest2 = _interopRequireDefault(_sharedPermissionsQueryTest);

var _pluginPermissionsQuery = require('../../plugin/permissionsQuery');

var _pluginPermissionsQuery2 = _interopRequireDefault(_pluginPermissionsQuery);

var Schema = _mongoose2['default'].Schema;
var ObjectId = Schema.Types.ObjectId;

describe('mongoose-permissions-query:unit:plugin', function () {
  var schema = new Schema({
    name: String
  });
  schema.plugin(_pluginPermissionsQuery2['default']);
  var Model = _mongoose2['default'].model('TestModel', schema);
  _sharedPermissionsQueryTest2['default'].permissionsQueryPluginTest({
    model: Model
  });
});

//# sourceMappingURL=plugin-test-compiled.js.map