import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { NotFound } from '../_errors/not-found';
import { prisma } from '../lib/prisma';

const routeSchema = {
  summary: 'Get an attendee badge',
  tags: ['attendees'],
  params: z.object({
    attendeeId: z.coerce.number().int(),
  }),
  response: {
    200: z.object({
      badge: z.object({
        name: z.string(),
        email: z.string().email(),
        eventTitle: z.string(),
        checkInURL: z.string().url()
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
        throw new NotFound('Attendee not found.')
      }

      const { protocol, hostname } = request
      const baseURL = `${protocol}://${hostname}`
      const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL)

      return reply
        .status(200)
        .send({
          badge: {
            name: attendee.name,
            email: attendee.email,
            eventTitle: attendee.event.title,
            checkInURL: checkInURL.toString(),
          }
        })
    })
}