class BadRequestError extends Error {
  constructor(message = 'Bad request') {
    super(message)
    this.name = 'BadRequestError'
  }
}

export default BadRequestError
