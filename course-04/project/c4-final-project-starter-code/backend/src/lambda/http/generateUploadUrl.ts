import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
const docClient = new AWS.DynamoDB.DocumentClient()
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

// const attachementsTable = process.env.ATTACHMENTS_TABLE
const bucketName = process.env.TODOS_ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const todosTable = process.env.TODOS_TABLE
// const todoIdIndex = process.env.USER_ID_INDEX

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    console.log('creating attachments url ', todoId)
    console.log('user id', userId)

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const url = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    })

    console.log('getting attachments url ', url)

    const updatedTodoItem = {
      TableName: todosTable,
      Key: {
        todoId: todoId
      },
      UpdateExpression: 'set attachmentUrl=:a',
      ExpressionAttributeValues: {
        ':a': `https://${bucketName}.s3.amazonaws.com/${todoId}`
      },
      ReturnValues: 'UPDATED_NEW'
    }

    console.log('======= updatedTodoItem', updatedTodoItem)

    try {
      await docClient.update(updatedTodoItem).promise()

      return {
        statusCode: 201,
        body: JSON.stringify({
          uploadUrl: url
        })
      }
    } catch (error) {
      console.error('Error in image upload, ', error)
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: `Unable to upload image for todo ${todoId}`
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
