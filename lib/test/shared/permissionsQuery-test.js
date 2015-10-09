import _ from 'lodash'
import should from 'should'
import mongoose from 'mongoose'
import permissionsQueryPlugin from '../../plugin/permissionsQuery'

export default{
  permissionsQueryPluginTest,
  permissionsQueryTest
}

function permissionsQueryPluginTest(options) {
  const model = options.model
  it('should has static method permissionsQuery', done => {
    model.permissionsQuery.should.exists
    done()
  })
}

function permissionsQueryTest(options) {
  const Model = options.model
  const permissionsOptions = {
    filter: {},
    fields: ['*']
  }
  const query = Model.find()
  // generate a full access permissionsOption base on schema
  it('should not have error', done => {
    let error = null
    Model.permissionsQuery(query, permissionsOptions, (err) => {
      error = err
    })
    should.equal(error, null)
    done()
  })
}
