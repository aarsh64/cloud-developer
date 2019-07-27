import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as uuid from 'uuid'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  console.log('creating todo', newTodo)

  // TODO: Implement creating a new TODO item
  const newTodoItem: TodoItem = {
    userId: getUserId(event),
    todoId: uuid.v4(),
    createdAt: new Date().toISOString(),
    done: false,
    ...newTodo
  }
  console.log('creating new todo item', newTodoItem)

  await docClient
    .put({
      TableName: todosTable,
      Item: newTodoItem
    })
    .promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newTodoItem
    })
  }
}
