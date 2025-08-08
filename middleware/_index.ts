import { Next } from 'hono';
import type { SumiContext } from '@bethel-nz/sumi';
import { createMiddleware } from '@bethel-nz/sumi/router';

/**
 * Request logging middleware using createMiddleware.
 * Logs request start and end with duration and status.
 */
export default createMiddleware({
  _: async (c: SumiContext, next: Next) => {
    const start = Date.now();
    const method = c.req.method;
    const url = new URL(c.req.url);
    const path = url.pathname;

    console.log(`🔥 [${new Date().toISOString()}] -> ${method} ${path}`);

    await next();

    const duration = Date.now() - start;
    const status = c.res.status;
    const statusEmoji = status >= 400 ? '❌' : status >= 300 ? '⚠️' : '✅';

    console.log(
      `${statusEmoji} [${new Date().toISOString()}] <- ${method} ${path} (${status}) ${duration}ms`
    );
  },
});
