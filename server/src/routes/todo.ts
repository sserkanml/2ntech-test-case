import express from "express"
import { TodoController } from "@/controllers/todo"


const router = express.Router()
const todoController = new TodoController()

router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;