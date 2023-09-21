const uiSchema = {
    "ui:order": [
      "title",
      "inProgress",
      "completed",
      "priority",
      "creationDate",
      "note",
      "description",
      "importance",
      "significance",
      "urgence",
      "project",
      "tags",
      "user",
      "due",
      "estimate",
      "context",
      "assignedTo",
      "share",
      "repeat",
      "completionDate",
      "images",
      "references",
      "related",
      "attachment"
    ],
    completed: {
        "ui:widget": 'checkbox'
    },
    priority: {
        "ui:widget": 'range'
    },
    completionDate: {
        "ui:widget": 'datetime',
        "ui:options": {
          // add any additional options for the widget here
          // such as placeholder, helperText, etc.
        }
    },
    creationDate: {
        "ui:widget": 'datetime',
        "ui:options": {
          // add any additional options for the widget here
          // such as placeholder, helperText, etc.
        "dateTimeFormat": "DD-MM-YY hh:mm:a",
        "dateTimeSaveFormat": "YYYY/MM/DD h:mm a"
        }
    },
    note: {
      "ui:widget": "textarea"
    },
    due: {
        "ui:widget": 'datetime',
        "ui:options": {
          // add any additional options for the widget here
          // such as placeholder, helperText, etc.
        }
    },
    
    repeat: {
      "ui:help": "Enter a pattern of * (any time), h (hourly), d (daily), or m (monthly) to specify how often the task should be repeated. For example, *h means every hour, *d means every day, 2d means every two days, etc."
    },
    urgence: {
      "ui:widget": "select"
    },
    significance: {
      "ui:widget": "select"
    },
    importance: {
      "ui:widget": "select"
    }
  }

  export default uiSchema;