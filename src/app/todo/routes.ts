import {Router} from 'express'
import TodoController from './controller.js';

const router = Router();
const controller = new TodoController()

//#region //*========== routes ==========

router.get('/', controller.handleGetAllTodos.bind(controller))

router.get('/:id', controller.handleGetTodoById.bind(controller))

router.post('/', controller.handleInsertTodo.bind(controller))

router.put('/:id', controller.handleUpdateTodoById.bind(controller))

router.delete('/:id', controller.handleDeleteTodoById.bind(controller))

//#endregion //*========== routes ==========

export default router