import React, { useState } from 'react';
import {
  Grid,
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CardItem from './CardItem';


   
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

function CardLayout ({data, handlePageChange, handleEditClick, handleDeleteClick, handleExpandClick}) {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
    return (
    <div className="container">
      <h1>Card Layout</h1>
      <Grid container  spacing={2} justifyContent="center">
        {loading ? (
          <p>Loading...</p>
        ) : (
          data.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <CardItem item={item} handleDeleteClick={handleDeleteClick} handleEditClick={handleEditClick} handleExpandClick={handleExpandClick}  ></CardItem>
            </Grid>
          ))
        )}
      </Grid>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
        <Pagination
          count={Math.ceil(data.length / itemsPerPage)}
          page={currentPage}
          onChange={()=>{handlePageChange(currentPage, itemsPerPage)}}
        />
        <Fab
          color="primary"
          aria-label="Add"
          style={{ position: 'fixed', bottom: '20px', right: '20px' }}
          onClick={() => {
            handleEditClick({});
          }}
        >
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
};
export default CardLayout;