import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
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
          item: updatedTodo
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
)

handler.use(
  cors({
    credentials: true
  })
)
