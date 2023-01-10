export class AuthTokenEror extends Error {
  constructor() {
    super('Error With Authentication token')
  }
}
