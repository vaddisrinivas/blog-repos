import { ApiClient, TodoControllerApi } from 'todoclient';
import { Todo } from 'todoclient';
function getTodoSchemaOrAPI(type, kind, args) {
  console.log('getTodoSchemaOrAPI', type, kind, args);
    if (type === 'schema') {
      return Todo;
    } else if (type === 'api') {
      const apiClient = new ApiClient();
      apiClient.defaultHeaders = {}
      console.log('apiClient', apiClient);
      switch (kind) {
        case 'list':
          return new TodoControllerApi(apiClient).listTodos(args);
        case 'create':
          return new TodoControllerApi(apiClient).createTodo(args);
        case 'update':
          return new TodoControllerApi(apiClient).createTodo(args.object,args.id);
        case 'delete':
          return new TodoControllerApi(apiClient).deleteTodo(args);
        default:
          return null;
      }
    }
  }
export default getTodoSchemaOrAPI;