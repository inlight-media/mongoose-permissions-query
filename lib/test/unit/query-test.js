import should from 'should'
import mongoose from 'mongoose'
import sharedTest from '../shared/permissionsQuery-test'
import permissionsQueryPlugin from '../../plugin/permissionsQuery'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId


describe('mongoose-permissions-query:unit:queryModify', () => {
  // mock env
  const schema = new Schema({
    name: String,
    field1: String,
    field2: Number,
    field3: ObjectId,
    field4: Array,
    field5: Object,
    population: { type: ObjectId, ref: 'Association' },
    associations: [{ type: ObjectId, ref: 'Population' }]
  })
  schema.plugin(permissionsQueryPlugin)
  const Model = mongoose.model('Model', schema)
  const Association = mongoose.model('Association', schema)
  const Population = mongoose.model('Population', schema)

  sharedTest.permissionsQueryTest({ model: Model })

  it('should exclude banned fields', done => {
    const query = Model.findOne()
    const permissionsOptions = {
      filter: {},
      fields: ['-field1', '-field2', '-field3']
    }
    let error = null
    const newQuery = Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    should.equal(error, null)
    newQuery._fields.should.eql({
      field1: 0,
      field2: 0,
      field3: 0
    })
    done()
  })

  it('should include permitted fields', done => {
    const query = Model.findOne()
    const permissionsOptions = {
      filter: {},
      fields: ['field3', 'field5']
    }
    let error = null
    const newQuery = Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    should.equal(error, null)
    newQuery._fields.should.eql({
      field3: 1,
      field5: 1
    })
    done()
  })

  it('should exclude banned documents', done => {
    const query = Model.findOne()
    const permissionsOptions = {
      filter: {
        model: {
          exclude: ['1', '2', '3']
        }
      },
      fields: ['*']
    }
    let error = null
    const newQuery = Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    should.equal(error, null)
    newQuery._conditions.$and.should.containEql({
      _id: {
        '$nin': ['1', '2', '3']
      }
    })
    done()
  })

  it('should include permitted documents', done => {
    const query = Model.findOne()
    const permissionsOptions = {
      filter: {
        model: {
          include: ['1', '2', '3']
        }
      },
      fields: ['*']
    }
    let error = null
    const newQuery = Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    should.equal(error, null)
    newQuery._conditions.$and.should.containEql({
      _id: {
        '$in': ['1', '2', '3']
      }
    })
    done()
  })

  it('should exclude banned dependency', done => {
    const query = Model.findOne()
    const permissionsOptions = {
      filter: {
        population: {
          exclude: ['1', '2', '3']
        }
      },
      fields: ['*']
    }
    let error = null
    const newQuery = Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    should.equal(error, null)
    newQuery._conditions.$and.length.should.equal(1)
    newQuery._conditions.$and[0].$or.should.containEql({
      population: {
        '$nin': ['1', '2', '3']
      }
    })
    newQuery._conditions.$and[0].$or.should.containEql({
      populations: {
        '$nin': ['1', '2', '3']
      }
    })
    done()
  })

  it('should include permitted dependency', done => {
    const query = Model.findOne()
    const permissionsOptions = {
      filter: {
        population: {
          include: ['1', '2', '3']
        }
      },
      fields: ['*']
    }
    let error = null
    const newQuery = Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    should.equal(error, null)
    newQuery._conditions.$and[0].$or.should.containEql({
      population: {
        '$in': ['1', '2', '3']
      }
    })
    newQuery._conditions.$and[0].$or.should.containEql({
      populations: {
        '$in': ['1', '2', '3']
      }
    })
    done()
  })

  it('should exclude multiple banned dependencies', done => {
    const query = Model.findOne()
    const permissionsOptions = {
      filter: {
        population: {
          exclude: ['1', '2', '3']
        },
        associations: {
          include: ['4', '5']
        }
      },
      fields: ['*']
    }
    let error = null
    const newQuery = Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    should.equal(error, null)
    newQuery._conditions.$and[0].$or.should.containEql({
      population: {
        '$nin': ['1', '2', '3']
      }
    })
    newQuery._conditions.$and[0].$or.should.containEql({
      populations: {
        '$nin': ['1', '2', '3']
      }
    })
    done()
  })

  it('should include multiple permitted dependencies', done => {
    const query = Model.findOne()
    const permissionsOptions = {
      filter: {
        population: {
          include: ['1', '2', '3']
        }
      },
      fields: ['*']
    }
    let error = null
    const newQuery = Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    should.equal(error, null)
    newQuery._conditions.$and[0].$or.should.containEql({
      population: {
        '$in': ['1', '2', '3']
      }
    })
    newQuery._conditions.$and[0].$or.should.containEql({
      populations: {
        '$in': ['1', '2', '3']
      }
    })
    done()
  })

  it('should include permitted documents and exclude banned fields', done => {
    const query = Model.findOne()
    const permissionsOptions = {
      filter: {
        population: {
          include: ['1', '2', '3']
        }
      },
      fields: ['-field1', '-field2']
    }
    let error = null
    const newQuery = Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    should.equal(error, null)
    newQuery._conditions.$and[0].$or.should.containEql({
      population: {
        '$in': ['1', '2', '3']
      }
    })
    newQuery._fields.should.eql({
      field1: 0,
      field2: 0
    })
    done()
  })

  it('should exclude banned documents and include permitted dependencies', done => {
    const query = Model.findOne()
    const permissionsOptions = {
      filter: {
        model: {
          exclude: ['10', '20', '30']
        },
        population: {
          include: ['1', '2', '3']
        },
        association: {
          include: ['4', '5', '6']
        }
      },
      fields: ['*']
    }
    let error = null
    const newQuery = Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    should.equal(error, null)
    newQuery._conditions.$and[0].should.containEql({
      _id: {
        '$nin': ['10', '20', '30']
      }
    })
    newQuery._conditions.$and[1].$or.should.containEql({
      population: {
        '$in': ['1', '2', '3']
      }
    })
    newQuery._conditions.$and[2].$or.should.containEql({
      association: {
        '$in': ['4', '5', '6']
      }
    })
    done()
  })

  it('should exclude banned dependencies from an array of population ref', done => {
    const query = Model.findOne()
    const permissionsOptions = {
      filter: {
        association: {
          include: ['4']
        }
      },
      fields: ['*']
    }
    let error = null
    const newQuery = Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    should.equal(error, null)
    newQuery._conditions.$and[0].$or.should.containEql({
      association: {
        '$in': ['4']
      }
    })
    newQuery._conditions.$and[0].$or.should.containEql({
      associations: {
        '$in': ['4']
      }
    })
    done()
  })

  it('should include permitted documents, permitted dependencies and permitted fields', done => {
    const query = Model.findOne()
    const permissionsOptions = {
      filter: {
        _id: {
          include: ['1', '2', '3']
        },
        population: {
          include: ['10', '20', '30']
        },
        associations: {
          exclude: ['100', '200', '300']
        }
      },
      fields: ['field1', '-field2']
    }
    let error = null
    const newQuery = Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    should.equal(error, null)
    newQuery._conditions.$and[0].$or.should.containEql({
      _id: {
        '$in': ['1', '2', '3']
      }
    })
    newQuery._conditions.$and[1].$or.should.containEql({
      population: {
        '$in': ['10', '20', '30']
      }
    })
    newQuery._conditions.$and[2].$or.should.containEql({
      associations: {
        '$nin': ['100', '200', '300']
      }
    })
    newQuery._fields.should.eql({
      field1: 1,
      field2: 0
    })
    done()
  })

  it('should pass with full permissions', done => {
    const query = Model.findOne()
    const permissionsOptions = {
      filter: {},
      fields: ['*']
    }
    let error = null
    const newQuery = Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    should.equal(error, null)
    newQuery._conditions.should.eql({})
    newQuery._fields.should.eql({ '*': 1 })
    done()
  })
  // _fields:{'*':1}


  // Error handler. not sure if we need these. If permission module works correctly, these errors will never occur.
  it('should handle error of input missing properties', done => {
    const query = Model.findOne()
    const permissionOptions = {}
    let err = null
    Model.permissionsQuery(query, permissionOptions, error => {
      err = error
    })
    err.message.should.equal('Invalid permission options')
    done()
  })

  it('should handle error of having include and exclude at the same time', done => {
    const query = Model.findOne()
    const permissionsOptions = {
      filter: {
        model: {
          exclude: [1, 2, 3],
          include: [4, 5, 6]
        }
      },
      fields: ['*']
    }
    let error = null
    Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    error.should.not.eql(null)
    done()
  })

  // query integration tests
  //it('should filter documents')
  //it('should filter dependencies')
  //it('should filter dependencies and documents')
  //it('should hide fields')
  //it('should not show the hidden fields from the original query')
})
