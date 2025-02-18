'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTodos, createTodo, updateTodo, deleteTodo, type Todo } from '@/services/api';
import { useState } from 'react';

export default function TodoList() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const queryClient = useQueryClient();

  // Query for fetching todos
  const { data: todos, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  // Mutation for creating a todo
  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo) => {
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] = []) => [
        ...oldTodos,
        newTodo,
      ]);
    },
  });

  // Mutation for updating a todo
  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] = []) =>
        oldTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        )
      );
    },
  });

  // Mutation for deleting a todo
  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] = []) =>
        oldTodos.filter((todo) => todo.id !== deletedId)
      );
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      
      {/* Add new todo form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newTodoTitle.trim()) {
            createTodoMutation.mutate(newTodoTitle);
            setNewTodoTitle('');
          }
        }}
        className="mb-4"
      >
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="border p-2 mr-2 rounded"
          placeholder="New todo title"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={createTodoMutation.isPending}
        >
          Add Todo
        </button>
      </form>

      {/* Todo list */}
      <ul className="space-y-2">
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between border p-2 rounded"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  updateTodoMutation.mutate({
                    ...todo,
                    completed: !todo.completed,
                  })
                }
              />
              <span className={todo.completed ? 'line-through' : ''}>
                {todo.title}
              </span>
            </div>
            <button
              onClick={() => deleteTodoMutation.mutate(todo.id)}
              className="text-red-500"
              disabled={deleteTodoMutation.isPending}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 