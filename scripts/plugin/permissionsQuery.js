'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = attachStaticMethod;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _errors = require('errors');

var _errors2 = _interopRequireDefault(_errors);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function attachStaticMethod(schema) {
  schema.statics.permissionsQuery = permissionsQuery;
}

function permissionsQuery(defaultQuery, permissionOptions, callback) {
  var myModule = this.modelName;
  if (!permissionOptions.fields || !permissionOptions.filter || filterCheck(permissionOptions.filter)) {
    var error = new _errors2['default'].Http500Error({
      message: 'Invalid permission options',
      explanation: 'Input of permission query is not valid.'
    });
    callback(error);
    return;
  }

  // for fields
  var fields = permissionOptions.fields.join(' ');
  if (fields === '*') {
    fields = '';
  }

  // for filter
  var conditions = undefined;
  if (!_lodash2['default'].isEmpty(permissionOptions.filter)) {
    conditions = { $and: [] };
    _lodash2['default'].each(permissionOptions.filter, function (content, module) {
      if (_lodash2['default'].isArray(content.exclude) && _lodash2['default'].isEmpty(content.exclude)) {} else if (module === myModule.toLowerCase()) {
        // this is its own module
        if (content.include) {
          conditions.$and.push({
            '_id': {
              $in: content.include
            }
          });
        } else if (content.exclude) {
          conditions.$and.push({
            '_id': {
              $nin: content.exclude
            }
          });
        }
      } else {
        // this is a dependency
        // there are two types of module ref styles. one is singular, another one is plural(array of doc ref)
        if (content.include) {
          var arrayOfRef = {};
          arrayOfRef[module + 's'] = {
            $in: content.include
          };
          var singularRef = {};
          singularRef[module] = {
            $in: content.include
          };
          conditions.$and.push({
            $or: [arrayOfRef, singularRef]
          });
        } else if (content.exclude) {
          var arrayOfRef = {};
          arrayOfRef[module + 's'] = {
            $nin: content.exclude
          };
          var singularRef = {};
          singularRef[module] = {
            $nin: content.exclude
          };
          conditions.$and.push({
            $or: [arrayOfRef, singularRef]
          });
        }
      }
    });
  }
  return defaultQuery.select(fields).find(conditions);
}

function filterCheck(filter) {
  var output = false;
  _lodash2['default'].each(filter, function (content) {
    // both Include and Exclude exist || include:[] exists
    if (content.include && content.exclude || _lodash2['default'].isEmpty(content.include) && _lodash2['default'].isArray(content.include)) {
      output = true;
    }
  });
  return output;
}
module.exports = exports['default'];