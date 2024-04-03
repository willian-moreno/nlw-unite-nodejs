import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { NotFound } from '../_errors/not-found';
import { prisma } from '../lib/prisma';

const routeSchema = {
  summary: 'Get an event',
  tags: ['events'],
  params: z.object({
    eventId: z.string().uuid(),
  }),
  response: {
    200: z.object({
      event: z.object({
        id: z.string().uuid(),
        title: z.string(),
        details: z.string().nullable(),
        slug: z.string(),
        maximumAttendees: z.number().nullable(),
        attendeesAmount: z.number().int(),
      }),
    }),
    404: z.object({
      statusCode: z.number().int(),
      statusText: z.string(),
      message: z.string(),
    }),
  },
}

export async function getEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId', { schema: routeSchema }, async (request, reply) => {

      const { eventId } = request.params

      const event = await prisma.event.findUnique({
        select: {
          id: true,
          title: true,
          details: true,
          slug: true,
          maximumAttendees: true,
          _count: {
            select: {
              attendees: true,
            }
          }
        },
        where: {
          id: eventId
        }
      })

      if (event === null) {
        throw new NotFound('Event not found.')
      }

      return reply
        .status(200)
        .send({
          event: {
            id: event.id,
            title: event.title,
            details: event.details,
            slug: event.slug,
            maximumAttendees: event.maximumAttendees,
            attendeesAmount: event._count.attendees,
          }
        })
    })
}