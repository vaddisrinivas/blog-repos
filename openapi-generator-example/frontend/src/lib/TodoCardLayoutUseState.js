import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar'; // import Snackbar component
import Alert from '@mui/material/Alert'; // import Alert component for snackbar
import getTodoSchemaOrAPI from '../api/todoApiOpenApiClient';
import CardLayout from '../components/CardLayout';
import RSJFForm from '../components/RJSFForm';
import todoSchema from '../schemas/todoSchema';
import uiSchema from './uiSchema';
   
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

const TodoCardLayout = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [readonly, setReadOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false); // state for snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(''); // state for snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // state for snackbar severity

  const fetchData = async () => {
    setLoading(true);
    const response = await getTodoSchemaOrAPI('api', 'list', { page: currentPage, size: itemsPerPage });
    setData(response.content);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditClick = (item) => {
    setSelectedCardData(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (item) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    await getTodoSchemaOrAPI('api', 'delete', { id: item.id });

    const updatedData = data.filter((todo) => todo.id !== item.id);
    setData(updatedData);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setReadOnly(false);
  };

  const handleExpandClick = (item) => {
    setSelectedCardData(item);
    setReadOnly(true);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
        try {
            // try to update the data
            await getTodoSchemaOrAPI('api', 'update', { id: formData.id, object: formData });
            // if successful, close the modal and show a success snackbar
            setIsModalOpen(false);
            setSnackbarMessage('Todo updated successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            // if error, close the modal and show an error snackbar
            setIsModalOpen(false);
            setSnackbarMessage('Todo update failed');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
  };
  // handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
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
  );
};
export default TodoCardLayout;