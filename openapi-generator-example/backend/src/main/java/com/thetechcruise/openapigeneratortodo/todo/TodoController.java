package com.thetechcruise.openapigeneratortodo.todo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin("*")
public class TodoController {

    @Autowired
    private TodoService todoService;

    // Create a new Todo object and return it as a response
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestParam(required = false) String id, @RequestBody Todo todo) {
        try {
            System.out.println(id);
            System.out.println(todo);
            if (id != null) {
                Todo updatedTodo = todoService.updateTodo(id, todo);
                return new ResponseEntity<>(updatedTodo, HttpStatus.OK);
            } else {

                    Todo createdTodo = todoService.createTodo(todo);
                    return new ResponseEntity<>(createdTodo, HttpStatus.CREATED);
                } 
        } catch (Exception e) {
                System.out.println(e);
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/")
    public ResponseEntity<Page<Todo>> listTodos(@RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "20") int size)
        {
        try {
            Pageable paging = PageRequest.of(page, size);
            Page<Todo> todos = todoService.getAll(paging);
            return new ResponseEntity<>(todos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Delete an existing Todo object by its id and return a no content response
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable String id) {
        try {
            todoService.deleteTodo(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get a Page of Todo objects by their title and return it as a response
    @GetMapping("/title/{title}")
    public ResponseEntity<Page<Todo>> getTodosByTitle(@PathVariable String title, Pageable pageable) {
        try {
            Page<Todo> todos = todoService.getTodosByTitle(title, pageable);
            return new ResponseEntity<>(todos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get a Page of Todo objects by their priority and return it as a response
    @GetMapping("/priority/{priority}")
    public ResponseEntity<Page<Todo>> getTodosByPriority(@PathVariable Integer priority, Pageable pageable) {
        try {
            Page<Todo> todos = todoService.getTodosByPriority(priority, pageable);
            return new ResponseEntity<>(todos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Get a Page of Todo objects by their tag and return it as a response
    @GetMapping("/tag/{tag}")
    public ResponseEntity<Page<Todo>> getTodosByTagsContains(@PathVariable String tag, Pageable pageable) {
        try {
            Page<Todo> todos = todoService.getTodosByTagsContains(tag, pageable);
            return new ResponseEntity<>(todos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Generic exception handler
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return new ResponseEntity<>("An error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
