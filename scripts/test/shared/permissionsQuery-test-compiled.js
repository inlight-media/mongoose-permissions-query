'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _pluginPermissionsQuery = require('../../plugin/permissionsQuery');

var _pluginPermissionsQuery2 = _interopRequireDefault(_pluginPermissionsQuery);

exports['default'] = {
  permissionsQueryPluginTest: permissionsQueryPluginTest,
  permissionsQueryTest: permissionsQueryTest
};

function permissionsQueryPluginTest(options) {
  var model = options.model;
  it('should has static method permissionsQuery', function (done) {
    model.permissionsQuery.should.exists;
    done();
  });
}

function permissionsQueryTest(options) {
  var Model = options.model;
  var permissionsOptions = {
    filter: {},
    fields: ['*']
  };
  var query = Model.find();
  // generate a full access permissionsOption base on schema
  it('should not have error', function (done) {
    var error = null;
    Model.permissionsQuery(query, permissionsOptions, function (err) {
      error = err;
    });
    _should2['default'].equal(error, null);
    done();
  });
}
module.exports = exports['default'];

//# sourceMappingURL=permissionsQuery-test-compiled.js.map