import should from 'should'
import mongoose from 'mongoose'
import sharedTest from '../shared/permissionsQuery-test'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

describe('mongoose-permissions-query:unit:plugin', () => {
  const schema = new Schema({
    name: String
  })
  sharedTest.permissionsQueryTest({schema: schema})

  it('should exclude banned fields')
  it('should exclude banned documents')
  it('should include permmited fields')
  it('should include permmited documents')
  it('should include permmited documents and exclude banned fields')
  it('should exclude banned documents and include permmited fields')
  it('should include permmited documents and include permmited fields')
  it('should exclude banned documents and exclude banned fields')

  // not sure if we need this
  it('should handle error of having include and exclude at the same time')
})
