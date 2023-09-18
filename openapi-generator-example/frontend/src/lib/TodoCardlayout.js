import React, { useEffect, useReducer, useContext, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import getTodoSchemaOrAPI from '../api/todoApiOpenApiClient';
import CardLayout from '../components/CardLayout';
import RSJFForm from '../components/RJSFForm';
import todoSchema from '../schemas/todoSchema';
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
   
// create a custom error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // you can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // you can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
// Create a context to manage state
const TodoContext = React.createContext();

const initialState = {
  data: [],
  loading: false,
  currentPage: 0,
  itemsPerPage: 10,
  readonly: false,
  isModalOpen: false,
  selectedCardData: {},
  snackbarOpen: false,
  snackbarMessage: '',
  snackbarSeverity: 'success',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_SELECTED_CARD_DATA':
      return { ...state, selectedCardData: action.payload };
    case 'SET_IS_MODAL_OPEN':
      return { ...state, isModalOpen: action.payload };
    case 'SET_READONLY':
      return { ...state, readonly: action.payload };
    case 'SET_SNACKBAR_OPEN':
      return { ...state, snackbarOpen: action.payload };
    case 'SET_SNACKBAR_MESSAGE':
      return { ...state, snackbarMessage: action.payload };
    case 'SET_SNACKBAR_SEVERITY':
      return { ...state, snackbarSeverity: action.payload };
    default:
      return state;
  }
}

const fetchData = async (dispatch, state) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  const response = await getTodoSchemaOrAPI('api', 'list', {
    page: state.currentPage,
    size: state.itemsPerPage,
  });
  if (response.content.length > 0){
    dispatch({ type: 'SET_DATA', payload: response.content });
    dispatch({ type: 'SET_LOADING', payload: false });  
  }
  else {
    
  }
};

const TodoCardLayout = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { data, loading, currentPage, itemsPerPage, readonly, isModalOpen, selectedCardData, snackbarOpen, snackbarMessage, snackbarSeverity } = state;

  const handlePageChange = (event, value) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: value });
  };

  const handleEditClick = (item) => {
    dispatch({ type: 'SET_SELECTED_CARD_DATA', payload: item });
    dispatch({ type: 'SET_IS_MODAL_OPEN', payload: true });
  };

  const handleDeleteClick = useCallback(async (item) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    await getTodoSchemaOrAPI('api', 'delete', { id: item.id });

    const updatedData = data.filter((todo) => todo.id !== item.id);
    dispatch({ type: 'SET_DATA', payload: updatedData });
  }, [data]);

  const handleModalClose = () => {
    dispatch({ type: 'SET_IS_MODAL_OPEN', payload: false });
    dispatch({ type: 'SET_READONLY', payload: false });
  };

  const handleExpandClick = (item) => {
    dispatch({ type: 'SET_SELECTED_CARD_DATA', payload: item });
    dispatch({ type: 'SET_READONLY', payload: true });
    dispatch({ type: 'SET_IS_MODAL_OPEN', payload: true });
  };

  const handleFormSubmit = async (formData) => {
    try {
      await getTodoSchemaOrAPI('api', 'update', { id: formData.id, object: formData });
      dispatch({ type: 'SET_IS_MODAL_OPEN', payload: false });
      dispatch({ type: 'SET_SNACKBAR_MESSAGE', payload: 'Todo updated successfully' });
      dispatch({ type: 'SET_SNACKBAR_SEVERITY', payload: 'success' });
      dispatch({ type: 'SET_SNACKBAR_OPEN', payload: true });
    } catch (error) {
      dispatch({ type: 'SET_IS_MODAL_OPEN', payload: false });
      dispatch({ type: 'SET_SNACKBAR_MESSAGE', payload: 'Todo update failed' });
      dispatch({ type: 'SET_SNACKBAR_SEVERITY', payload: 'error' });
      dispatch({ type: 'SET_SNACKBAR_OPEN', payload: true });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch({ type: 'SET_SNACKBAR_OPEN', payload: false });
  };

  useEffect(() => {
    fetchData(dispatch, state);
  }, [currentPage, itemsPerPage]);

  return (
    <TodoContext.Provider value={dispatch}>
      <div className="container">
        <h1>Card Layout</h1>
        <CardLayout data={data} loading={loading} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} handleExpandClick={handleExpandClick} />
        <Dialog open={isModalOpen} onClose={handleModalClose}>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogContent>
            <ErrorBoundary>
              <RSJFForm schema={todoSchema} formData={selectedCardData} uiSchema={uiSchema} onSubmit={handleFormSubmit} readonly={readonly} noValidate={true} />
            </ErrorBoundary>
          </DialogContent>
        </Dialog>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </TodoContext.Provider>
  );
};

export default TodoCardLayout;
