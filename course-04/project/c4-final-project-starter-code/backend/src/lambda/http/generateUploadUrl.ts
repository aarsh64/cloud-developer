import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createImageUrl } from '../s3/createImageUrl'
import { updateTodoUploadUrl } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    console.log('creating attachments url  ', todoId)
    console.log('creating attachments url for user id', userId)

    const { uploadUrl, s3Url } = createImageUrl(todoId)

    console.log('getting attachments url ', uploadUrl)

    try {
      await updateTodoUploadUrl(todoId, s3Url)

      return {
        statusCode: 201,
        body: JSON.stringify({
          uploadUrl: uploadUrl
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
