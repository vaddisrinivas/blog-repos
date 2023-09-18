import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import DateTimePicker from '@mui/lab/DateTimePicker';

const initialFormData = {
  completed: false,
  priority: 2,
  completion_date: null,
  creation_date: null,
  note: '',
  title: '',
  description: '',
  project: [],
  tags: [],
  special: {
    due: null,
    share: [],
    images: [],
    references: [],
    related: [],
    attachment: [],
    estimate: null,
    user: '',
    urgence: 'low',
    significance: 'low',
    importance: 'low',
    repeat: '',
    context: '',
    assigned_to: [],
    in_progress: false,
  },
};

const TodoForm = ({initialFormData}) => {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateTimeChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleAddTodo = () => {
    // Validate the form data here (e.g., check for required fields and item values).
    // If validation passes, add the todo item to your data store.
    console.log('Form data:', formData);
    // Reset the form or perform other actions as needed.
    setFormData(initialFormData);
  };

  return (
    <form>
      <TextField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        fullWidth
      />
      <FormControlLabel
        control={
          <Checkbox
            name="completed"
            checked={formData.completed}
            onChange={handleCheckboxChange}
          />
        }
        label="Completed"
      />
      <InputLabel htmlFor="priority">Priority</InputLabel>
      <Select
        label="Priority"
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value={0}>Low</MenuItem>
        <MenuItem value={2}>Medium</MenuItem>
        <MenuItem value={4}>High</MenuItem>
      </Select>
      <DateTimePicker
        label="Completion Date"
        name="completion_date"
        value={formData.completion_date}
        onChange={(value) => handleDateTimeChange('completion_date', value)}
        fullWidth
      />
      <TextField
        label="Note"
        name="note"
        value={formData.note}
        onChange={handleChange}
        fullWidth
        required
      />
      {/* Add other fields in the following sections */}

      {/* Section for project and tags */}
      <TextField
        label="Projects (comma-separated)"
        name="project"
        value={formData.project.join(', ')}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Tags (comma-separated)"
        name="tags"
        value={formData.tags.join(', ')}
        onChange={handleChange}
        fullWidth
      />

      {/* Section for special object */}
      <DateTimePicker
        label="Due Date"
        name="special.due"
        value={formData.special.due}
        onChange={(value) => handleDateTimeChange('special.due', value)}
        fullWidth
      />
      <TextField
        label="Share (comma-separated emails)"
        name="special.share"
        value={formData.special.share.join(', ')}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Images (comma-separated URIs)"
        name="special.images"
        value={formData.special.images.join(', ')}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="References (comma-separated URIs)"
        name="special.references"
        value={formData.special.references.join(', ')}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Related (comma-separated URIs)"
        name="special.related"
        value={formData.special.related.join(', ')}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Attachment (comma-separated URIs)"
        name="special.attachment"
        value={formData.special.attachment.join(', ')}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Time Estimate (in hours)"
        name="special.estimate"
        type="number"
        value={formData.special.estimate || ''}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="User"
        name="special.user"
        value={formData.special.user}
        onChange={handleChange}
        fullWidth
      />
      <InputLabel htmlFor="urgence">Urgence</InputLabel>
      <Select
        label="Urgence"
        name="special.urgence"
        value={formData.special.urgence}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value="low">Low</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="high">High</MenuItem>
      </Select>
      <InputLabel htmlFor="significance">Significance</InputLabel>
      <Select
        label="Significance"
        name="special.significance"
        value={formData.special.significance}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value="low">Low</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="high">High</MenuItem>
      </Select>
      <InputLabel htmlFor="importance">Importance</InputLabel>
      <Select
        label="Importance"
        name="special.importance"
        value={formData.special.importance}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value="low">Low</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="high">High</MenuItem>
      </Select>
      <TextField
        label="Repeat Pattern"
        name="special.repeat"
        value={formData.special.repeat}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Context"
        name="special.context"
        value={formData.special.context}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Assigned To (comma-separated emails)"
        name="special.assigned_to"
        value={formData.special.assigned_to.join(', ')}
        onChange={handleChange}
        fullWidth
      />
      <FormControlLabel
        control={
          <Checkbox
            name="special.in_progress"
            checked={formData.special.in_progress}
            onChange={handleCheckboxChange}
          />
        }
        label="In Progress"
      />
      <Button variant="contained" color="primary" onClick={handleAddTodo}>
        Add Todo
      </Button>
    </form>
  );
};

export default TodoForm;
