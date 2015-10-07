import _ from 'lodash'
import should from 'should'
import mongoose from 'mongoose'
import attachPlugin from '../../plugin/permissionsQuery'

export default{
  permissionsQueryPluginTest,
  permissionsQueryTest
}

function permissionsQueryPluginTest(options){
  const schema = options.schema
  it('should has static method permissionsQuery', done => {
    attachPlugin(schema)
    schema.statics.permissionsQuery.should.exists
    done()
  })
}

function permissionsQueryTest(options) {
  const module = options.module
  // generate a full access permissionsOption base on schema
  it('should not have error', done => {
    console.log('schema: ', schema)
  })
}
