import { SwaggerRouter } from 'koa-swagger-decorator';

const koaRouterOpts = { prefix: '/api' };
const swaggerRouterOpts = {
  title: 'Orion Docs',
  description: 'API DOC',
  version: '1.0.0',
  swaggerHtmlEndpoint: '/docs',
};
const router = new SwaggerRouter(koaRouterOpts, swaggerRouterOpts);

router.swagger();

router.mapDir(__dirname);

export default router;