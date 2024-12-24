import Todo, { ITodo } from "@/models/Todo";

interface TodoInput {
    title: string;
    description: string;
    completed?: boolean;
    user: string; // User ID
  }
  
  export class TodoService {
    // Get all todos for a specific user
    async getAllTodos(userId: string): Promise<ITodo[]> {
      try {
        return await Todo.find({ user: userId })
          .sort({ createdAt: -1 })
          .populate('user', 'name email'); // Optionally populate user details
      } catch (error) {
        throw new Error('Error fetching todos');
      }
    }
  
    // Get single todo (with user ownership check)
    async getTodoById(id: string, userId: string): Promise<ITodo | null> {
      try {
        const todo = await Todo.findOne({ _id: id, user: userId })
          .populate('user', 'name email');
        
        if (!todo) {
          throw new Error('Todo not found');
        }
        return todo;
      } catch (error) {
        throw new Error('Error fetching todo');
      }
    }
  
    // Create todo with user reference
    async createTodo(todoData: TodoInput): Promise<ITodo> {
      try {
        const newTodo = new Todo({
          title: todoData.title,
          description: todoData.description,
          completed: todoData.completed || false,
          user: todoData.user
        });
        return await newTodo.save();
      } catch (error) {
        throw new Error('Error creating todo');
      }
    }
  
    // Update todo (with user ownership check)
    async updateTodo(id: string, userId: string, todoData: Partial<TodoInput>): Promise<ITodo | null> {
      try {
        // Exclude user field from updates
        const { user, ...updateData } = todoData;
        
        const updatedTodo = await Todo.findOneAndUpdate(
          { _id: id, user: userId }, // Ensure todo belongs to user
          { $set: updateData },
          { new: true, runValidators: true }
        ).populate('user', 'name email');
  
        if (!updatedTodo) {
          throw new Error('Todo not found');
        }
  
        return updatedTodo;
      } catch (error) {
        throw new Error('Error updating todo');
      }
    }
  
    // Delete todo (with user ownership check)
    async deleteTodo(id: string, userId: string): Promise<void> {
      try {
        const deletedTodo = await Todo.findOneAndDelete({ _id: id, user: userId });
        
        if (!deletedTodo) {
          throw new Error('Todo not found');
        }
      } catch (error) {
        throw new Error('Error deleting todo');
      }
    }
  }