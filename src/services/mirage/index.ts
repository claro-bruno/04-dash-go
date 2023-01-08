import { createServer, Factory, Model } from 'miragejs'
import { faker } from '@faker-js/faker'

type User = {
  id: number
  name: string
  email: string
  created_at: string
}

export function makeServer() {
  const server = createServer({
    models: {
      user: Model.extend<Partial<User>>({}),
    },

    factories: {
      user: Factory.extend({
        id(index: number) {
          return index
        },
        name(index: number) {
          return `User ${index + 1}`
        },
        email(index: number) {
          return faker.internet.email().toLowerCase()
        },
        created_at() {
          return faker.date.recent(10, new Date())
        },
      }),
    },

    seeds(server) {
      server.createList('user', 10)
    },

    routes() {
      this.namespace = 'api'
      this.timing = 750

      this.get('/users')
      this.post('/users')

      this.namespace = ''
      this.passthrough()
    },
  })
  // server.listen(3000)
  return server
}
