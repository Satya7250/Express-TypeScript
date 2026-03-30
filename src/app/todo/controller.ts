import type { Request, Response } from "express";
import { todoValidationSchema, todoUpdateSchema, type Todo } from "../../schema/todo.schema.js";
import { number } from "zod";

class TodoController {
  private _db: Todo[];

  constructor() {
    this._db = [];
  }

  public handleGetAllTodos(req: Request, res: Response) {
    const todos = this._db;
    return res.status(200).json({ todos });
  }

  public handleGetTodoById(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const todo = this._db.find((t) => t.id === id);
    if (!todo) {
      return res.status(404).json({ message: "Invalid Id" });
    }
    return res.status(200).json({ todo });
  }

  public async handleInsertTodo(req: Request, res: Response) {
    try {
      const unvalidated = req.body;
      const validationResult =
        await todoValidationSchema.parseAsync(unvalidated);
      this._db.push(validationResult);
      return res.status(201).json({ todo: validationResult });
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  public async handleUpdateTodoById(req: Request, res: Response) {
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const id = idParam;
    const index = this._db.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Todo not found" });
    }

    try {
      const data = await todoUpdateSchema.parseAsync(req.body);
      const existingTodo = this._db[index];
      
      if (!existingTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      const updatedTodo = { ...existingTodo, ...data, id } as Todo;
      this._db[index] = updatedTodo;

      return res.status(200).json({ todo: updatedTodo });
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  public handleDeleteTodoById(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const index = this._db.findIndex((t) => t.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Todo not found" });
    }
    const [deletedTodo] = this._db.splice(index, 1);
    return res.status(200).json({ message: "Todo deleted", todo: deletedTodo });
  }
}

export default TodoController;
