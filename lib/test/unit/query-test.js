import should from 'should'
import mongoose from 'mongoose'
import sharedTest from '../shared/permissionsQuery-test'
import permissionsQueryPlugin from '../../plugin/permissionsQuery'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId


describe('mongoose-permissions-query:unit:query', () => {
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
  const doc = new Model({
    name: 'name',
    field1: 'field1',
    field2: 2,
    field3: new ObjectId,
    field4: [4, 4, 4, 4],
    field5: { 5: 5 },
    population: new ObjectId,
    associations: [new ObjectId, new ObjectId]
  })

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
          exclude: [ '1', '2', '3' ]
        }
      },
      fields: ['*']
    }
    let error = null
    const newQuery = Model.permissionsQuery(query, permissionsOptions, err => {
      error = err
    })
    should.equal(error, null)
    newQuery._conditions.$or.should.containEql({
      model: {
        '$nin': ['1', '2', '3']
      }
    })
    newQuery._conditions.$or.should.containEql({
      models: {
        '$nin': ['1', '2', '3']
      }
    })
    done()
  })
  // newQuery._conditions.should.eql({ _id: { '$nin': [ '1', '2', '3' ] } })

  it('should include permitted documents')
  it('should exclude banned dependencies')
  it('should include permitted dependencies')
  it('should include permitted documents and exclude banned fields')
  it('should exclude banned documents and include permitted fields')
  it('should include permitted documents and include permitted fields')
  it('should exclude banned documents and exclude banned fields')
  it('should exclude banned documents from an array of population ref')
  it('should include permitted documents, permitted dependencies and permitted fields')
  it('should pass with full permissions')


  // Error handler. not sure if we need these. If permission module works correctly, these errors will never occur.
  it('should handle error of input missing properties', done => {
    const query = Model.findOne()
    const permissionOptions = {}
    let err = {}
    Model.permissionsQuery(query, permissionOptions, error => {
      err = error
    })
    err.message.should.equal('Invalid permission options')
    done()
  })

  it('should handle error of having include and exclude at the same time')
})
