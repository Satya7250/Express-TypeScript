import type { Request, Response } from "express";
import { todoValidationSchema, todoUpdateSchema } from "../../schema/todo.schema.js";
import { db } from "../../db/index.js";
import { todosTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";

class TodoController {

  public async handleGetAllTodos(req: Request, res: Response) {
    try {
      const todos = await db.select().from(todosTable);
      return res.status(200).json({ todos });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  public async handleGetTodoById(req: Request, res: Response) {
    const idParam = req.params.id;
    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ message: "ID is required" });
    }
    const id = idParam;

    try {
      const [todo] = await db.select().from(todosTable).where(eq(todosTable.id, id));
      if (!todo) {
        return res.status(404).json({ message: "Invalid Id" });
      }
      return res.status(200).json({ todo });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  public async handleInsertTodo(req: Request, res: Response) {
    try {
      const unvalidated = req.body;
      const validationResult =
        await todoValidationSchema.parseAsync(unvalidated);
      
      const [todo] = await db.insert(todosTable).values({
        title: validationResult.title,
        description: validationResult.description,
        isCompleted: validationResult.isCompleted
      }).returning();

      return res.status(201).json({ todo });
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

    try {
      const data = await todoUpdateSchema.parseAsync(req.body);
      
      const [updatedTodo] = await db
        .update(todosTable)
        .set(data)
        .where(eq(todosTable.id, id))
        .returning();

      if (!updatedTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      return res.status(200).json({ todo: updatedTodo });
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  public async handleDeleteTodoById(req: Request, res: Response) {
    const idParam = req.params.id;
    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ message: "ID is required" });
    }
    const id = idParam;

    try {
      const [deletedTodo] = await db
        .delete(todosTable)
        .where(eq(todosTable.id, id))
        .returning();

      if (!deletedTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      return res.status(200).json({ message: "Todo deleted", todo: deletedTodo });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

export default TodoController;
