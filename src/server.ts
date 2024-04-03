import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

import { fastifySwaggerConfig } from './swagger';

import { fastifyCorsConfig } from './cors';
import { errorHandler } from './error-handler';
import { checkIn } from './routes/check-in';
import { createEvent } from './routes/create-events';
import { getAttendeBadge } from './routes/get-attendee-badge';
import { getEvent } from './routes/get-event';
import { getEventAttendees } from './routes/get-event-attendees';
import { registerForEvent } from './routes/register-for-event';

const app = fastify()

fastifyCorsConfig(app)
fastifySwaggerConfig(app)

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeBadge)
app.register(checkIn)
app.register(getEventAttendees)

app.setErrorHandler(errorHandler)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server is running at port 3333');
})