const apiId = 'vb7jy23hfi' // API Gateway
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-hm1pqgk7.auth0.com', // Domain from Auth0
  clientId: '55TxqMmoCPa95X5UHf926RsikQjgfcA0', // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
