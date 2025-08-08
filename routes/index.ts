import { z } from 'zod';
import { createRoute } from '@bethel-nz/sumi/router';
import { resolver } from 'hono-openapi/zod';

const querySchema = z
  .object({
    name: z.string().optional().default('World'),
  })
  .describe('Query parameters for welcome endpoint');

const responseSchema = z
  .object({
    message: z.string(),
    timestamp: z.string(),
  })
  .describe('Welcome response with personalized message');

export default createRoute({
  get: {
    schema: {
      query: querySchema,
    },
    openapi: {
      summary: 'Welcome endpoint',
      description: 'Returns a personalized welcome message with timestamp',
      tags: ['welcome'],
      responses: {
        200: {
          description: 'Welcome message with timestamp',
          content: {
            'application/json': {
              schema: resolver(responseSchema), // Correctly called once
            },
          },
        },
      },
    },
    handler: (c) => {
      const { name } = c.req.valid('query');
      return c.json({
        message: `Hello, ${name}! Welcome to your Sumi API 🔥`,
        timestamp: new Date().toISOString(),
      });
    },
  },
});
