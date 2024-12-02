import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { Express } from 'express';

export const setupSwagger = (app: Express) => {
  const options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: '面包店管理系统 API',
        version: '1.0.0',
        description: '面包店管理系统的 API 文档',
      },
      servers: [
        {
          url: '/Bakery-LY/api/v1',
          description: '开发服务器',
        },
      ],
    },
    apis: [
      './src/routes/*.ts',
      './src/models/*.ts',
      './src/controllers/*.ts',
    ],
  };

  const swaggerSpec = swaggerJSDoc(options);
  app.use('/Bakery-LY', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
