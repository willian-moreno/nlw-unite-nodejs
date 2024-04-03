import { FastifyInstance } from 'fastify'
import http from 'http'

import { ZodError } from 'zod'
import { Conflict } from './_errors/conflict'
import { NotFound } from './_errors/not-found'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      statusText: http.STATUS_CODES[400]!,
      message: 'Error during validation.',
      errors: error.flatten().fieldErrors
    })
  }

  if (error instanceof NotFound) {
    return reply.status(404).send({
      statusCode: 404,
      statusText: http.STATUS_CODES[404]!,
      message: error.message
    })
  }

  if (error instanceof Conflict) {
    return reply.status(409).send({
      statusCode: 409,
      statusText: http.STATUS_CODES[409]!,
      message: error.message
    })
  }

  return reply.status(500).send({
    statusCode: 500,
    statusText: http.STATUS_CODES[500]!,
    message: 'Internal server error.'
  })
}