import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { Conflict } from '../_errors/conflict';
import { prisma } from '../lib/prisma';

const routeSchema = {
  summary: 'Check-in an attendee',
  tags: ['check-ins'],
  params: z.object({
    attendeeId: z.coerce.number().int(),
  }),
  response: {
    201: z.null(),
    409: z.object({
      statusCode: z.number().int(),
      statusText: z.string(),
      message: z.string(),
    }),
  },
}

export async function checkIn(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/check-in', { schema: routeSchema }, async (request, reply) => {
      const { attendeeId } = request.params

      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId,
        }
      })

      if (attendeeCheckIn !== null) {
        throw new Conflict('Attendee already checked in.')
      }

      await prisma.checkIn.create({
        data: {
          attendeeId,
        },
      })

      return reply
        .status(201)
        .send()
    })
} 