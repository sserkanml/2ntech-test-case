import { Request, Response } from 'express';
import { TodoService } from '@/services/todo';


export class TodoController {
    private todoService: TodoService;
  
    constructor() {
      this.todoService = new TodoService();
    }
  
    // Get all todos for the authenticated user
    getAllTodos = async (req: Request, res: Response): Promise<void> => {
      try {
        const todos = await this.todoService.getAllTodos(req.userId!);
        res.json(todos);
      } catch (error) {
        res.status(500).json({ 
          message: error instanceof Error ? error.message : 'Error fetching todos' 
        });
      }
    };
  
    // Get single todo (with ownership check)
    getTodoById = async (req: Request, res: Response): Promise<void> => {
      try {
        const todo = await this.todoService.getTodoById(req.params.id, req.userId!);
        res.json(todo);
      } catch (error) {
        const status = error instanceof Error && error.message === 'Todo not found' ? 404 : 500;
        res.status(status).json({ 
          message: error instanceof Error ? error.message : 'Error fetching todo' 
        });
      }
    };
  
    // Create todo for the authenticated user
    createTodo = async (req: Request, res: Response): Promise<void> => {
      try {
        const todoData = {
          ...req.body,
          user: req.userId // Add user ID from authenticated request
        };
        const newTodo = await this.todoService.createTodo(todoData);
        res.status(201).json(newTodo);
      } catch (error) {
        res.status(400).json({ 
          message: error instanceof Error ? error.message : 'Error creating todo' 
        });
      }
    };
  
    // Update todo (with ownership check)
    updateTodo = async (req: Request, res: Response): Promise<void> => {
      try {
        const updatedTodo = await this.todoService.updateTodo(
          req.params.id,
          req.userId!,
          req.body
        );
        res.json(updatedTodo);
      } catch (error) {
        const status = error instanceof Error && error.message === 'Todo not found' ? 404 : 400;
        res.status(status).json({ 
          message: error instanceof Error ? error.message : 'Error updating todo' 
        });
      }
    };
  
    // Delete todo (with ownership check)
    deleteTodo = async (req: Request, res: Response): Promise<void> => {
      try {
        await this.todoService.deleteTodo(req.params.id, req.userId!);
        res.status(200).json({ message: 'Todo deleted successfully' });
      } catch (error) {
        const status = error instanceof Error && error.message === 'Todo not found' ? 404 : 500;
        res.status(status).json({ 
          message: error instanceof Error ? error.message : 'Error deleting todo' 
        });
      }
    };
  }