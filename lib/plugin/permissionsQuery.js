import errors from 'errors'
import _ from 'lodash'
import Query from 'mongoose/lib/query'

export default function attachStaticMethod(schema) {
  schema.statics.permissionsQuery = permissionsQuery
}

function permissionsQuery(defaultQuery, permissionOptions, callback) {
  const myModule = this.modelName
  if (!permissionOptions.fields || !permissionOptions.filter || bothIncludeAndExcludeExist(permissionOptions.filter)) {
    const error = new errors.Http500Error({
      message: 'Invalid permission options',
      explanation: 'Input of permission query is not valid.'
    })
    callback(error)
    return
  }

  // for fields
  let fields = permissionOptions.fields.join(' ')
  if (fields === '*') {
    fields = ''
  }

  // for filter
  let conditions
  if (!_.isEmpty(permissionOptions.filter)) {
    conditions = { $and: [] }
    _.each(permissionOptions.filter, (content, module) => {
      if (module === myModule.toLowerCase()) {
        // this is its own module
        if (content.include) {
          conditions.$and.push({
            '_id': {
              $in: content.include
            }
          })
        } else if (content.exclude) {
          conditions.$and.push({
            '_id': {
              $nin: content.exclude
            }
          })
        }
      } else {
        // this is a dependency
        // there are two types of module ref styles. one is singular, another one is plural(array of doc ref)
        if (content.include) {
          const arrayOfRef = {}
          arrayOfRef[module + 's'] = {
            $in: content.include
          }
          const singularRef = {}
          singularRef[module] = {
            $in: content.include
          }
          conditions.$and.push({
            $or: [arrayOfRef, singularRef]
          })
        } else if (content.exclude) {
          const arrayOfRef = {}
          arrayOfRef[module + 's'] = {
            $nin: content.exclude
          }
          const singularRef = {}
          singularRef[module] = {
            $nin: content.exclude
          }
          conditions.$and.push({
            $or: [arrayOfRef, singularRef]
          })
        }
      }
    })
  }
  return defaultQuery
      .select(fields)
      .find(conditions)
}

function bothIncludeAndExcludeExist(filter) {
  let output = false
  _.each(filter, (content) => {
    if (content.include && content.exclude) {
      output = true
    }
  })
  return output
}
