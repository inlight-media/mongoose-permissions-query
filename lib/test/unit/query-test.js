import should from 'should'
import mongoose from 'mongoose'
import sharedTest from '../shared/permissionsQuery-test'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

describe('mongoose-permissions-query:unit:plugin', () => {
  sharedTest.permissionsQueryTest()

  it('should exclude banned fields')
  it('should exclude banned documents')
  it('should include permmited fields')
  it('should include permmited documents')
  it('should include permmited documents and exclude banned fields')
  it('should exclude banned documents and include permmited fields')
  it('should include permmited documents and include permmited fields')
  it('should exclude banned documents and exclude banned fields')
})
