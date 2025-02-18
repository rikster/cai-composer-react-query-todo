import axios from 'axios';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const STORAGE_KEY = 'todos';

// Helper function to get todos from localStorage
const getStoredTodos = (): Todo[] => {
  const todosJson = localStorage.getItem(STORAGE_KEY);
  return todosJson ? JSON.parse(todosJson) : [];
};

// Helper function to save todos to localStorage
const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

export const getTodos = async (): Promise<Todo[]> => {
  return getStoredTodos();
};

export const getTodoById = async (id: number): Promise<Todo> => {
  const todos = getStoredTodos();
  const todo = todos.find(t => t.id === id);
  if (!todo) throw new Error('Todo not found');
  return todo;
};

export const createTodo = async (title: string): Promise<Todo> => {
  const todos = getStoredTodos();
  const newTodo: Todo = {
    id: Date.now(), // Use timestamp as a simple unique ID
    title,
    completed: false,
  };
  todos.push(newTodo);
  saveTodos(todos);
  return newTodo;
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const todos = getStoredTodos();
  const index = todos.findIndex(t => t.id === todo.id);
  if (index === -1) throw new Error('Todo not found');
  todos[index] = todo;
  saveTodos(todos);
  return todo;
};

export const deleteTodo = async (id: number): Promise<void> => {
  const todos = getStoredTodos();
  const newTodos = todos.filter(t => t.id !== id);
  saveTodos(newTodos);
};