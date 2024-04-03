import fastifyCors from '@fastify/cors';
import { FastifyInstance } from 'fastify';

export async function fastifyCorsConfig(app: FastifyInstance) {
  app.register(fastifyCors, {
    origin: '*',
  })
}