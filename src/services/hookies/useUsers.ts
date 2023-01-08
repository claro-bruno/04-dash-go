import { api } from '../../lib/axios'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

type User = {
  id: number
  name: string
  email: string
  created_at: string
}

type GetUsersResponse = {
  totalCount: number
  users: User[]
}

export async function getUsers(page: number): Promise<GetUsersResponse> {
  const { data, headers } = await api.get('users', {
    params: {
      page,
    },
  })
  const totalCount = Number(headers['x-total-count'])

  const users = data.users.map((user: User) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: new Date(user.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    }
  })

  return { users, totalCount }
}

export function useUsers(page: number, options: UseQueryOptions) {
  return useQuery(['users', page], () => getUsers(page), {
    //  return useQuery<User[]>(['users'], getUsers, {
    staleTime: 1000 * 60 * 10, // 10 minutos
    ...options,
  })
}
