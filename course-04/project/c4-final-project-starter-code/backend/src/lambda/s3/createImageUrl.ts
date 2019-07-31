import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const bucketName = process.env.TODOS_ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export function createImageUrl(todoId: string) {
  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })

  const s3Url = `https://${bucketName}.s3.amazonaws.com/${todoId}`

  return {
    uploadUrl,
    s3Url
  }
}
