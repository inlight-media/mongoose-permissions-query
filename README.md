# Mongoose Permissions Query
Mongoose Permissions Query is a plugin that will install an query modifier to your Mongoose models.
The modifier can shape GET queries to match your Mongoose permission options.

## Todo
- Contributing guidelines
- License

## Requirements
You will need to install **Mongoose** for your application. We do not require any version of Mongoose in this packages dependencies to give you the flexibility to use your own version of Mongoose.

## How to use

### Attach static method `permissionsQuery` to model
**Example**

In schema:
```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var permissionsQuery = require('mongoose-permissions-query').queryPlugin;
var testSchema = new Schema({
  application: String,
  name: String,
  created: Date
});
testSchema.plugin(permissionsQuery);
```


### Trigger Mongoose Permissions Query within controller
**Example**

In controller:
```
var crud = require('../lib/crud');
module.exports = (function byApplication(req, res, next) {
  var options = req.permissionOptions
  var action = crud.index({
    query: function(req, defaultQuery) {
      var conditions = req.query;
      var query = defaultQuery.where(conditions);
      return crud.model.permissionsQuery(query, options, function(err){
        // handle errors
      })
    }
  });
  return action;
}());
```

`Model.permissionsQuery(query, options)` is the key to trigger query modifier.


### Permission Query function (static method of the plugged mongoose.Model)
```
permissionsQuery(query, permissionOptions, callback(error))
```

#### Error type
HTTP 500 Server Internal Error is the error type that Permission Query will throw.

***Error message example***
```
Error {
  code: '500',
  explanation: 'Input of permission query is not valid.',
  message: 'Invalid permission options',
  name: 'Http500Error',
  response: undefined,
  status: '500'
} 
```


#### Permission options
`permissionOptions` is normally generated by Permissions Middleware Module. Its basic structure:

```
{
  filters: {
    $dependent_module_name: {
     include: [ objectIds ],
     // or
     exclude: [ objectIds ]
    }
  },
  fields: [
    $field_names
  ]
}
```

Some real life examples of `req.permissionOptions`:

```
var auditEntryPermissionOptions =
  {
    filters: {
      location: {
        include: [
          'permitted-location-object-id-1',
          'permitted-location-object-id-2',
          'permitted-location-object-id-3'
        ]
      }
    },
    fields: [
      '-title',
      '-items.score',
      '-items.group.label'
    ]
  }
```

```
var taskEntryPermissionOptions =
  {
    filters: {
      location: {
        exclude: [
          'banned-location-object-id-4',
          'banned-location-object-id-5',
          'banned-location-object-id-6'
        ]
      },
      taskEntry: {
        include: [
          'permitted-task-entry-id-1',
          'permitted-task-entry-id-2'
        ]
      }
    },
    fields: ['*']
  }
```

```
var auditEntryPermissionOptions =
  {
    filters: {
      location: {
        exclude: [
          'banned-location-object-id-4',
          'banned-location-object-id-5',
          'banned-location-object-id-6'
        ]
      },
      auditEntry: {
        exclude: [
          'banned-task-entry-id-1',
          'banned-task-entry-id-2'
        ]
      }
    },
    fields: [
      '-items.score'
    ]
  }
```

```
var fullPermissionOptions =
  {
    filters: {},
    fields: ['*']
  }
```

***Field name***
`$field_names` are referring to the attributes of model. `fields: ['-field']` means exclude the field.

### Shared tests
To use the share test, simply include:

```
// at model-test.js
var permissionQueryTest = require('mongoose-permissions-query').sharedTest;
  sharedTest.permissionsQueryPluginTest({ model: Model })
```

and 

```
// at controller-test.js
var permissionQueryTest = require('mongoose-permissions-query').sharedTest;
  sharedTest.permissionsQueryTest({ model: Model })
```
