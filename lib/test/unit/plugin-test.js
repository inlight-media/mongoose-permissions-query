import should from 'should'
import mongoose from 'mongoose'
import sharedTest from '../shared/permissionsQuery-test'
import permissionsQueryPlugin from '../../plugin/permissionsQuery'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

describe('mongoose-permissions-query:unit:plugin', () => {
  const schema = new Schema({
    name: String
  })
  schema.plugin(permissionsQueryPlugin)
  const Model = mongoose.model('TestModel', schema)
  sharedTest.permissionsQueryPluginTest({
    model: Model
  })
})
