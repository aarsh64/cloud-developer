import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import * as AWS from 'aws-sdk

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  var updatedTodoItem = {
    TableName: todosTable,
    Key: {
      todoId: todoId
    },
    UpdateExpression: 'set name = :n, dueDate = :dd, done = :d',
    ExpressionAttributeValues: {
      ':n': updatedTodo.name,
      ':dd': updatedTodo.dueDate,
      ':d': updatedTodo.done
    },
    ReturnValues: 'UPDATED_NEW'
  }
  console.log('updating item', updatedTodo)

  try {
    await docClient.update(updatedTodoItem).promise()

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        updatedTodo
      })
    }
  } catch (error) {
    console.log('Failed to update todo ', error)
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  }
}
