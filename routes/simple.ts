import { z } from 'zod';
import { createRoute } from '@bethel-nz/sumi/router';
import { resolver } from 'hono-openapi/zod';

const messageSchema = z
  .object({
    text: z.string().min(1, 'Message text is required'),
    priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  })
  .describe('Message request schema for simple endpoint')
  .meta({ ref: 'MessageRequest' });

const messageResponseSchema = z
  .object({
    received: z.string(),
    echo: z.string(),
    length: z.number(),
    priority: z.enum(['low', 'medium', 'high']),
  })
  .describe('Message response with echo and metadata');

export default createRoute({
  get: {
    middleware: ['request_track'], // Apply the tracking middleware
    schema: {
      param: z.object({
        id: z.string().min(1).optional(),
      }),
    },
    handler: (c) => {
      // Access tracking info if needed
      const trackInfo = (c as any).requestTrack;
      const params = c.req.valid('param');

      return c.json({
        message: 'Simple GET endpoint with tracking',
        timestamp: trackInfo?.timestamp || Date.now(),
        requestCount: trackInfo?.requestCount,
        status: 'active',
        ...(params.id && { id: params.id }),
      });
    },
  },

  post: {
    middleware: ['request_track'], // Also track POST requests
    schema: {
      param: z.object({
        id: z.string().min(1).optional(),
      }),
      json: messageSchema,
    },
    openapi: {
      summary: 'Echo message with tracking',
      description:
        'Accepts a message and echoes it back with metadata and tracking info',
      tags: ['simple'],
      responses: {
        201: {
          description: 'Message processed successfully',
          content: {
            'application/json': {
              schema: resolver(messageResponseSchema),
            },
          },
        },
      },
    },
    handler: (c) => {
      const { text, priority } = c.req.valid('json');
      const params = c.req.valid('param');
      const trackInfo = (c as any).requestTrack;

      return c.json(
        {
          received: text,
          echo: `You said: "${text}" (Request #${
            trackInfo?.requestCount || 'unknown'
          })`,
          length: text.length,
          priority,
          timestamp: trackInfo?.timestamp,
          ...(params.id && { id: params.id }),
        },
        201
      );
    },
  },
});
