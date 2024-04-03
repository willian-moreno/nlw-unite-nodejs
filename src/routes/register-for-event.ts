import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { Conflict } from '../_errors/conflict';
import { NotFound } from '../_errors/not-found';
import { prisma } from '../lib/prisma';

const routeSchema = {
  summary: 'Register an attendee',
  tags: ['attendees'],
  body: z.object({
    name: z.string().min(4),
    email: z.string().email(),
  }),
  params: z.object({
    eventId: z.string().uuid(),
  }),
  response: {
    201: z.object({
      attendeeId: z.number(),
    }),
    404: z.object({
      statusCode: z.number().int(),
      statusText: z.string(),
      message: z.string(),
    }),
    409: z.object({
      statusCode: z.number().int(),
      statusText: z.string(),
      message: z.string(),
    }),
  }
}

export async function registerForEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/attendees', { schema: routeSchema }, async (request, reply) => {
      const { eventId } = request.params
      const { name, email } = request.body

      const event = await prisma.event.findUnique({
        select: {
          maximumAttendees: true,
        },
        where: {
          id: eventId
        }
      })

      if (event === null) {
        throw new NotFound('Event not found.')
      }

      const [
        attendeeFromEmail,
        amountOfAttendeesForEvent
      ] = await Promise.all([
        prisma.attendee.findUnique({
          select: {
            id: true,
          },
          where: {
            eventId_email: {
              email,
              eventId
            }
          }
        }),

        prisma.attendee.count({
          where: {
            eventId,
          }
        })
      ])

      if (attendeeFromEmail !== null) {
        throw new Conflict('This e-mail is already registered for this event.')
      }

      if (event.maximumAttendees && amountOfAttendeesForEvent >= event.maximumAttendees) {
        throw new Conflict('The maximum number of attendees for this event has been reached.')
      }

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
        }
      })

      return reply
        .status(201)
        .send({
          attendeeId: attendee.id
        })
    })
}