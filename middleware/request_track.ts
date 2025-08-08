import { Next } from 'hono';
import type { SumiContext } from '@bethel-nz/sumi';
import { createMiddleware } from '@bethel-nz/sumi/router';

// In-memory store for request counts per endpoint
const requestCounts = new Map<string, number>();

/**
 * Request tracking middleware
 * Tracks and logs the number of times each endpoint is requested
 *
 * Usage: Add 'request_track' to the middleware array in any route
 * Example: middleware: ['request_track']
 */
export default createMiddleware({
  _: async (c: SumiContext, next: Next) => {
    const method = c.req.method;
    const path = new URL(c.req.url).pathname;
    const endpointId = `${method}:${path}`;

    // Increment request count for this endpoint
    const currentCount = requestCounts.get(endpointId) || 0;
    const newCount = currentCount + 1;
    requestCounts.set(endpointId, newCount);

    // Log the tracking info
    console.log(
      `📊 [Request Tracker] Endpoint: ${endpointId} | Request #${newCount}`
    );

    // Add tracking info to request context (optional - for use in route handlers)
    (c as any).requestTrack = {
      endpointId,
      requestCount: newCount,
      timestamp: new Date().toISOString(),
    };

    await next();

    // Log completion
    console.log(
      `📊 [Request Tracker] Completed ${endpointId} | Total requests: ${newCount}`
    );
  },
});
