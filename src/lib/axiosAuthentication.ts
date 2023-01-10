import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext'
import { AuthTokenEror } from '../errors/AuthTokenError'

let isRefreshing = false
let failedRequestsQueue = []

export function setupApiClient(ctx = undefined) {
  let cookies = parseCookies(ctx)
  const authClient = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`,
    },
  })

  authClient.interceptors.response.use(
    (response) => {
      return response
    },
    (error: AxiosError) => {
      if (error.response.status === 401) {
        if (error.response.data?.code === 'token.expired') {
          cookies = parseCookies(ctx)
          const { 'nextauth.refreshToken': refreshToken } = cookies
          const { config: originalConfig } = error

          if (!isRefreshing) {
            isRefreshing = true
            authClient
              .post('/refresh', {
                refreshToken,
              })
              .then((response) => {
                const { token } = response.data
                setCookie(ctx, 'nextauth.token', token, {
                  maxAge: 60 * 60 * 24 * 30, // 30 dias
                  path: '/',
                })
                setCookie(
                  ctx,
                  'nextauth.refreshtoken',
                  response.data.refreshToken,
                  {
                    maxAge: 60 * 60 * 24 * 30, // 30 dias
                    path: '/',
                  },
                )

                authClient.defaults.headers.Authorization = `Bearer ${token}`
                failedRequestsQueue.forEach((request) => request.resolve(token))
                failedRequestsQueue = []
              })
              .catch((err) => {
                failedRequestsQueue.forEach((request) => request.reject(err))
                failedRequestsQueue = []
              })
              .finally(() => {
                isRefreshing = false
              })
          }
          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              resolve: (token: string) => {
                // eslint-disable-next-line dot-notation
                originalConfig.headers['Authorization'] = `Bearer ${token}`
                resolve(authClient(originalConfig))
              },
              reject: (err: AxiosError) => {
                reject(err)
              },
            })
          })
        } else {
          if (process.browser) {
            signOut()
          } else {
            return Promise.reject(new AuthTokenEror())
          }
        }
      }
      return Promise.reject(error)
    },
  )
  return authClient
}
