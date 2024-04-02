import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const routeSchema = {
  params: z.object({
    attendeeId: z.coerce.number().int(),
  }),
  response: {
    200: z.object({
      attendee: z.object({
        name: z.string(),
        email: z.string().email(),
        eventTitle: z.string(),
      }),
    }),
    404: z.object({
      statusCode: z.number().int(),
      statusText: z.string(),
      message: z.string(),
    }),
  },
}

export async function getAttendeBadge(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/badge', { schema: routeSchema }, async (request, reply) => {
      const { attendeeId } = request.params

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true,
            },
          },
        },
        where: {
          id: attendeeId
        }
      })

      if (attendee === null) {
        return reply
          .status(404)
          .send({
            statusCode: 404,
            statusText: 'Not found',
            message: 'Attendee not found.'
          })
      }

      return reply
        .status(200)
        .send({
          attendee: {
            name: attendee.name,
            email: attendee.email,
            eventTitle: attendee.event.title,
          }
        })
    })
}