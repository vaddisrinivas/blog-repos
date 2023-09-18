const  todoSchema = {
    "$id": "http://example.com/schemas/todo.json",
    "title": "Todo item",
    "description": "A schema for representing a task or action that needs to be done",
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "type": "object",
    "properties": {
      "completed": {
        "title": "Completion Status",
        "description": "A boolean value indicating whether the todo item is completed or not.",
        "type": "boolean",
        "default": false
      },
      "priority": {
        "title": "Priority",
        "description": "An integer representing the priority of the task.",
        "type": "integer",
        "default": 2,
        "minimum": 0,
        "maximum": 4
      },
      "completionDate": {
        "title": "Completion Date",
        "description": "The date and time when the todo item was completed.",
        "type": "string",
        "format": "date-time",
        "minLength": 0,
        "maxLength": 32
      },
      "creationDate": {
        "title": "Creation Date",
        "description": "The date and time when the todo item was created.",
        "type": "string",
        "format": "date-time",
        "minLength": 0,
        "maxLength": 32
      },
      "note": {
        "title": "Note",
        "description": "A description of the task.",
        "type": "string",
        "minLength": 5,
        "maxLength": 200
      },
      "title": {
        "title": "Title",
        "description": "The title of the todo item.",
        "type": "string",
        "minLength": 1,
        "maxLength": 255
      },
      "description": {
        "title": "Description",
        "description": "A detailed description of the todo item.",
        "type": "string",
        "minLength": 0,
        "maxLength": 1000
      },
      "project": {
        "$ref": "#/$defs/projectList"
      },
      "tags": {
        "$ref": "#/$defs/tagList"
      },
     "due": {
       "title": "Due Date",
       "description": "The due date and time for the task.",
       "type": "string",
       "format": "date-time"
     },
     "share": {
       "title": "Share",
       "description": "A list of email addresses to share this note with.",
       "type": "array",
       "items": {
         "type": "string",
         "format": "email"
       },
       "minItems": 0,
       "maxItems": 4
     },
     "images": {
       "title":"Images",
       "description": "A list of images associated with the todo item.",
       "$ref": "#/$defs/uriList"
     },
     "references": {
       "title": "References",
       "description": "A list of references associated with the todo item.",
       "$ref": "#/$defs/uriList"
     },
     "related": {
       "title": "Related",
       "description": "A list of related items associated with the todo item.",
       "$ref": "#/$defs/uriList"
     },
     "attachment": {
       "title": "Attachment",
       "description": "A list of attachments associated with the todo item.",
       "$ref": "#/$defs/uriList"
     },
     "estimate": {
       "title": "Time Estimate (in hours)",
       "description": "An estimate of the time required for the task in hours.",
       "type": "integer",
       "minimum": 0,
       "maximum": 9999
     },
     "user": {
       "title": "User",
       "description": "The user associated with the task.",
       "type": "string",
       "minLength": 1,
       "maxLength": 255
     },
     "urgence": {
       "title": "Urgence",
       "description": "The level of urgency for the task.",
       "type": "string",
       "enum": ["LOW", "MEDIUM", "HIGH"]
     },
     "significance": {
       "title": "Significance",
       "description": "The significance level of the task.",
       "type": "string",
       "enum": ["LOW", "MEDIUM", "HIGH"]
     },
     "importance": {
       "title": "Importance",
       "description": "The importance level of the task.",
       "type": "string",
       "enum": ["LOW", "MEDIUM", "HIGH"]
     },
     "repeat": {
       "title": "Repeat Pattern",
       "description": "A regular expression that specifies how often the todo item should be repeated.",
       "type": "string",
       "minLength": 1,
       "maxLength": 255,
       "pattern": "^(\\*|[0-9]+[hdm])+$"
     },
     "context": {
       "title": "Context",
       "description": "The context in which the task should be performed.",
       "type": "string",
       "minLength": 1,
       "maxLength": 255
     },
     "assignedTo": {
       "title": "Assigned To",
       "description": "A list of email addresses to which the task is assigned.",
       "type": "array",
       "items": {
         "type": "string",
         "format": "email"
       },
       "minItems": 0,
       "maxItems": 4
     },
     "inProgress": {
       "title": "In Progress",
       "description": "A boolean flag indicating whether the task is currently in progress.",
       "type": "boolean"
     }
    },
    "required": ["completed", "priority", "creation_date", "note"],
    "$defs": {
      "projectList": {
        "title": "Project List",
        "description": "A list of projects that the todo item belongs to.",
        "type": "array",
        "items": {
          "type": "string",
          "minLength": 1,
          "maxLength": 32
        },
        "minItems": 0,
        "maxItems": 10
      },
      "tagList": {
        "title": "Tag List",
        "description": "A list of tags associated with the todo item.",
        "type": "array",
        "items": {
          "type": "string",
          "minLength": 1,
          "maxLength": 32
        },
        "minItems": 0,
        "maxItems": 10
      },
      "emailList": {
        "title": "Email List",
        "description": "A list of email addresses.",
        "type": "array",
        "items": {
          "type": "string",
          "format": "email"
        },
        "minItems": 0,
        "maxItems": 4
      },
      "uriList": {
        "title": "URI List",
        "description": "A list of URI (Uniform Resource Identifier) strings.",
        "type": "array",
        "items": {
          "type": "string",
          "format": "uri"
        },
        "minItems": 0,
        "maxItems": 4
      }
    }
}
export default todoSchema;