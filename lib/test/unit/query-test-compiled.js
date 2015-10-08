'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

describe('mongoose-permissions-query:unit:query', function () {
  // mock env
  var schema = new Schema({
    name: String,
    field1: String,
    field2: Number,
    field3: ObjectId,
    field4: Array,
    field5: Object,
    population: { type: ObjectId, ref: 'Association' },
    associations: [{ type: ObjectId, ref: 'Population' }]
  });
  schema.plugin(_pluginPermissionsQuery2['default']);
  var Model = _mongoose2['default'].model('Model', schema);
  var Association = _mongoose2['default'].model('Association', schema);
  var Population = _mongoose2['default'].model('Population', schema);
  var doc = new Model({
    name: 'name',
    field1: 'field1',
    field2: 2,
    field3: new ObjectId(),
    field4: [4, 4, 4, 4],
    field5: { 5: 5 },
    population: new ObjectId(),
    associations: [new ObjectId(), new ObjectId()]
  });

  _sharedPermissionsQueryTest2['default'].permissionsQueryTest({ model: Model });

  it('should exclude banned fields', function (done) {
    var query = Model.findOne();
    var permissionsOptions = {
      filter: {},
      fields: ['-field1', '-field2', '-field3']
    };
    var error = null;
    var newQuery = Model.permissionsQuery(query, permissionsOptions, function (err) {
      error = err;
    });
    _should2['default'].equal(error, null);
    newQuery._fields.should.eql({
      field1: 0,
      field2: 0,
      field3: 0
    });
    done();
  });

  it('should include permitted fields', function (done) {
    var query = Model.findOne();
    var permissionsOptions = {
      filter: {},
      fields: ['field3', 'field5']
    };
    var error = null;
    var newQuery = Model.permissionsQuery(query, permissionsOptions, function (err) {
      error = err;
    });
    _should2['default'].equal(error, null);
    newQuery._fields.should.eql({
      field3: 1,
      field5: 1
    });
    done();
  });

  it('should exclude banned documents', function (done) {
    var query = Model.findOne();
    var permissionsOptions = {
      filter: {
        model: {
          exclude: ['1', '2', '3']
        }
      },
      fields: ['*']
    };
    var error = null;
    var newQuery = Model.permissionsQuery(query, permissionsOptions, function (err) {
      error = err;
    });
    _should2['default'].equal(error, null);
    newQuery._conditions.$and.should.containEql({
      _id: {
        '$nin': ['1', '2', '3']
      }
    });
    done();
  });

  it('should include permitted documents', function (done) {
    var query = Model.findOne();
    var permissionsOptions = {
      filter: {
        model: {
          include: ['1', '2', '3']
        }
      },
      fields: ['*']
    };
    var error = null;
    var newQuery = Model.permissionsQuery(query, permissionsOptions, function (err) {
      error = err;
    });
    _should2['default'].equal(error, null);
    newQuery._conditions.$and.should.containEql({
      _id: {
        '$in': ['1', '2', '3']
      }
    });
    done();
  });

  it('should exclude banned dependency', function (done) {
    var query = Model.findOne();
    var permissionsOptions = {
      filter: {
        population: {
          exclude: ['1', '2', '3']
        }
      },
      fields: ['*']
    };
    var error = null;
    var newQuery = Model.permissionsQuery(query, permissionsOptions, function (err) {
      error = err;
    });
    _should2['default'].equal(error, null);
    console.log(newQuery._conditions.$and);
    newQuery._conditions.$and.length.should.equal(1);
    newQuery._conditions.$and[0].$or.should.containEql({
      population: {
        '$nin': ['1', '2', '3']
      }
    });
    newQuery._conditions.$and[0].$or.should.containEql({
      populations: {
        '$nin': ['1', '2', '3']
      }
    });
    done();
  });

  it('should include permitted dependency', function (done) {
    var query = Model.findOne();
    var permissionsOptions = {
      filter: {
        population: {
          include: ['1', '2', '3']
        }
      },
      fields: ['*']
    };
    var error = null;
    var newQuery = Model.permissionsQuery(query, permissionsOptions, function (err) {
      error = err;
    });
    _should2['default'].equal(error, null);
    newQuery._conditions.$and[0].$or.should.containEql({
      population: {
        '$in': ['1', '2', '3']
      }
    });
    newQuery._conditions.$and[0].$or.should.containEql({
      populations: {
        '$in': ['1', '2', '3']
      }
    });
    done();
  });

  it('should exclude multiple banned dependencies', function (done) {
    var query = Model.findOne();
    var permissionsOptions = {
      filter: {
        population: {
          exclude: ['1', '2', '3']
        },
        associations: {
          include: ['4', '5']
        }
      },
      fields: ['*']
    };
    var error = null;
    var newQuery = Model.permissionsQuery(query, permissionsOptions, function (err) {
      error = err;
    });
    _should2['default'].equal(error, null);
    newQuery._conditions.$and[0].$or.should.containEql({
      population: {
        '$nin': ['1', '2', '3']
      }
    });
    newQuery._conditions.$and[0].$or.should.containEql({
      populations: {
        '$nin': ['1', '2', '3']
      }
    });
    done();
  });

  it('should include multiple permitted dependencies', function (done) {
    var query = Model.findOne();
    var permissionsOptions = {
      filter: {
        population: {
          include: ['1', '2', '3']
        }
      },
      fields: ['*']
    };
    var error = null;
    var newQuery = Model.permissionsQuery(query, permissionsOptions, function (err) {
      error = err;
    });
    _should2['default'].equal(error, null);
    newQuery._conditions.$and[0].$or.should.containEql({
      population: {
        '$in': ['1', '2', '3']
      }
    });
    newQuery._conditions.$and[0].$or.should.containEql({
      populations: {
        '$in': ['1', '2', '3']
      }
    });
    done();
  });

  it('should include permitted documents and exclude banned fields');
  it('should exclude banned documents and include permitted fields');
  it('should include permitted documents and include permitted fields');
  it('should exclude banned documents and exclude banned fields');
  it('should exclude banned documents from an array of population ref');
  it('should include permitted documents, permitted dependencies and permitted fields');
  it('should pass with full permissions');

  // Error handler. not sure if we need these. If permission module works correctly, these errors will never occur.
  it('should handle error of input missing properties', function (done) {
    var query = Model.findOne();
    var permissionOptions = {};
    var err = {};
    Model.permissionsQuery(query, permissionOptions, function (error) {
      err = error;
    });
    err.message.should.equal('Invalid permission options');
    done();
  });

  it('should handle error of having include and exclude at the same time');

  // query result test
  it('should filter documents');
  it('should filter dependencies');
  it('should filter dependencies');
});

//# sourceMappingURL=query-test-compiled.js.map