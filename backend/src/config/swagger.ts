// src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export function setupSwagger(app: Express) {
  const PROD_URL = process.env.BACKEND_URL
    ? `${process.env.BACKEND_URL}/api`
    : "https://eventura.app.com.br/api";

  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Eventura API",
        version: "1.0.0",
        description: "Documentação completa da API Eventura",
      },
      
      servers: [
        {
          url: "http://localhost:5000/api",
          description: "Servidor local",
        },
        {
          url: PROD_URL,
          description: "Servidor de produção",
        },
      ],

      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },

      security: [{ bearerAuth: [] }],
    },

    apis: [
      `${__dirname}/../docs/*.ts`,
      `${__dirname}/../routes/*.ts`,
      `${__dirname}/../controllers/*.ts`,
      `${__dirname}/../routes/*.js`,
      `${__dirname}/../controllers/*.js`,
    ],
  };

  const swaggerSpec = swaggerJsdoc(options);

  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Eventura — Documentação API",
    })
  );
}
