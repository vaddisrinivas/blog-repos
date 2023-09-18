import axios from 'axios';

// Define the base URL for your API
const BASE_URL = 'http://localhost:7787/api';

// Define Axios instances for different endpoints
const todoApiClient = axios.create({
  baseURL: BASE_URL,
});

// Function to get the schema (assuming Todo is an OpenAPI schema) or make API requests
async function getTodoSchemaOrAPI(type, kind, params) {
  console.log('getTodoSchemaOrAPI', type, kind, params);

  if (type === 'schema') {
    return Todo; // Assuming Todo is an OpenAPI schema
  } else if (type === 'api') {
    switch (kind) {
      case 'list':
        try {
          const response = await todoApiClient.get('/todos', { params });
          return response.data;
        } catch (error) {
          throw error;
        }
      case 'create':
        try {
          const response = await todoApiClient.post('/todos', params);
          return response.data;
        } catch (error) {
          throw error;
        }
      case 'update':
        try {
          const { id, ...todoData } = params;
          const response = await todoApiClient.put(`/todos/${id}`, todoData);
          return response.data;
        } catch (error) {
          throw error;
        }
      case 'delete':
        try {
          const response = await todoApiClient.delete(`/todos/${params}`);
          return response.data;
        } catch (error) {
          throw error;
        }
      default:
        return null;
    }
  }
}

export default getTodoSchemaOrAPI;
