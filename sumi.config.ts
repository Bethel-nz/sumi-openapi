import { defineConfig } from '@bethel-nz/sumi';

export default defineConfig({
  port: process.env.SUMI_PORT ? parseInt(process.env.SUMI_PORT) : 3000,
  logger: true,

  // Uncomment and configure as needed:
  // basePath: '/api',
  routesDir: './routes',
  middlewareDir: './middleware',

  // static: [
  //   { path: '/public/*', root: './public' }
  // ],

  // openapi: {
  //   info: {
  //     title: 'My API',
  //     version: '1.0.0'
  //   }
  // },

  docs: {
    path: '/docs',
    theme: 'purple',
  },
});
