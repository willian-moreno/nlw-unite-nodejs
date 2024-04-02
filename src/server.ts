import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { createEvent } from './routes/create-events';
import { getAttendeBadge } from './routes/get-attendee-badge';
import { getEvent } from './routes/get-event';
import { registerForEvent } from './routes/register-for-event';

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeBadge)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server is running at port 3333');
})