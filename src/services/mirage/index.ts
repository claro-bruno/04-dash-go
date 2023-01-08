import { faker } from '@faker-js/faker'
import {
  createServer,
  Model,
  ActiveModelSerializer,
  Response,
  Factory,
} from 'miragejs'
// import * as factories from './factories'

type User = {
  id: number
  name: string
  email: string
  created_at: Date
}

export function makeServer() {
  const server = createServer({
    serializers: {
      application: ActiveModelSerializer,
    },

    models: {
      user: Model.extend<Partial<User>>({}),
    },

    factories: {
      user: Factory.extend({
        id(i: number) {
          return i
        },
        name(i: number) {
          return `User ${i + 1}`
        },
        email() {
          return faker.internet.email().toLowerCase()
        },
        createdAt() {
          return faker.date.recent(10)
        },
      }),
    },

    seeds(server) {
      server.createList('user', 200)
    },

    routes() {
      this.namespace = 'api'
      this.timing = 750

      this.get('/users', function (schema, request) {
        const { page = 1, per_page: perPage = 10 } = request.queryParams

        const total = schema.all('user').length

        const pageStart = (Number(page) - 1) * Number(perPage)
        const pageEnd = pageStart + Number(perPage)

        const users = this.serialize(schema.all('user')).users.slice(
          pageStart,
          pageEnd,
        )

        return new Response(200, { 'x-total-count': String(total) }, { users })
      })
      this.get('/users/:id')
      this.post('/users')

      this.namespace = ''
      this.passthrough()
    },
  })

  return server
}
