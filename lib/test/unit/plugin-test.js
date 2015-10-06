import should from 'should'
import mongoose from 'mongoose'
import sharedTest from '../shared/permissionsQuery-test'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

describe('mongoose-permissions-query:unit:plugin', () => {
  sharedTest.permissionsQueryPluginTest()
})
