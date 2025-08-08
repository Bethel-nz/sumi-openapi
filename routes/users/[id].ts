import { z } from 'zod';
import { createRoute } from '@bethel-nz/sumi/router';
import { resolver } from 'hono-openapi/zod';

const paramSchema = z
  .object({
    id: z.string().min(1, 'User ID is required'),
  })
  .describe('User ID parameter schema');

const userResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.string(),
  })
  .describe('User data response schema');

const updateUserSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
  })
  .describe('User update request schema')
  .meta({ ref: 'UpdateUserRequest' });

const errorResponseSchema = z
  .object({
    error: z.string(),
    message: z.string(),
  })
  .describe('Standard error response');

export default createRoute({
  get: {
    schema: {
      param: paramSchema,
    },
    openapi: {
      summary: 'Get user by ID',
      description: 'Retrieve a specific user by their unique identifier',
      tags: ['users'],
      responses: {
        200: {
          description: 'User found successfully',
          content: {
            'application/json': {
              schema: resolver(userResponseSchema),
            },
          },
        },
        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: resolver(errorResponseSchema),
            },
          },
        },
      },
    },
    handler: (c) => {
      const { id } = c.req.valid('param');

      // TODO: Replace with actual database lookup
      if (id === '404') {
        return c.json(
          {
            error: 'Not Found',
            message: `User with ID ${id} not found`,
          },
          404
        );
      }

      return c.json({
        id,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date().toISOString(),
      });
    },
  },

  patch: {
    schema: {
      param: paramSchema,
      json: updateUserSchema,
    },
    openapi: {
      summary: 'Update user',
      description: 'Partially update a user by ID',
      tags: ['users'],
      responses: {
        200: {
          description: 'User updated successfully',
          content: {
            'application/json': {
              schema: resolver(userResponseSchema),
            },
          },
        },
        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: resolver(errorResponseSchema),
            },
          },
        },
      },
    },
    handler: (c) => {
      const { id } = c.req.valid('param');
      const updates = c.req.valid('json');

      // TODO: Replace with actual database update
      return c.json({
        id,
        name: updates.name || 'John Doe',
        email: updates.email || 'john@example.com',
        createdAt: '2024-01-01T00:00:00Z',
      });
    },
  },

  delete: {
    schema: {
      param: paramSchema,
    },
    openapi: {
      summary: 'Delete user',
      description: 'Remove a user by ID',
      tags: ['users'],
      responses: {
        204: {
          description: 'User deleted successfully',
        },
        404: {
          description: 'User not found',
        },
      },
    },
    handler: (c) => {
      const { id } = c.req.valid('param');

      // TODO: Replace with actual database deletion
      return new Response(null, { status: 204 });
    },
  },
});
