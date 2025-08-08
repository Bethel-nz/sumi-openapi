# sumi-test

A blazing fast web API built with [Sumi](https://github.com/bethel-nz/sumi) 🔥

## Getting Started

### Development
```bash
bun run dev
```

### Project Structure
```
├── routes/                # API routes (file-based routing)
│   ├── index.ts          # GET / (with OpenAPI docs)
│   ├── simple.ts         # GET/POST /simple (minimal example)
│   └── users/            # /users/* routes
│       └── [id].ts       # GET/PATCH/DELETE /users/:id
├── middleware/           # Global middleware
│   └── _index.ts        # Request logging
└── sumi.config.ts       # Sumi configuration
```

### Zod v4 Schema Examples

**With Descriptions** (`.describe()`):
```typescript
const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive()
}).describe('User registration schema');
```

**With Registry References** (`.meta({ ref: 'Name' })`):
```typescript
const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
}).describe('User creation request').meta({ ref: 'CreateUserRequest' });
```

**Union Types with Descriptions**:
```typescript
const statusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('pending')
]).describe('User account status');
```

### Route Examples

**Simple Route** (`routes/simple.ts`):
```typescript
const messageSchema = z.object({
  text: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high']).default('medium')
}).describe('Message with priority level');

export default createRoute({
  get: (c) => c.json({ message: 'Simple endpoint' }),
  post: {
    schema: { json: messageSchema },
    handler: (c) => c.json({ received: c.valid.json })
  }
});
```

**Dynamic Route** (`routes/users/[id].ts`):
```typescript
const paramSchema = z.object({
  id: z.string().uuid()
}).describe('User ID parameter');

export default createRoute({
  get: {
    schema: { param: paramSchema },
    openapi: { 
      summary: 'Get user by ID', 
      tags: ['users'] 
    },
    handler: (c) => c.json({ id: c.valid.param.id })
  }
});
```

### Validation with Zod v4
```typescript
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Product name required'),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['electronics', 'clothing', 'books']),
  tags: z.array(z.string()).optional()
}).describe('Product creation schema').meta({ ref: 'CreateProduct' });

export default createRoute({
  post: {
    schema: { json: productSchema },
    openapi: {
      summary: 'Create a product',
      tags: ['products'],
      responses: {
        201: {
          description: 'Product created successfully',
          content: {
            'application/json': {
              schema: z.object({
                id: z.string().uuid(),
                name: z.string(),
                price: z.number(),
                createdAt: z.string().datetime()
              }).describe('Created product response')
            }
          }
        }
      }
    },
    handler: (c) => {
      const product = c.valid.json;
      return c.json({ 
        id: crypto.randomUUID(), 
        ...product, 
        createdAt: new Date().toISOString() 
      }, 201);
    }
  }
});
```

## API Documentation
Visit `/docs` when running in development mode for auto-generated API documentation.

## Commands
- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun run start` - Start production server

## Deployment
Deploy your Sumi app anywhere that supports Bun or Node.js.
