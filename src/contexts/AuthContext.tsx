import { createContext, ReactNode, useEffect, useState } from 'react'
import Router from 'next/router'
import { setupApiClient } from '../lib/axiosAuthentication'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { authClient } from '../services/apiClient'

export type User = {
  email: string
  permissions: string[]
  roles: string[]
}

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>
  //   signOut(): void
  user: User
  isAuthenticated: boolean
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function signOut() {
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshtoken')

  Router.push('/')
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(null)
  const isAuthenticated = !!user

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()

    if (token) {
      authClient
        .get('/me')
        .then((response) => {
          const { email, permissions, roles } = response.data
          setUser({ email, permissions, roles })
        })
        .catch(() => {
          signOut()
        })
    }
  }, [])

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await authClient.post('sessions', {
        email,
        password,
      })

      const { token, refreshToken, permissions, roles } = response.data
      setUser({
        email,
        permissions,
        roles,
      })

      // pelo lado do browser o primeiro parametro será undefinied
      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/',
      })
      setCookie(undefined, 'nextauth.refreshtoken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/',
      })
      authClient.defaults.headers.Authorization = `Bearer ${token}`
      Router.push('/dash')
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}

// export function signOut() {
//   destroyCookie(undefined, 'DashGo.token')
//   destroyCookie(undefined, 'DashGo.refreshToken')

//   Router.push('/')
// }
