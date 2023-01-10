import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext'

let cookies = parseCookies()
let isRefreshing = false
let failedRequestsQueue = []
export const authClient = axios.create({
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
        cookies = parseCookies()
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
              setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 dias
                path: '/',
              })
              setCookie(
                undefined,
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
        signOut()
      }
    }
    return Promise.reject(error)
  },
)
