import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { NotFound } from '../_errors/not-found';
import { prisma } from '../lib/prisma';

const routeSchema = {
  summary: 'Get all attendees from event',
  tags: ['events'],
  params: z.object({
    eventId: z.string().uuid(),
  }),
  querystring: z.object({
    query: z.string().nullish(),
    pageIndex: z.string().nullish().default('0').transform(Number),
  }),
  response: {
    200: z.object({
      attendees: z.array(
        z.object({
          id: z.number().int(),
          name: z.string(),
          email: z.string().email(),
          createdAt: z.date(),
          checkedInAt: z.date().nullable(),
        })
      ),
    }),
    404: z.object({
      statusCode: z.number().int(),
      statusText: z.string(),
      message: z.string(),
    }),
  },
}

export async function getEventAttendees(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId/attendees', { schema: routeSchema }, async (request, reply) => {
      const { eventId } = request.params
      const { query, pageIndex } = request.query

      const event = await prisma.event.findUnique({
        select: {
          id: true,
        },
        where: {
          id: eventId,
        },
      })

      if (event === null) {
        throw new NotFound('Event not found.')
      }

      const attendees = await prisma.attendee.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          checkIn: {
            select: {
              createdAt: true,
            },
          },
        },
        where: query ? {
          eventId,
          name: {
            contains: query,
          },
        } : {
          eventId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        skip: pageIndex * 10,
      })

      const mappedAttendees = attendees.map((attendee) => ({
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        createdAt: attendee.createdAt,
        checkedInAt: attendee.checkIn?.createdAt ?? null,
      }))

      return reply
        .status(200)
        .send({
          attendees: mappedAttendees
        })
    })
}