# Mongoose Permissions Query
Mongoose Permissions Query is a plugin that will install an adaptor to your Mongoose models. 
The adaptor can shape GET queries to match your Mongoose permission options.

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
var permissionsQuery = require('mongoose-permissions-query').attach;
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
      return crud.model.permissionsQuery(query, options)
    }
  });
  return action;
}());
```

`crud.model.permissionsQuery(query, options)` is the trigger to add permission filters to the original query. 

### Permission options
`req.permissionOptions` is normally generated by Permissions Middleware Module. Its basic structure:

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
      'title',
      'items.score',
      'items.group.label'
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

***Field name***
`$field_names` are referring to the attributes of model. `fields: ['field']` means include a field. `fields: ['-field']` means exclude the field.
However, include and exclude cannot be used at the same time.


### Shared tests
To use the share test, simply include:

```
var permissionQueryTest = require('mongoose-permissions-query').sharedTest;

permissionQueryTest({
    model: AuditEntry,
});
```

