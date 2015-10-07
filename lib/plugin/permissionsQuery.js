import errors from 'errors'
import _ from 'lodash'

export default function attachStaticMethod(schema) {
  schema.statics.permissionsQuery = permissionsQuery
}

function permissionsQuery(defaultQuery, permissionOptions, callback) {
  const myModule = this.modelName
  if (!permissionOptions.fields || !permissionOptions.filter || (permissionOptions.filter.include && permissionOptions.filter.exclude)) {
    const error = new errors.Http500Error({
      message: 'Invalid permission options',
      explanation: 'Input of permission query is not valid.'
    })
    callback(error)
    return
  }
  // for fields
  const fields = permissionOptions.fields.join(' ')

  // for filter
  const conditions = {}
  _.each(permissionOptions.filter, (module, content) => {
    if (module === myModule) {
      // this is its own module
      if (content.include) {
        conditions.module = {
          '_id': {
            $in: content.include
          }
        }
      }
      else if (content.exclude) {
        conditions.module = {
          '_id': {
            $nin: content.exclude
          }
        }
      }
    } else {
    //  this is a dependency
      if (content.include) {
        conditions.module = {
          module: {
            $in: content.include
          }
        }
      } else if (content.exclude) {
        conditions.module = {
          module: {
            $nin: content.exclude
          }
        }
      }
    }
  })

  return defaultQuery.select(fields).where(conditions)
}
