package com.thetechcruise.openapigeneratortodo.todo;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    // Create a new Todo object and save it to the database
    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    // Update an existing Todo object by its id and save it to the database
    public Todo updateTodo(String id, Todo todo) throws Exception {
        // Find the Todo object by its id
        Todo existingTodo = todoRepository.findById(id).orElse(null);
        if (existingTodo == null) {
            // Throw an exception if the id is not found
            throw new Exception("Todo not found with id: " + id);
        }
        // Copy the properties from the given todo object to the existing one
        BeanUtils.copyProperties(todo,existingTodo);

        // Save the updated todo object to the database
        return todoRepository.save(existingTodo);
    }

    // Delete an existing Todo object by its id from the database
    public void deleteTodo(String id) throws Exception {
        // Find the Todo object by its id
        Todo existingTodo = todoRepository.findById(id).orElse(null);
        if (existingTodo == null) {
            // Throw an exception if the id is not found
            throw new Exception("Todo not found with id: " + id);
        }
        // Delete the existing todo object from the database
        todoRepository.delete(existingTodo);
    }

    // Get a Page of Todo objects by their title
    public Page<Todo> getTodosByTitle(String title, Pageable pageable) {
        return todoRepository.findByTitle(title, pageable);
    }

    // Get a Page of Todo objects by their priority
    public Page<Todo> getTodosByPriority(Integer priority, Pageable pageable) {
        return todoRepository.findByPriority(priority, pageable);
    }

    // Get a Page of Todo objects by their tag
    public Page<Todo> getTodosByTagsContains(String tag, Pageable pageable) {
        return todoRepository.findByTagsContains(tag, pageable);
    }

    public Page<Todo> getAll(Pageable pageable) {
        return todoRepository.findAll(pageable);
    }
}
