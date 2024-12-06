import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { Express } from 'express';
import jwt from 'jsonwebtoken';

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
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [{
        bearerAuth: []
      }]
    },
    apis: [
      './src/routes/*.ts',
      './src/models/*.ts',
      './src/controllers/*.ts',
    ],
  };

  const swaggerSpec = swaggerJSDoc(options);
  
  // 设置默认的认证 token
  const swaggerUiOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      initOAuth: {
        useBasicAuthenticationWithAccessCodeGrant: false
      },
      authAction: {
        bearerAuth: {
          name: "bearerAuth",
          schema: {
            type: "http",
            in: "header",
            scheme: "bearer",
            bearerFormat: "JWT"
          },
          value: "Bearer " + jwt.sign(
            { adminId: 1 }, // 确保这个 adminId 在数据库中存在
            process.env.JWT_SECRET || '',
            { expiresIn: '365d' }
          )
        }
      }
    }
  };

  app.use('/Bakery-LY', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
};