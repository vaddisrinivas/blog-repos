package com.thetechcruise.openapigeneratortodo.todo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TodoRepository extends MongoRepository<Todo, String> {

    // You can add custom methods here that support pagination and filter by using the query creation from method names feature
    // For example:

    // Find all Todo objects with a given title and return a Page
    Page<Todo> findByTitle(String title, Pageable pageable);

    // Find all Todo objects with a given priority and return a Page
    Page<Todo> findByPriority(Integer priority, Pageable pageable);

    // Find all Todo objects with a given tag and return a Page
    Page<Todo> findByTagsContains(String tag, Pageable pageable);
}
