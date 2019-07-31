import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todosAccess = new TodosAccess()
const todosTable = process.env.TODOS_TABLE

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return todosAccess.getUserTodos(userId)
}

export async function createTodo(userId: string, newTodo: CreateTodoRequest) {
  const newTodoItem: TodoItem = {
    todoId: uuid.v4(),
    userId: userId,
    createdAt: new Date().toISOString(),
    done: false,
    ...newTodo
  }
  console.log('creating new todo item', newTodoItem)

  await todosAccess.createTodo(newTodoItem)

  return newTodoItem
}

export async function deleteTodo(todoId: string) {
  return await todosAccess.deleteTodo(todoId)
}

export async function updateTodoUploadUrl(
  todoId: string,
  attachmentUrl: string
) {
  const updatedTodoItem = {
    TableName: todosTable,
    Key: {
      todoId: todoId
    },
    UpdateExpression: 'set attachmentUrl=:a',
    ExpressionAttributeValues: {
      ':a': attachmentUrl
    },
    ReturnValues: 'UPDATED_NEW'
  }
  console.log('updating TodoItem', updatedTodoItem)

  return await todosAccess.updateTodoItem(updatedTodoItem)
}

export async function updateTodo(
  todoId: string,
  updatedTodo: UpdateTodoRequest
) {
  const updatedTodoItem = {
    TableName: todosTable,
    Key: {
      todoId: todoId
    },
    ExpressionAttributeNames: { '#n': 'name' },
    UpdateExpression: 'set #n = :n, dueDate = :dd, done = :d',
    ExpressionAttributeValues: {
      ':n': updatedTodo.name,
      ':dd': updatedTodo.dueDate,
      ':d': updatedTodo.done
    },
    ReturnValues: 'UPDATED_NEW'
  }

  console.log('updating todo item ', updatedTodoItem)

  return await todosAccess.updateTodoItem(updatedTodoItem)
}
